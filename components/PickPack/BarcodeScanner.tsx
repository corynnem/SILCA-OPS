"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Typography, Box, Chip } from "@mui/material";
import { QrCodeScanner as QrCodeScannerIcon } from "@mui/icons-material";
import { handleInputChange, HandleInputChangeProps } from "./helpers";
import { Items } from "@/types/SalesOrderTypes";

interface BarcodeScannerProps {
  setErrorModalText: HandleInputChangeProps["setErrorModalText"];
  setErrorModalOpen: HandleInputChangeProps["setErrorModalOpen"];
  orderItems: Items[];
  scanCounts: Record<string, number>;
  setScanCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>;
}

const BarcodeScanner = ({
  setErrorModalText,
  setErrorModalOpen,
  orderItems,
  scanCounts,
  setScanCounts,
}: BarcodeScannerProps) => {
  const [barcode, setBarcode] = useState<string>("");
  const [flashGreen, setFlashGreen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Keep latest values accessible inside the input handler without re-registering
  const orderItemsRef = useRef(orderItems);
  const scanCountsRef = useRef(scanCounts);
  useEffect(() => { orderItemsRef.current = orderItems; }, [orderItems]);
  useEffect(() => { scanCountsRef.current = scanCounts; }, [scanCounts]);

  // Auto-focus the hidden input when the component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // Barcode scanners type all characters and then hit Enter.
    // We read the full value only on Enter (handled in onKeyDown).
    // This handler just prevents React from complaining about uncontrolled input.
    e.preventDefault();
  }, []);

  const handleKeyDown = useCallback(async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const scanned = (e.currentTarget.value ?? "").trim();
      // Clear the input immediately
      e.currentTarget.value = "";

      if (!scanned) return;

      setBarcode(scanned);

      const result = await handleInputChange(
        Number(scanned),
        orderItemsRef.current,
        scanCountsRef.current
      );

      switch (result.type) {
        case "SUCCESS":
          setFlashGreen(true);
          setTimeout(() => setFlashGreen(false), 600);
          setScanCounts((prev) => ({
            ...prev,
            [result.sku]: (prev[result.sku] ?? 0) + 1,
          }));
          break;
        case "NOT_FOUND":
          setErrorModalText({ title: "Scanned item not found", subtext: "Please put this item back before continuing." });
          setErrorModalOpen(true);
          break;
        case "QUANTITY_MET":
          setErrorModalText({ title: "Quantity already met", subtext: "All units of this item have already been scanned." });
          setErrorModalOpen(true);
          break;
        case "NOT_IN_ORDER":
          setErrorModalText({ title: "Item not in this order", subtext: "This item doesn't belong to the current order. Please set it aside." });
          setErrorModalOpen(true);
          break;
      }
    }
  }, [setErrorModalText, setErrorModalOpen, setScanCounts]);

  return (
    <Box
      onClick={() => inputRef.current?.focus()}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 2,
        mb: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: flashGreen ? "#bbf7d0" : isFocused ? "#a3a3a3" : "#f5f5f5",
        bgcolor: flashGreen ? "#f0fdf4" : "#fafafa",
        transition: "all 0.3s",
        cursor: "text",
      }}
    >
      {/* Hidden input that captures all barcode scanner keystrokes */}
      <input
        ref={inputRef}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 1,
          height: 1,
        }}
        autoComplete="off"
        aria-label="barcode scanner input"
      />

      <QrCodeScannerIcon sx={{ fontSize: 20, color: flashGreen ? "#16a34a" : isFocused ? "#525252" : "#a3a3a3" }} />
      <Box sx={{ flex: 1 }}>
        <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: isFocused ? "text.primary" : "text.secondary" }}>
          {isFocused ? "Scanner Active — Ready to Scan" : "Click here to activate scanner"}
        </Typography>
        {barcode ? (
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.8rem", color: "text.primary", mt: 0.25 }}>
            Last scanned: {barcode}
          </Typography>
        ) : (
          <Typography sx={{ fontSize: "0.75rem", color: "#a3a3a3", mt: 0.25 }}>
            Scan a barcode or use mock buttons below
          </Typography>
        )}
      </Box>
      {flashGreen && (
        <Chip label="✓ Scanned" size="small" sx={{ ml: "auto", bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: "0.65rem" }} />
      )}
      {!isFocused && (
        <Chip label="Click to focus" size="small" sx={{ ml: "auto", bgcolor: "#f5f5f5", color: "text.secondary", fontSize: "0.65rem" }} />
      )}
    </Box>
  );
};

export default BarcodeScanner;
