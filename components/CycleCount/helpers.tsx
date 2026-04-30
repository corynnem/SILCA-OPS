import { upc_codes } from "@/data/mockData";

export const NAME_MAP: Record<string, string> = {
    "AM-PU-001-ASY-0100BK": "Super Pista Ultimate – Black",
    "AM-PU-001-ASY-0100SL": "Super Pista Ultimate – Silver",
    "AM-PU-002-ASY-0100RD": "Pista Corsa – Red",
    "AM-PU-004-ASY-0300SL": "Impero Ultimate – Silver",
    "AM-PU-006-ASY-0000SL": "Tattico Bluetooth – Silver",
    "AM-PU-009-ASY-0200BK": "Eolo III – Black",
    "AM-AC-007-COI-0300BK": "Cielo Road Tire – Black",
    "AM-AC-008-COI-0000SL": "Mensola Wall Mount – Silver",
    "AM-AP-010-COI-0000BK": "Leggero Saddle Bag – Black",
  };
  
  
  export const findItemByUPC = (gtin: number): { sku: string; name: string } | null => {
    const match = upc_codes.find((u) => u.GTIN === gtin);
    if (!match) return null;
    return { sku: match.SKU, name: NAME_MAP[match.SKU] ?? match.SKU };
  };
  
  export const MOCK_ITEMS = [
    { label: "Super Pista Ultimate", upc: "810093162987" },
    { label: "Tattico Bluetooth",    upc: "810093162642" },
    { label: "Impero Ultimate",      upc: "810093160938" },
    { label: "Eolo III",             upc: "850005186328" },
    { label: "Pista Corsa",          upc: "810093161001" },
    { label: "Cielo Tire",           upc: "810093161002" },
    { label: "Unknown UPC",          upc: "000000000000" },
  ];
  