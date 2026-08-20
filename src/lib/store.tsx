import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  alerts as seedAlerts,
  contributions as seedContributions,
  donationNeeds as seedNeeds,
  fieldUpdates as seedFieldUpdates,
  hospitals,
  incidents as seedIncidents,
  resources as seedResources,
  shelters as seedShelters,
  teams as seedTeams,
  volunteerTasks as seedTasks,
  auditLog as seedAudit,
} from "./demo/data";
import type {
  Alert,
  AuditEntry,
  Contribution,
  DonationNeed,
  FieldUpdate,
  Incident,
  IncidentStatus,
  ResourceItem,
  ResponseTeam,
  Shelter,
  VolunteerTask,
} from "./demo/types";
import type { SessionUser } from "./auth";

/**
 * DEMO OPERATIONS STORE (frontend-only).
 *
 * Single in-memory source of truth for the walkthrough so that actions taken in
 * one portal are visible in another during the same session. Every mutation
 * mirrors an API call that a real backend would authorise server-side.
 */

export interface OpsState {
  incidents: Incident[];
  shelters: Shelter[];
  teams: ResponseTeam[];
  resources: ResourceItem[];
  alerts: Alert[];
  tasks: VolunteerTask[];
  fieldUpdates: FieldUpdate[];
  needs: DonationNeed[];
  contributions: Contribution[];
  audit: AuditEntry[];
}

interface OpsContextValue extends OpsState {
  hospitals: typeof hospitals;
  reportIncident: (input: {
    title: string;
    description: string;
    category: Incident["category"];
    severity: Incident["severity"];
    district: string;
    mandal: string;
    location: { lat: number; lng: number };
    peopleAffected: number;
    hasEvidence: boolean;
    gpsAccuracyMeters: number;
    roadAccessible: boolean;
    reporter: SessionUser;
  }) => Incident;
  setIncidentStatus: (id: string, status: IncidentStatus, note: string, actor: SessionUser) => void;
  verifyIncident: (id: string, actor: SessionUser, note?: string) => void;
  rejectIncident: (id: string, actor: SessionUser, note: string) => void;
  assignTeam: (incidentId: string, teamId: string, actor: SessionUser) => void;
  updateTask: (id: string, status: VolunteerTask["status"], actor: SessionUser) => void;
  submitFieldUpdate: (input: {
    kind: FieldUpdate["kind"];
    note: string;
    hasEvidence: boolean;
    actor: SessionUser;
  }) => void;
  reviewFieldUpdate: (id: string, state: "VERIFIED" | "REJECTED", actor: SessionUser) => void;
  addContribution: (input: {
    kind: Contribution["kind"];
    description: string;
    amount?: number;
    units?: number;
    needId?: string;
    actor: SessionUser;
  }) => void;
  publishAlert: (input: { headline: string; body: string; severity: Alert["severity"]; districts: string[]; actor: SessionUser }) => void;
  advanceContribution: (id: string, actor: SessionUser) => void;
}

const OpsContext = createContext<OpsContextValue | null>(null);

const nowIso = () => new Date().toISOString();
const rid = (prefix: string) => `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;

export function OpsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OpsState>({
    incidents: seedIncidents,
    shelters: seedShelters,
    teams: seedTeams,
    resources: seedResources,
    alerts: seedAlerts,
    tasks: seedTasks,
    fieldUpdates: seedFieldUpdates,
    needs: seedNeeds,
    contributions: seedContributions,
    audit: seedAudit,
  });

  const log = useCallback((actor: SessionUser, action: string, target: string) => {
    setState((s) => ({
      ...s,
      audit: [
        { id: rid("AUD"), at: nowIso(), actor: actor.name, role: actor.role, action, target },
        ...s.audit,
      ].slice(0, 60),
    }));
  }, []);

  const reportIncident = useCallback<OpsContextValue["reportIncident"]>(
    (input) => {
      const incident: Incident = {
        id: rid("INC"),
        title: input.title,
        description: input.description,
        category: input.category,
        severity: input.severity,
        status: "SUBMITTED",
        district: input.district,
        mandal: input.mandal,
        location: input.location,
        peopleAffected: input.peopleAffected,
        reportedBy: input.reporter.name,
        reporterRole: input.reporter.role,
        reporterReportCount: 1,
        hasEvidence: input.hasEvidence,
        gpsAccuracyMeters: input.gpsAccuracyMeters,
        reportedAt: nowIso(),
        updatedAt: nowIso(),
        roadAccessible: input.roadAccessible,
        timeline: [
          {
            at: nowIso(),
            status: "SUBMITTED",
            note: "Report received by the state intake queue. Awaiting officer review.",
            actor: input.reporter.name,
          },
        ],
      };
      setState((s) => ({ ...s, incidents: [incident, ...s.incidents] }));
      log(input.reporter, "Submitted incident report", incident.id);
      return incident;
    },
    [log],
  );

  const touch = useCallback(
    (id: string, patch: Partial<Incident>, entry: { status: IncidentStatus | "NOTE"; note: string; actor: string }) => {
      setState((s) => ({
        ...s,
        incidents: s.incidents.map((i) =>
          i.id === id
            ? {
                ...i,
                ...patch,
                updatedAt: nowIso(),
                timeline: [...i.timeline, { at: nowIso(), ...entry }],
              }
            : i,
        ),
      }));
    },
    [],
  );

  const value = useMemo<OpsContextValue>(
    () => ({
      ...state,
      hospitals,
      reportIncident,
      setIncidentStatus: (id, status, note, actor) => {
        touch(id, { status }, { status, note, actor: actor.name });
        log(actor, `Set status ${status.replace(/_/g, " ").toLowerCase()}`, id);
      },
      verifyIncident: (id, actor, note) => {
        touch(
          id,
          { status: "VERIFIED", verifiedBy: actor.name },
          { status: "VERIFIED", note: note || "Field details corroborated. Report marked officially verified.", actor: actor.name },
        );
        log(actor, "Verified incident", id);
      },
      rejectIncident: (id, actor, note) => {
        touch(id, { status: "REJECTED" }, { status: "REJECTED", note, actor: actor.name });
        log(actor, "Rejected incident", id);
      },
      assignTeam: (incidentId, teamId, actor) => {
        setState((s) => ({
          ...s,
          teams: s.teams.map((t) => (t.id === teamId ? { ...t, status: "EN_ROUTE", assignedIncidentId: incidentId } : t)),
        }));
        const team = state.teams.find((t) => t.id === teamId);
        touch(
          incidentId,
          { status: "RESPONSE_ASSIGNED", assignedTeamId: teamId },
          {
            status: "RESPONSE_ASSIGNED",
            note: `${team?.name ?? teamId} assigned and dispatched by ${actor.designation}.`,
            actor: actor.name,
          },
        );
        log(actor, `Assigned ${team?.name ?? teamId}`, incidentId);
      },
      updateTask: (id, status, actor) => {
        setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === id ? { ...t, status } : t)) }));
        log(actor, `Task ${status.replace(/_/g, " ").toLowerCase()}`, id);
      },
      submitFieldUpdate: ({ kind, note, hasEvidence, actor }) => {
        const update: FieldUpdate = {
          id: rid("FU"),
          submittedBy: actor.name,
          role: actor.role,
          district: actor.district,
          kind,
          note,
          reviewState: "PENDING_REVIEW",
          submittedAt: nowIso(),
          hasEvidence,
        };
        setState((s) => ({ ...s, fieldUpdates: [update, ...s.fieldUpdates] }));
        log(actor, "Submitted field update", update.id);
      },
      reviewFieldUpdate: (id, reviewState, actor) => {
        setState((s) => ({
          ...s,
          fieldUpdates: s.fieldUpdates.map((f) => (f.id === id ? { ...f, reviewState } : f)),
        }));
        log(actor, `Field update ${reviewState.toLowerCase()}`, id);
      },
      addContribution: ({ kind, description, amount, units, needId, actor }) => {
        const contribution: Contribution = {
          id: rid("CON"),
          donor: actor.organisation ?? actor.name,
          kind,
          description,
          ...(amount !== undefined ? { amount } : {}),
          ...(units !== undefined ? { units } : {}),
          state: "PLEDGED",
          createdAt: nowIso(),
          ...(needId ? { needId } : {}),
        };
        setState((s) => ({
          ...s,
          contributions: [contribution, ...s.contributions],
          needs: needId
            ? s.needs.map((n) => (n.id === needId ? { ...n, pledgedUnits: n.pledgedUnits + (units ?? 0) } : n))
            : s.needs,
        }));
        log(actor, "Recorded contribution pledge", contribution.id);
      },
      advanceContribution: (id, actor) => {
        const order: Contribution["state"][] = ["PLEDGED", "IN_TRANSIT", "RECEIVED", "DISTRIBUTED"];
        setState((s) => ({
          ...s,
          contributions: s.contributions.map((c) =>
            c.id === id ? { ...c, state: order[Math.min(order.indexOf(c.state) + 1, order.length - 1)]! } : c,
          ),
        }));
        log(actor, "Advanced contribution state", id);
      },
      publishAlert: ({ headline, body, severity, districts, actor }) => {
        const alert: Alert = {
          id: rid("ALT"),
          headline,
          body,
          severity,
          districts,
          issuedAt: nowIso(),
          source: "APSDMA State Control Room",
        };
        setState((s) => ({ ...s, alerts: [alert, ...s.alerts] }));
        log(actor, "Published public alert", alert.id);
      },
    }),
    [state, reportIncident, touch, log],
  );

  return <OpsContext.Provider value={value}>{children}</OpsContext.Provider>;
}

export function useOps(): OpsContextValue {
  const ctx = useContext(OpsContext);
  if (!ctx) throw new Error("useOps must be used inside OpsProvider");
  return ctx;
}
