"use client";

import { SalesOrders } from "@/types/SalesOrderTypes";
import { mockSalesOrders as defaultOrders } from "@/data/mockData";

const STORAGE_KEY = "silca_sales_orders";

export const getSalesOrdersLocalStorage = (): { mockSalesOrders: SalesOrders[] } => {
  if (typeof window === "undefined") return { mockSalesOrders: defaultOrders };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { mockSalesOrders: JSON.parse(stored) };
  } catch {}
  return { mockSalesOrders: defaultOrders };
};

export const postSalesOrdersLocalStorage = (orders: SalesOrders[]) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {}
};

export const removeSalesOrder = (
  salesOrderNumber: string,
  setSalesOrders: (orders: SalesOrders[]) => void
) => {
  const { mockSalesOrders: current } = getSalesOrdersLocalStorage();
  const updated = current.filter((o) => o.tranid !== salesOrderNumber);
  postSalesOrdersLocalStorage(updated);
  setSalesOrders(updated);
};
