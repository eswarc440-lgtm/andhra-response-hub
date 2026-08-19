export type Role = "CITIZEN" | "VOLUNTEER" | "FIELD_OFFICER" | "DONOR" | "ADMIN";

export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus =
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "RESPONSE_ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "REJECTED";

export type IncidentCategory =
  | "FLOOD"
  | "ROAD_DAMAGE"
  | "BRIDGE_DAMAGE"
  | "MEDICAL_EMERGENCY"
  | "RESCUE_REQUEST"
  | "FIRE"
  | "SHELTER_ISSUE"
  | "FOOD_SHORTAGE"
  | "WATER_SHORTAGE"
  | "INFRASTRUCTURE_DAMAGE";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: IncidentCategory;
  severity: Severity;
  status: IncidentStatus;
  district: string;
  mandal: string;
  location: LatLng;
  peopleAffected: number;
  reportedBy: string;
  reporterRole: Role;
  reporterReportCount: number;
  hasEvidence: boolean;
  gpsAccuracyMeters: number;
  reportedAt: string;
  updatedAt: string;
  verifiedBy?: string;
  assignedTeamId?: string;
  roadAccessible: boolean;
  timeline: { at: string; status: IncidentStatus | "NOTE"; note: string; actor: string }[];
}

export interface Shelter {
  id: string;
  name: string;
  district: string;
  location: LatLng;
  capacity: number;
  occupancy: number;
  status: "OPEN" | "NEAR_FULL" | "FULL" | "CLOSED";
  facilities: string[];
  contact: string;
  updatedAt: string;
}

export interface Hospital {
  id: string;
  name: string;
  district: string;
  location: LatLng;
  bedsAvailable: number;
  ambulances: number;
}

export interface ResponseTeam {
  id: string;
  name: string;
  type: "BOAT_RESCUE" | "MEDICAL" | "NDRF" | "ENGINEERING" | "RELIEF_DISTRIBUTION";
  status: "AVAILABLE" | "DEPLOYED" | "EN_ROUTE" | "RESTING";
  members: number;
  district: string;
  location: LatLng;
  assignedIncidentId?: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  unit: string;
  category: "FOOD" | "WATER" | "MEDICAL" | "SHELTER_KIT" | "EQUIPMENT";
  stock: number;
  allocated: number;
  reorderLevel: number;
  warehouse: string;
}

export interface Alert {
  id: string;
  headline: string;
  body: string;
  severity: Severity;
  districts: string[];
  issuedAt: string;
  source: string;
}

export interface RiskZone {
  id: string;
  name: string;
  level: Severity;
  district: string;
  polygon: LatLng[];
  note: string;
}

export interface RoadSegment {
  id: string;
  name: string;
  status: "OPEN" | "BLOCKED" | "RESTRICTED";
  reason: string;
  path: LatLng[];
}

export interface InfrastructureAsset {
  id: string;
  name: string;
  type: "BRIDGE" | "SUBSTATION" | "PUMP_HOUSE" | "EMBANKMENT" | "WATER_TREATMENT";
  district: string;
  location: LatLng;
  condition: "STABLE" | "MONITORED" | "AT_RISK" | "DAMAGED";
  lastInspected: string;
}

export interface VolunteerTask {
  id: string;
  title: string;
  incidentId?: string;
  district: string;
  location: LatLng;
  priority: Severity;
  status: "OFFERED" | "ACCEPTED" | "IN_PROGRESS" | "COMPLETED";
  instructions: string;
  dueBy: string;
}

export interface FieldUpdate {
  id: string;
  submittedBy: string;
  role: Role;
  district: string;
  kind: "ROAD_CONDITION" | "SHELTER_CONDITION" | "OBSERVATION" | "RESOURCE_NEED";
  note: string;
  reviewState: "PENDING_REVIEW" | "VERIFIED" | "REJECTED";
  submittedAt: string;
  hasEvidence: boolean;
}

export interface DonationNeed {
  id: string;
  title: string;
  district: string;
  category: ResourceItem["category"];
  requiredUnits: number;
  pledgedUnits: number;
  receivedUnits: number;
  urgency: Severity;
  verifiedBy: string;
}

export interface Contribution {
  id: string;
  donor: string;
  kind: "FINANCIAL" | "IN_KIND";
  description: string;
  amount?: number;
  units?: number;
  state: "PLEDGED" | "IN_TRANSIT" | "RECEIVED" | "DISTRIBUTED";
  createdAt: string;
  needId?: string;
}

export interface WeatherSnapshot {
  district: string;
  condition: string;
  rainfall24hMm: number;
  windKph: number;
  riverLevelM: number;
  riverDangerM: number;
  advisory: Severity;
}

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  role: Role;
  action: string;
  target: string;
}

export interface PlatformUser {
  id: string;
  name: string;
  role: Role;
  district: string;
  status: "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";
  joinedAt: string;
  organisation?: string;
}
