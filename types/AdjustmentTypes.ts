export interface AdjustmentRow {
  id: string;
  sku: string;
  description: string;
  quantity: number;
  dateRequested: string;
  reason: string;
}

export interface Product {
  sku: string;
  name: string;
}
