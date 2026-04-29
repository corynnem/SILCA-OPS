import { upc_codes, mockSalesOrders as defaultOrders } from "@/data/mockData";
import { ErrorModalText } from "@/context/DataGridContext";
import { Items, SalesOrders } from "@/types/SalesOrderTypes";

export const findScannedItem = (scannedCode: number): string | undefined => {
  const result = upc_codes.find((item) => item.GTIN === scannedCode);
  return result ? result["SKU"] : undefined;
};

export interface HandleInputChangeProps {
  newBarcode?: number;
  setErrorModalText: (args: ErrorModalText) => void;
  setErrorModalOpen: (args: boolean) => void;
  orderItems: Items[];
  scanCounts: Record<string, number>;
  setScanCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

export type ScanResult =
  | { type: "NOT_FOUND" }
  | { type: "NOT_IN_ORDER" }
  | { type: "QUANTITY_MET" }
  | { type: "SUCCESS"; sku: string };

export const handleInputChange = (
  newBarcode: number,
  orderItems: Items[],
  scanCounts: Record<string, number>
): ScanResult => {
  const foundSku = findScannedItem(newBarcode);
  if (!foundSku) return { type: "NOT_FOUND" };

  const orderItem = orderItems.find((item) => item.item.sku === foundSku);
  if (!orderItem) return { type: "NOT_IN_ORDER" };

  const currentCount = scanCounts[foundSku] ?? 0;
  if (currentCount >= orderItem.quantity) return { type: "QUANTITY_MET" };

  return { type: "SUCCESS", sku: foundSku };
};

// mockScan is no longer used — each scanner component handles mock input directly
// via its own handleMockScan function that calls the scan logic without keyboard events.

export const getSalesOrdersLocalStorage = (): { mockSalesOrders: SalesOrders[] } => {
  if (typeof window === "undefined") return { mockSalesOrders: defaultOrders };
  try {
    const stored = localStorage.getItem("silca_sales_orders");
    if (stored) return { mockSalesOrders: JSON.parse(stored) };
  } catch {}
  return { mockSalesOrders: defaultOrders };
};

export const getIndividualSalesOrder = (salesOrderNumber: string) => {
  const { mockSalesOrders } = getSalesOrdersLocalStorage();
  const mockSalesOrder = mockSalesOrders.find(
    (order: SalesOrders) => order.tranid === salesOrderNumber
  );
  return { mockSalesOrder };
};

export const getDataGridRows = (salesOrders: SalesOrders[]) => {
  return (salesOrders ?? []).map((salesOrder) => ({
    id: salesOrder.id,
    shopifyOrderNumber: salesOrder.otherrefnum,
    salesOrderNumber: salesOrder.tranid,
    totalItems: salesOrder.item?.items?.length ?? 0,
  }));
};
