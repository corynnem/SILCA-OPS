/**
 * Minimal GraphQL client.
 * Reads the JWT from localStorage (key: "silca_token") and sends it as
 * Authorization: Bearer <token> on every request.
 *
 * Usage:
 *   import { gqlFetch } from "@/lib/graphql-client";
 *   const data = await gqlFetch<{ barcodes: Barcode[] }>(BARCODES_QUERY, { sku: "AM-PU-008-ASY-0110" });
 */
 
const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/graphql";
 
const TOKEN_KEY = "silca_token";
const USER_KEY = 'silca_user'
 
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
 
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
 
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
 
export class GraphQLError extends Error {
  constructor(
    message: string,
    public readonly errors: { message: string }[]
  ) {
    super(message);
    this.name = "GraphQLError";
  }
}
 
export async function gqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const token = getToken();
 
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
 
  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });
 
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
 
  const json = await res.json();
 
  if (json.errors?.length) {
    throw new GraphQLError(json.errors[0].message, json.errors);
  }
 
  return json.data as T;
}