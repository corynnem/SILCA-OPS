export type UserRole = "admin" | "user";
 
export interface ApiUser {
  _id: string;
  email: string;
  name: string;
  role: UserRole;
}
 
export interface AuthPayload {
  token: string;
  user: ApiUser;
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Sales Orders
// ─────────────────────────────────────────────────────────────────────────────
 
export interface NSRef {
  id: string;
  refName: string;
}
 
export interface NSItemRef {
  id: string;
  refName: string;
  sku: string;
}
 
export interface NSLineItem {
  item: NSItemRef;
  quantity: number;
  amount: number;
}
 
export interface NSItemList {
  items: NSLineItem[];
}
 
export interface ApiSalesOrder {
  id: string;
  tranid: string;
  otherrefnum: string;
  trandate: string;
  entity: NSRef;
  subsidiary: NSRef;
  item: NSItemList;
}
 
// ─────────────────────────────────────────────────────────────────────────────
// Barcodes
// ─────────────────────────────────────────────────────────────────────────────
 
export interface ApiBarcode {
  _id: string;
  GTIN: number;
  GTIN12?: string;
  GTIN13?: string;
  GTIN8?: string;
  SKU: string;
  brandName: string;
  productDescription: string;
  packagingLevel?: string;
  isPurchasable?: string;
  statusLabel?: string;
  height?: number;
  width?: number;
  depth?: number;
  dimensionMeasure?: string;
  grossWeight?: number;
  netWeight?: number;
  weightMeasure?: string;
  targetMarkets?: string;
  imageUrl?: string;
  lastModifiedDate?: string;
}
 