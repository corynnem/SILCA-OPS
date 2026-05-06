"use client";
 
import { useState, useEffect, useCallback } from "react";
import { gqlFetch, setToken, clearToken, GraphQLError } from "./client";
import {
    LOGIN_MUTATION,
    CREATE_USER_MUTATION,
    SALES_ORDERS_QUERY,
    SALES_ORDER_QUERY,
    MARK_ORDER_PICKED_MUTATION,
    MARK_ORDER_PACKED_MUTATION,
    BARCODES_QUERY,
    BARCODE_BY_GTIN_QUERY,
} from "./queries";
import type {
  AuthPayload,
  ApiUser,
  UserRole,
  ApiSalesOrder,
  ApiBarcode,
} from "./types";
import { redirect } from "next/navigation";

// ─── Shared state shape ───────────────────────────────────────────────────────

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Auth hooks
// ─────────────────────────────────────────────────────────────────────────────
 
/**
 * useAuth — call `login(email, password)` to authenticate.
 * Stores the JWT in localStorage automatically.
 *
 * @example
 * const { login, loading, error } = useAuth();
 * const payload = await login("admin@silca.cc", "secret");
 */

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const login = useCallback(
    async (email: string, password: string): Promise<AuthPayload | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await gqlFetch<{ login: AuthPayload }>(LOGIN_MUTATION, {
          email,
          password,
        });

        setToken(data.login.token);
        return data.login;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Login failed";
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
 
  const logout = useCallback(() => {
    clearToken();
  }, []);
 
  return { login, logout, loading, error };
}
 
/**
 * useCreateUser — admin-only mutation to create a new user.
 */
export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const createUser = useCallback(
    async (
      email: string,
      name: string,
      password: string,
      role?: UserRole
    ): Promise<ApiUser | null> => {
      setLoading(true);
      setError(null);
      try {
        const data = await gqlFetch<{ createUser: ApiUser }>(
          CREATE_USER_MUTATION,
          { email, name, password, role }
        );
        return data.createUser;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create user");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );
 
  return { createUser, loading, error };
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Sales Order hooks
// ─────────────────────────────────────────────────────────────────────────────
 
/**
 * useSalesOrders — fetches a paginated list of sales orders on mount.
 *
 * @example
 * const { data, loading, error, refetch } = useSalesOrders({ limit: 50 });
 */
export function useSalesOrders(opts?: { limit?: number; offset?: number }) {
  const [state, setState] = useState<QueryState<ApiSalesOrder[]>>({
    data: null,
    loading: true,
    error: null,
  });
 
  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await gqlFetch<{ salesOrders: ApiSalesOrder[] }>(
        SALES_ORDERS_QUERY,
        { limit: opts?.limit ?? 50, offset: opts?.offset ?? 0 }
      );
      setState({ data: data.salesOrders, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load orders",
      });
    }
  }, [opts?.limit, opts?.offset]);
 
  useEffect(() => {
    fetch();
  }, [fetch]);
 
  return { ...state, refetch: fetch };
}
 
/**
 * useSalesOrder — fetches a single sales order by NetSuite ID.
 */
export function useSalesOrder(id: string | null) {
  const [state, setState] = useState<QueryState<ApiSalesOrder>>({
    data: null,
    loading: false,
    error: null,
  });
 
  const fetch = useCallback(async () => {
    if (!id) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await gqlFetch<{ salesOrder: ApiSalesOrder }>(
        SALES_ORDER_QUERY,
        { id }
      );
      setState({ data: data.salesOrder, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load order",
      });
    }
  }, [id]);
 
  useEffect(() => {
    fetch();
  }, [fetch]);
 
  return { ...state, refetch: fetch };
}
 
/**
 * useMarkOrderPicked — call `markPicked(id)` to mark a sales order as picked.
 */
export function useMarkOrderPicked() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const markPicked = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await gqlFetch<{ markOrderPicked: boolean }>(
        MARK_ORDER_PICKED_MUTATION,
        { id }
      );
      return data.markOrderPicked;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as picked");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
 
  return { markPicked, loading, error };
}
 
/**
 * useMarkOrderPacked — call `markPacked(id)` to mark a sales order as packed.
 */
export function useMarkOrderPacked() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
 
  const markPacked = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const data = await gqlFetch<{ markOrderPacked: boolean }>(
        MARK_ORDER_PACKED_MUTATION,
        { id }
      );
      return data.markOrderPacked;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to mark as packed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);
 
  return { markPacked, loading, error };
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Barcode hooks
// ─────────────────────────────────────────────────────────────────────────────
 
/**
 * useBarcodes — fetches all barcodes, optionally filtered by SKU.
 *
 * @example
 * const { data, loading } = useBarcodes();
 * const { data } = useBarcodes({ sku: "AM-PU-008-ASY-0110" });
 */
export function useBarcodes(opts?: { sku?: string }) {
  const [state, setState] = useState<QueryState<ApiBarcode[]>>({
    data: null,
    loading: true,
    error: null,
  });
 
  const fetch = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await gqlFetch<{ barcodes: ApiBarcode[] }>(BARCODES_QUERY, {
        sku: opts?.sku,
      });
      setState({ data: data.barcodes, loading: false, error: null });
    } catch (err) {
      setState({
        data: null,
        loading: false,
        error: err instanceof Error ? err.message : "Failed to load barcodes",
      });
    }
  }, [opts?.sku]);
 
  useEffect(() => {
    fetch();
  }, [fetch]);
 
  return { ...state, refetch: fetch };
}
 
/**
 * useBarcodeByGTIN — looks up a single barcode by its GTIN number.
 * Does NOT auto-fetch — call `lookup(gtin)` imperatively (ideal for scanners).
 *
 * @example
 * const { lookup, data, loading, error } = useBarcodeByGTIN();
 * // inside scan handler:
 * const barcode = await lookup(810093160006);
 */
export function useBarcodeByGTIN() {
  const [state, setState] = useState<QueryState<ApiBarcode>>({
    data: null,
    loading: false,
    error: null,
  });
 
  const lookup = useCallback(
    async (gtin: number): Promise<ApiBarcode | null> => {
      setState({ data: null, loading: true, error: null });
      try {
        const data = await gqlFetch<{ barcodeByGTIN: ApiBarcode | null }>(
          BARCODE_BY_GTIN_QUERY,
          { gtin }
        );
        setState({ data: data.barcodeByGTIN, loading: false, error: null });
        return data.barcodeByGTIN;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "Barcode lookup failed";
        setState({ data: null, loading: false, error: msg });
        return null;
      }
    },
    []
  );
 
  return { lookup, ...state };
}