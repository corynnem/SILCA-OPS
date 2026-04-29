"use client";

import React, { createContext, useState, ReactNode } from "react";
import { SalesOrders } from "@/types/SalesOrderTypes";
import { getSalesOrdersLocalStorage, postSalesOrdersLocalStorage } from "@/helpers";

export interface ErrorModalText {
  title: string;
  subtext: string;
}

interface DataGridContextType {
  salesOrders: SalesOrders[];
  setSalesOrders: (orders: SalesOrders[]) => void;
  errorModalText: ErrorModalText;
  setErrorModalText: (text: ErrorModalText) => void;
  errorModalOpen: boolean;
  setErrorModalOpen: (open: boolean) => void;
  currentlyScannedItem: string;
  setCurrentlyScannedItem: (item: string) => void;
}

export const DataGridContext = createContext<DataGridContextType>({
  salesOrders: [],
  setSalesOrders: () => {},
  errorModalText: { title: "", subtext: "" },
  setErrorModalText: () => {},
  errorModalOpen: false,
  setErrorModalOpen: () => {},
  currentlyScannedItem: "",
  setCurrentlyScannedItem: () => {},
});

export const DataGridProvider = ({ children }: { children: ReactNode }) => {
  const { mockSalesOrders } = getSalesOrdersLocalStorage();
  const [salesOrders, setSalesOrdersState] = useState<SalesOrders[]>(mockSalesOrders);
  const [errorModalText, setErrorModalText] = useState<ErrorModalText>({ title: "", subtext: "" });
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [currentlyScannedItem, setCurrentlyScannedItem] = useState("");

  const setSalesOrders = (orders: SalesOrders[]) => {
    setSalesOrdersState(orders);
    postSalesOrdersLocalStorage(orders);
  };

  return (
    <DataGridContext.Provider value={{
      salesOrders,
      setSalesOrders,
      errorModalText,
      setErrorModalText,
      errorModalOpen,
      setErrorModalOpen,
      currentlyScannedItem,
      setCurrentlyScannedItem,
    }}>
      {children}
    </DataGridContext.Provider>
  );
};
