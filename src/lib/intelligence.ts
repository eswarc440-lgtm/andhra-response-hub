import type { Incident, IncidentCategory, LatLng, ResponseTeam, Severity, Shelter, Hospital } from "./demo/types";

/**
 * DISASTER INTELLIGENCE ENGINE (baseline, explainable heuristics).
 *
 * Every function returns the factors behind its output so the interface can
 * present an AI-assisted recommendation rather than an opaque verdict.
 * These baselines are intentionally modular: swap the internals for a
 * transformer-based service without changing the calling code.
 */

export interface Factor {
  label: string;
  effect: "positive" | "negative" | "neutral";
  weight?: number;
}

/* ------------------------------------------------------------------ */
/* Geospatial helpers (stand-in for PostGIS distance queries)          */
/* ------------------------------------------------------------------ */

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function etaMinutes(distanceKm: number, roadAccessible: boolean): number {
  const speed = roadAccessible ? 34 : 14; // kmph, degraded during flooding
  return Math.max(3, Math.round((distanceKm / speed) * 60));
}

/* ------------------------------------------------------------------ */
/* 1. Incident classification                                          */
/* ------------------------------------------------------------------ */

const KEYWORDS: Record<IncidentCategory, string[]> = {
  RESCUE_REQUEST: ["stranded", "rooftop", "trapped", "rescue", "boat", "evacuate", "marooned"],
  MEDICAL_EMERGENCY: ["patient", "cardiac", "injury", "bleeding", "pregnant", "dialysis", "ambulance", "medicine"],
  FLOOD: ["flood", "water entering", "inundated", "submerged", "river", "spill", "backwater"],
  ROAD_DAMAGE: ["road", "washed out", "pothole", "carriageway", "diversion"],
  BRIDGE_DAMAGE: ["bridge", "culvert", "approach slab", "scour"],
  FIRE: ["fire", "smoke", "burning", "short circuit"],
  SHELTER_ISSUE: ["shelter", "camp", "roof", "leaking", "toilet", "overcrowded"],
  FOOD_SHORTAGE: ["food", "ration", "meals", "hungry", "kitchen"],
  WATER_SHORTAGE: ["drinking water", "borewell", "contamination", "muddy water", "tanker"],
  INFRASTRUCTURE_DAMAGE: ["transformer", "power", "electric", "pump", "embankment", "substation"],
};

export interface ClassificationResult {
  category: IncidentCategory;
  confidence: number;
  alternatives: { category: IncidentCategory; confidence: number }[];
  matchedTerms: string[];
}

export function classifyIncident(text: string): ClassificationResult {
  const lower = text.toLowerCase();
  const scored = (Object.keys(KEYWORDS) as IncidentCategory[]).map((category) => {
    const matched = KEYWORDS[category].filter((k) => lower.includes(k));
    return { category, score: matched.length, matched };
  });
  scored.sort((a, b) => b.score - a.score);
  const total = scored.reduce((s, r) => s + r.score, 0) || 1;
  const top = scored[0]!;
  const base = top.score === 0 ? 0.34 : Math.min(0.96, 0.45 + (top.score / total) * 0.5);

  return {
    category: top.score === 0 ? "FLOOD" : top.category,
    confidence: Math.round(base * 100) / 100,
    alternatives: scored
      .slice(1, 4)
      .filter((s) => s.score > 0)
      .map((s) => ({ category: s.category, confidence: Math.round((s.score / total) * 100) / 100 })),
    matchedTerms: top.matched,
  };
}

/* ------------------------------------------------------------------ */
/* 2. Duplicate detection                                              */
/* ------------------------------------------------------------------ */

function tokenSet(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((t) => t.length > 3),
  );
}

export function textSimilarity(a: string, b: string): number {
  const sa = tokenSet(a);
  const sb = tokenSet(b);
  if (sa.size === 0 || sb.size === 0) return 0;
  let shared = 0;
  sa.forEach((t) => {
    if (sb.has(t)) shared += 1;
  });
  return shared / new Set([...sa, ...sb]).size;
}

export interface DuplicateCandidate {
  incident: Incident;
  probability: number;
  distanceKm: number;
  hoursApart: number;
  textScore: number;
}

export function findDuplicates(target: Incident, pool: Incident[]): DuplicateCandidate[] {
  return pool
    .filter((i) => i.id !== target.id)
    .map((incident) => {
      const distanceKm = haversineKm(target.location, incident.location);
      const hoursApart =
        Math.abs(new Date(target.reportedAt).getTime() - new Date(incident.reportedAt).getTime()) / 3_600_000;
      const textScore = textSimilarity(
        `${target.title} ${target.description}`,
        `${incident.title} ${incident.description}`,
      );
      const distScore = Math.max(0, 1 - distanceKm / 3);
      const timeScore = Math.max(0, 1 - hoursApart / 12);
      const sameCategory = target.category === incident.category ? 0.12 : 0;
      const probability = Math.min(
        0.99,
        textScore * 0.45 + distScore * 0.33 + timeScore * 0.2 + sameCategory,
      );
      return { incident, probability, distanceKm, hoursApart, textScore };
    })
    .filter((c) => c.probability >= 0.35)
    .sort((a, b) => b.probability - a.probability);
}

/* ------------------------------------------------------------------ */
/* 3. Trust / confidence score                                         */
/* ------------------------------------------------------------------ */

export interface TrustResult {
  score: number;
  factors: Factor[];
}

export function trustScore(incident: Incident, pool: Incident[]): TrustResult {
  let score = 48;
  const factors: Factor[] = [];

  if (incident.gpsAccuracyMeters <= 15) {
    score += 14;
    factors.push({ label: `GPS location verified (±${incident.gpsAccuracyMeters} m)`, effect: "positive", weight: 14 });
  } else {
    score -= 8;
    factors.push({ label: `Low GPS accuracy (±${incident.gpsAccuracyMeters} m)`, effect: "negative", weight: 8 });
  }

  if (incident.hasEvidence) {
    score += 16;
    factors.push({ label: "Photo or video evidence attached", effect: "positive", weight: 16 });
  } else {
    score -= 10;
    factors.push({ label: "No evidence attached", effect: "negative", weight: 10 });
  }

  const nearby = pool.filter(
    (i) => i.id !== incident.id && haversineKm(i.location, incident.location) < 2.5,
  ).length;
  if (nearby > 0) {
    score += Math.min(12, nearby * 6);
    factors.push({ label: `${nearby} similar report(s) nearby`, effect: "positive", weight: Math.min(12, nearby * 6) });
  } else {
    factors.push({ label: "No corroborating nearby reports", effect: "neutral" });
  }

  if (incident.reporterReportCount >= 5) {
    score += 10;
    factors.push({ label: `Established reporter (${incident.reporterReportCount} prior reports)`, effect: "positive", weight: 10 });
  } else {
    score -= 6;
    factors.push({ label: "First-time or infrequent reporter", effect: "negative", weight: 6 });
  }

  if (incident.reporterRole === "FIELD_OFFICER") {
    score += 12;
    factors.push({ label: "Reported by authorised field officer", effect: "positive", weight: 12 });
  }

  if (incident.verifiedBy) {
    score += 14;
    factors.push({ label: `Field-verified by ${incident.verifiedBy}`, effect: "positive", weight: 14 });
  }

  return { score: Math.max(5, Math.min(98, Math.round(score))), factors };
}

/* ------------------------------------------------------------------ */
/* 4. Priority recommendation                                          */
/* ------------------------------------------------------------------ */

export interface PriorityResult {
  priority: Severity;
  score: number;
  factors: Factor[];
}

const LIFE_THREAT: IncidentCategory[] = ["RESCUE_REQUEST", "MEDICAL_EMERGENCY", "FIRE"];

export function priorityRecommendation(incident: Incident, pool: Incident[]): PriorityResult {
  let score = 20;
  const factors: Factor[] = [];

  if (LIFE_THREAT.includes(incident.category)) {
    score += 34;
    factors.push({ label: "Immediate threat to life", effect: "positive", weight: 34 });
  }
  if (incident.category === "MEDICAL_EMERGENCY") {
    score += 8;
    factors.push({ label: "Medical urgency", effect: "positive", weight: 8 });
  }

  const peopleWeight = Math.min(20, Math.round(Math.log10(incident.peopleAffected + 1) * 12));
  if (peopleWeight > 0) {
    score += peopleWeight;
    factors.push({ label: `${incident.peopleAffected} people affected`, effect: "positive", weight: peopleWeight });
  }

  if (!incident.roadAccessible) {
    score += 12;
    factors.push({ label: "No accessible road route", effect: "positive", weight: 12 });
  }

  const waitingHours = (Date.now() - new Date(incident.reportedAt).getTime()) / 3_600_000;
  if (waitingHours > 2) {
    const w = Math.min(10, Math.round(waitingHours));
    score += w;
    factors.push({ label: `Waiting ${Math.round(waitingHours)} h since report`, effect: "positive", weight: w });
  }

  const trust = trustScore(incident, pool);
  const trustAdj = Math.round((trust.score - 60) / 6);
  score += trustAdj;
  factors.push({
    label: `Report confidence ${trust.score}%`,
    effect: trustAdj >= 0 ? "positive" : "negative",
    weight: Math.abs(trustAdj),
  });

  score = Math.max(5, Math.min(99, score));
  const priority: Severity = score >= 80 ? "CRITICAL" : score >= 60 ? "HIGH" : score >= 40 ? "MEDIUM" : "LOW";
  return { priority, score, factors: factors.sort((a, b) => (b.weight ?? 0) - (a.weight ?? 0)) };
}

/* ------------------------------------------------------------------ */
/* 5. GIS-aware resource recommendation                                */
/* ------------------------------------------------------------------ */

export interface ResourceRecommendation {
  teams: { team: ResponseTeam; distanceKm: number; eta: number }[];
  hospital?: { hospital: Hospital; distanceKm: number; eta: number };
  shelter?: { shelter: Shelter; distanceKm: number; availableCapacity: number };
  rationale: string[];
}

export function recommendResources(
  incident: Incident,
  teams: ResponseTeam[],
  shelters: Shelter[],
  hospitals: Hospital[],
): ResourceRecommendation {
  const preferredTypes: ResponseTeam["type"][] =
    incident.category === "RESCUE_REQUEST"
      ? ["BOAT_RESCUE", "NDRF", "MEDICAL"]
      : incident.category === "MEDICAL_EMERGENCY"
        ? ["MEDICAL", "NDRF"]
        : incident.category === "BRIDGE_DAMAGE" || incident.category === "ROAD_DAMAGE" || incident.category === "INFRASTRUCTURE_DAMAGE"
          ? ["ENGINEERING"]
          : ["RELIEF_DISTRIBUTION", "NDRF"];

  const ranked = teams
    .map((team) => ({
      team,
      distanceKm: haversineKm(team.location, incident.location),
      eta: etaMinutes(haversineKm(team.location, incident.location), incident.roadAccessible),
    }))
    .filter((t) => preferredTypes.includes(t.team.type))
    .sort((a, b) => {
      const availability = (x: ResponseTeam) => (x.status === "AVAILABLE" ? 0 : x.status === "EN_ROUTE" ? 1 : 2);
      return availability(a.team) - availability(b.team) || a.distanceKm - b.distanceKm;
    })
    .slice(0, 3);

  const nearestHospital = hospitals
    .map((hospital) => ({
      hospital,
      distanceKm: haversineKm(hospital.location, incident.location),
      eta: etaMinutes(haversineKm(hospital.location, incident.location), incident.roadAccessible),
    }))
    .filter((h) => h.hospital.bedsAvailable > 0)
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  const nearestShelter = shelters
    .map((shelter) => ({
      shelter,
      distanceKm: haversineKm(shelter.location, incident.location),
      availableCapacity: shelter.capacity - shelter.occupancy,
    }))
    .filter((s) => s.availableCapacity > 0 && s.shelter.status !== "CLOSED")
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];

  const rationale = [
    `Team type filtered to ${preferredTypes.join(", ")} based on classified category ${incident.category.replace(/_/g, " ").toLowerCase()}.`,
    incident.roadAccessible
      ? "Road access reported as usable — surface travel speeds assumed."
      : "No road access — waterborne approach assumed, travel time increased.",
    `Ranked by availability, then straight-line proximity from ${teams.length} tracked units.`,
  ];

  return {
    teams: ranked,
    ...(nearestHospital ? { hospital: nearestHospital } : {}),
    ...(nearestShelter ? { shelter: nearestShelter } : {}),
    rationale,
  };
}
