import type { Role } from "./demo/types";

/**
 * Role-driven navigation configuration. The sidebar is generated from this —
 * never hard-coded per portal. Max 6 modules per role by design.
 */

export interface NavItem {
  label: string;
  to: string;
  icon: string;
}

export interface PortalConfig {
  portalName: string;
  items: NavItem[];
}

export const NAV_CONFIG: Record<Role, PortalConfig> = {
  CITIZEN: {
    portalName: "Citizen Services",
    items: [
      { label: "Dashboard", to: "/citizen/dashboard", icon: "gauge" },
      { label: "Get Help", to: "/citizen/get-help", icon: "life-buoy" },
      { label: "Safety Map", to: "/citizen/safety-map", icon: "map" },
      { label: "My Activity", to: "/citizen/activity", icon: "list-checks" },
      { label: "Account", to: "/citizen/account", icon: "user" },
    ],
  },
  VOLUNTEER: {
    portalName: "Volunteer Operations",
    items: [
      { label: "Dashboard", to: "/volunteer/dashboard", icon: "gauge" },
      { label: "Response Work", to: "/volunteer/response-work", icon: "hand-helping" },
      { label: "Field Updates", to: "/volunteer/field-updates", icon: "clipboard-list" },
      { label: "Community", to: "/volunteer/community", icon: "users" },
      { label: "Profile", to: "/volunteer/profile", icon: "user" },
    ],
  },
  FIELD_OFFICER: {
    portalName: "Field Command",
    items: [
      { label: "Dashboard", to: "/officer/dashboard", icon: "gauge" },
      { label: "Incident Operations", to: "/officer/incidents", icon: "siren" },
      { label: "Field Intelligence", to: "/officer/field-intelligence", icon: "radar" },
      { label: "Relief Operations", to: "/officer/relief", icon: "package" },
      { label: "Team", to: "/officer/team", icon: "users" },
      { label: "Insights", to: "/officer/insights", icon: "chart-line" },
    ],
  },
  DONOR: {
    portalName: "Partner & Donor Portal",
    items: [
      { label: "Dashboard", to: "/donor/dashboard", icon: "gauge" },
      { label: "Contribute", to: "/donor/contribute", icon: "hand-coins" },
      { label: "Projects & Needs", to: "/donor/needs", icon: "clipboard-list" },
      { label: "Impact", to: "/donor/impact", icon: "chart-line" },
      { label: "Account", to: "/donor/account", icon: "user" },
    ],
  },
  ADMIN: {
    portalName: "State Control Room",
    items: [
      { label: "Command Center", to: "/admin/dashboard", icon: "radar" },
      { label: "Operations", to: "/admin/operations", icon: "siren" },
      { label: "Disaster Intelligence", to: "/admin/intelligence", icon: "brain" },
      { label: "Relief Management", to: "/admin/relief", icon: "package" },
      { label: "People & Partners", to: "/admin/people", icon: "users" },
      { label: "Analytics & System", to: "/admin/analytics", icon: "chart-line" },
    ],
  },
};

/** Which role owns a given portal path prefix. */
export const PORTAL_PREFIX: Record<string, Role> = {
  citizen: "CITIZEN",
  volunteer: "VOLUNTEER",
  officer: "FIELD_OFFICER",
  donor: "DONOR",
  admin: "ADMIN",
};
