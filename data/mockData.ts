import { SalesOrders } from "@/types/SalesOrderTypes";

export const mockSalesOrders: SalesOrders[] = [
  {
    id: "1001",
    tranid: "SO-10001",
    otherrefnum: "#5001",
    item: {
      items: [
        { item: { refName: "SILCA Super Pista Ultimate", sku: "AM-PU-001-ASY-0100BK" }, quantity: 2 },
        { item: { refName: "SILCA Tattico Bluetooth", sku: "AM-PU-006-ASY-0000SL" }, quantity: 1 },
      ],
    },
    status: "Pending Pick",
    createdDate: "2026-04-25",
  },
  {
    id: "1002",
    tranid: "SO-10002",
    otherrefnum: "#5002",
    item: {
      items: [
        { item: { refName: "SILCA Impero Ultimate", sku: "AM-PU-004-ASY-0300SL" }, quantity: 1 },
        { item: { refName: "SILCA Eolo III", sku: "AM-PU-009-ASY-0200BK" }, quantity: 3 },
        { item: { refName: "SILCA Pista Corsa", sku: "AM-PU-002-ASY-0100RD" }, quantity: 1 },
      ],
    },
    status: "Pending Pick",
    createdDate: "2026-04-26",
  },
  {
    id: "1003",
    tranid: "SO-10003",
    otherrefnum: "#5003",
    item: {
      items: [
        { item: { refName: "SILCA Cielo Road Tire", sku: "AM-AC-007-COI-0300BK" }, quantity: 2 },
      ],
    },
    status: "Pending Pick",
    createdDate: "2026-04-27",
  },
  {
    id: "1004",
    tranid: "SO-10004",
    otherrefnum: "#5004",
    item: {
      items: [
        { item: { refName: "SILCA Mensola Wall Mount", sku: "AM-AC-008-COI-0000SL" }, quantity: 1 },
        { item: { refName: "SILCA Leggero Saddle Bag", sku: "AM-AP-010-COI-0000BK" }, quantity: 2 },
      ],
    },
    status: "Pending Pick",
    createdDate: "2026-04-28",
  },
];

// UPC → SKU lookup table (mock)
export const upc_codes: { GTIN: number; SKU: string }[] = [
  { GTIN: 810093162987, SKU: "AM-PU-001-ASY-0100BK" },
  { GTIN: 810093162642, SKU: "AM-PU-006-ASY-0000SL" },
  { GTIN: 810093160938, SKU: "AM-PU-004-ASY-0300SL" },
  { GTIN: 850005186328, SKU: "AM-PU-009-ASY-0200BK" },
  { GTIN: 810093161001, SKU: "AM-PU-002-ASY-0100RD" },
  { GTIN: 810093161002, SKU: "AM-AC-007-COI-0300BK" },
  { GTIN: 810093161003, SKU: "AM-AC-008-COI-0000SL" },
  { GTIN: 810093161004, SKU: "AM-AP-010-COI-0000BK" },
];
