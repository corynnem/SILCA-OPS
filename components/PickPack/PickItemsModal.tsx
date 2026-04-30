"use client";

import React, { useState, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Box, Typography, Divider, Chip, Stack,
} from "@mui/material";
import { CheckCircle as CheckCircleIcon, BugReport as BugReportIcon } from "@mui/icons-material";
import PickableLineItems from "./PickableLineItems";
import BarcodeScanner from "./BarcodeScanner";
import { getIndividualSalesOrder, handleInputChange, findScannedItem } from "./helpers";
import { DataGridContext } from "@/context/DataGridContext";
import { removeSalesOrder } from "@/helpers";
import { Items } from "@/types/SalesOrderTypes"

interface PickItemsModalProps {
  salesOrderNumber: string;
}

const MOCK_SCANS = [
  { label: "Elettrico Ultimate", upc: "810093162987" },
  { label: "CWS", upc: "810093162642" },
  { label: "SS 4oz", upc: "810093161706" },
  { label: "Hot Wax", upc: "810093162024" },
];

const PickItemsModal = ({ salesOrderNumber }: PickItemsModalProps) => {
  const { setErrorModalOpen, setErrorModalText, setSalesOrders } = useContext(DataGridContext);
  const [open, setOpen] = useState(false);
  const [scanCounts, setScanCounts] = useState<Record<string, number>>({});
  const [showMockButtons, setShowMockButtons] = useState(false);

  const { mockSalesOrder } = getIndividualSalesOrder(salesOrderNumber);
  const orderItems = mockSalesOrder?.item?.items ?? [];

  const allItemsPicked = orderItems.length > 0 && orderItems.every((orderItem: Items) => {
    const sku = orderItem.item.sku;
    return (scanCounts[sku] ?? 0) >= orderItem.quantity;
  });

  const pickedCount = orderItems.filter((item: Items) => (scanCounts[item.item.sku] ?? 0) > 0).length;

  const handleOpen = () => { setOpen(true); setScanCounts({}); };
  const handleClose = () => setOpen(false);
  const handleSubmit = () => {
    removeSalesOrder(salesOrderNumber, setSalesOrders);
    handleClose();
  };

  // Call scan logic directly — no keyboard event dispatching needed
  const handleMockScan = (upc: string) => {
    const result = handleInputChange(Number(upc), orderItems, scanCounts);
    switch (result.type) {
      case "SUCCESS":
        setScanCounts((prev) => ({ ...prev, [result.sku]: (prev[result.sku] ?? 0) + 1 }));
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
        setErrorModalText({ title: "Item not in this order", subtext: "This item doesn't belong to the current order." });
        setErrorModalOpen(true);
        break;
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        size="small"
        onClick={handleOpen}
        sx={{
          bgcolor: "#171717",
          "&:hover": { bgcolor: "#404040" },
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.05em",
          px: 1.5,
          py: 0.5,
          minWidth: 0,
        }}
      >
        Pick
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "1rem" }}>
                Pick Order
              </Typography>
              <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem", color: "text.secondary", fontWeight: 400, mt: 0.25 }}>
                {salesOrderNumber}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center">
              {allItemsPicked && (
                <Chip
                  icon={<CheckCircleIcon sx={{ fontSize: "14px !important" }} />}
                  label="All Picked"
                  size="small"
                  sx={{ bgcolor: "#dcfce7", color: "#16a34a", fontWeight: 700, fontSize: "0.65rem" }}
                />
              )}
              <Chip
                label={`${pickedCount}/${orderItems.length} items`}
                size="small"
                sx={{ bgcolor: "#f5f5f5", color: "text.secondary", fontSize: "0.65rem" }}
              />
            </Stack>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: "16px !important" }}>
          <BarcodeScanner
            setErrorModalOpen={setErrorModalOpen}
            setErrorModalText={setErrorModalText}
            orderItems={orderItems}
            scanCounts={scanCounts}
            setScanCounts={setScanCounts}
          />

          {/* Mock scan dev tools */}
          <Box sx={{ mb: 2 }}>
            <Button
              size="small"
              startIcon={<BugReportIcon sx={{ fontSize: 14 }} />}
              onClick={() => setShowMockButtons((v) => !v)}
              sx={{ fontSize: "0.65rem", color: "#a3a3a3", p: 0, mb: 1 }}
            >
              {showMockButtons ? "Hide" : "Show"} mock scan buttons
            </Button>
            {showMockButtons && (
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {MOCK_SCANS.map((s) => (
                  <Button
                    key={s.upc}
                    size="small"
                    variant="outlined"
                    onClick={() => handleMockScan(s.upc)}
                    sx={{ fontSize: "0.65rem", borderColor: "#e5e5e5", color: "text.secondary", py: 0.25 }}
                  >
                    {s.label}
                  </Button>
                ))}
              </Stack>
            )}
          </Box>

          <Divider sx={{ mb: 1.5 }} />

          <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", mb: 1 }}>
            Line Items
          </Typography>

          {orderItems.map((item: Items, i: number) => (
            <PickableLineItems
              key={i}
              item={item}
              scanCount={scanCounts[item.item.sku] ?? 0}
              SONumber={salesOrderNumber}
            />
          ))}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={handleClose} sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!allItemsPicked}
            sx={{
              bgcolor: "#171717",
              "&:hover": { bgcolor: "#404040" },
              "&.Mui-disabled": { bgcolor: "#d4d4d4", color: "white" },
              fontSize: "0.8rem",
            }}
          >
            Mark Picked
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PickItemsModal;
