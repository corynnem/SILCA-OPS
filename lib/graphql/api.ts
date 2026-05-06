import { gqlFetch, setToken, clearToken } from "./client";
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
 

export async function createUser(
  email: string,
  name: string,
  password: string,
  role?: UserRole
): Promise<ApiUser> {
  const data = await gqlFetch<{ createUser: ApiUser }>(CREATE_USER_MUTATION, {
    email,
    name,
    password,
    role,
  });
  return data.createUser;
}
 
// ─── Sales Orders ─────────────────────────────────────────────────────────────
 
export async function getSalesOrders(
  limit = 50,
  offset = 0
): Promise<ApiSalesOrder[]> {
  const data = await gqlFetch<{ salesOrders: ApiSalesOrder[] }>(
    SALES_ORDERS_QUERY,
    { limit, offset }
  );
  return data.salesOrders;
}
 
export async function getSalesOrder(id: string): Promise<ApiSalesOrder> {
  const data = await gqlFetch<{ salesOrder: ApiSalesOrder }>(
    SALES_ORDER_QUERY,
    { id }
  );
  return data.salesOrder;
}
 
export async function markOrderPicked(id: string): Promise<boolean> {
  const data = await gqlFetch<{ markOrderPicked: boolean }>(
    MARK_ORDER_PICKED_MUTATION,
    { id }
  );
  return data.markOrderPicked;
}
 
export async function markOrderPacked(id: string): Promise<boolean> {
  const data = await gqlFetch<{ markOrderPacked: boolean }>(
    MARK_ORDER_PACKED_MUTATION,
    { id }
  );
  return data.markOrderPacked;
}
 
// ─── Barcodes ─────────────────────────────────────────────────────────────────
 
export async function getBarcodes(sku?: string): Promise<ApiBarcode[]> {
  const data = await gqlFetch<{ barcodes: ApiBarcode[] }>(BARCODES_QUERY, {
    sku,
  });
  return data.barcodes;
}
 
export async function getBarcodeByGTIN(
  gtin: number
): Promise<ApiBarcode | null> {
  const data = await gqlFetch<{ barcodeByGTIN: ApiBarcode | null }>(
    BARCODE_BY_GTIN_QUERY,
    { gtin }
  );
  return data.barcodeByGTIN;
}