import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Role } from "./demo/types";

/**
 * DEMO AUTHENTICATION (frontend-only).
 *
 * Session is held in memory + localStorage so the whole platform is walkable
 * before a backend exists. The shape below mirrors what a real JWT session
 * would return (profile + role + permissions), so switching to a Cloud/API
 * backed session only means replacing `signIn`/`restore` internals.
 *
 * NOTE: the frontend is never the security boundary. When a real backend is
 * connected, every read/write must be re-authorised server-side.
 */

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  district: string;
  designation: string;
  organisation?: string;
  permissions: string[];
}

export const ROLE_LABEL: Record<Role, string> = {
  CITIZEN: "Citizen",
  VOLUNTEER: "Volunteer",
  FIELD_OFFICER: "Field Officer",
  DONOR: "Donor / Partner",
  ADMIN: "Control Room Administrator",
};

export const ROLE_HOME: Record<Role, string> = {
  CITIZEN: "/citizen/dashboard",
  VOLUNTEER: "/volunteer/dashboard",
  FIELD_OFFICER: "/officer/dashboard",
  DONOR: "/donor/dashboard",
  ADMIN: "/admin/dashboard",
};

const PERMISSIONS: Record<Role, string[]> = {
  CITIZEN: ["incident:create", "incident:read:own", "shelter:read", "map:read"],
  VOLUNTEER: ["task:read:assigned", "task:update", "field_update:create", "map:read", "shelter:read"],
  FIELD_OFFICER: [
    "incident:read:district",
    "incident:verify",
    "incident:assign",
    "field_update:review",
    "resource:request",
    "team:manage",
    "map:read:full",
  ],
  DONOR: ["need:read", "contribution:create", "impact:read"],
  ADMIN: [
    "incident:read:all",
    "incident:verify",
    "incident:assign",
    "alert:publish",
    "resource:manage",
    "user:manage",
    "audit:read",
    "system:configure",
    "map:read:full",
  ],
};

export interface DemoAccount extends SessionUser {
  password: string;
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    id: "USR-1",
    name: "Sailaja Kondapalli",
    email: "citizen@ap-dirs.gov.in",
    password: "demo1234",
    role: "CITIZEN",
    district: "Konaseema",
    designation: "Resident, Ainavilli mandal",
    permissions: PERMISSIONS.CITIZEN,
  },
  {
    id: "USR-2",
    name: "Dr. Prasad Yalamanchili",
    email: "volunteer@ap-dirs.gov.in",
    password: "demo1234",
    role: "VOLUNTEER",
    district: "Konaseema",
    designation: "Registered medical volunteer",
    permissions: PERMISSIONS.VOLUNTEER,
  },
  {
    id: "USR-4",
    name: "R. Vamsi Krishna",
    email: "officer@ap-dirs.gov.in",
    password: "demo1234",
    role: "FIELD_OFFICER",
    district: "Eluru",
    designation: "Deputy Tahsildar (Disaster Management)",
    permissions: PERMISSIONS.FIELD_OFFICER,
  },
  {
    id: "USR-6",
    name: "Sagar Infra Foundation",
    email: "donor@ap-dirs.gov.in",
    password: "demo1234",
    role: "DONOR",
    district: "NTR",
    designation: "Partner organisation (CSR)",
    organisation: "Sagar Infra Foundation",
    permissions: PERMISSIONS.DONOR,
  },
  {
    id: "USR-9",
    name: "State Control Room",
    email: "admin@ap-dirs.gov.in",
    password: "demo1234",
    role: "ADMIN",
    district: "Amaravati (State EOC)",
    designation: "APSDMA Emergency Operations Centre",
    permissions: PERMISSIONS.ADMIN,
  },
];

interface AuthContextValue {
  user: SessionUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<SessionUser>;
  registerAndSignIn: (input: { name: string; email: string; role: Role; district: string }) => Promise<SessionUser>;
  signOut: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const STORAGE_KEY = "ap-dirs.session.v1";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore malformed session */
    }
    setReady(true);
  }, []);

  const persist = useCallback((next: SessionUser | null) => {
    setUser(next);
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      await new Promise((r) => setTimeout(r, 350));
      const account = DEMO_ACCOUNTS.find(
        (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
      );
      if (!account) throw new Error("Invalid credentials. Use a demo account listed below.");
      const { password: _pw, ...session } = account;
      persist(session);
      return session;
    },
    [persist],
  );

  const registerAndSignIn = useCallback<AuthContextValue["registerAndSignIn"]>(
    async ({ name, email, role, district }) => {
      await new Promise((r) => setTimeout(r, 400));
      const session: SessionUser = {
        id: `USR-${Math.floor(Math.random() * 9000 + 1000)}`,
        name,
        email,
        role,
        district,
        designation: role === "DONOR" ? "Partner organisation (pending verification)" : "Registered user",
        permissions: PERMISSIONS[role],
      };
      persist(session);
      return session;
    },
    [persist],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      ready,
      signIn,
      registerAndSignIn,
      signOut: () => persist(null),
      hasPermission: (permission: string) => !!user?.permissions.includes(permission),
    }),
    [user, ready, signIn, registerAndSignIn, persist],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
