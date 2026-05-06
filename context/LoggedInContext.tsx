"use client";
 
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { ApiUser } from "@/lib/graphql/types";
 
// ─── Storage helpers ──────────────────────────────────────────────────────────
// We persist the user object alongside the JWT so we always have name/role
// available without an extra API round-trip.
 
const USER_KEY = "silca_user";
 
function readUser(): ApiUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as ApiUser) : null;
  } catch {
    return null;
  }
}
 
export function persistUser(user: ApiUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}
 
export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}
 
// ─── Context shape ────────────────────────────────────────────────────────────
 
interface LoggedInContextValue {
  userData: ApiUser | null;
  isLoggedIn: boolean;
  /** True until localStorage has been read on mount — wait for this before redirecting */
  hydrating: boolean;
  setUser: (user: ApiUser) => void;
  clearLoggedInUser: () => void;
}
 
const LoggedInContext = createContext<LoggedInContextValue | null>(null);
 
export function LoggedInProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<ApiUser | null>(null);
  const [hydrating, setHydrating] = useState(true);
 
  useEffect(() => {
    setUserData(readUser());
    setHydrating(false);
  }, []);
 
  const setUser = useCallback((user: ApiUser) => {
    persistUser(user);
    setUserData(user);
  }, []);
 
  const clearLoggedInUser = useCallback(() => {
    clearUser();
    setUserData(null);
  }, []);
 
  return (
    <LoggedInContext.Provider
      value={{
        userData,
        isLoggedIn: userData !== null,
        hydrating,
        setUser,
        clearLoggedInUser,
      }}
    >
      {children}
    </LoggedInContext.Provider>
  );
}
 
// ─── Hook ─────────────────────────────────────────────────────────────────────
 
export function useLoggedIn(): LoggedInContextValue {
  const ctx = useContext(LoggedInContext);
  if (!ctx) {
    throw new Error("useLoggedIn must be used inside <LoggedInProvider>");
  }
  return ctx;
}