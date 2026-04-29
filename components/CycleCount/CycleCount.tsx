"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  Box, Typography, Paper, Button, Stack, Table, TableBody,
  TableCell, TableHead, TableRow, Chip, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Divider, Alert,
} from "@mui/material";
import {
  QrCodeScanner as ScannerIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  DeleteSweep as ClearIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  BugReport as BugIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { upc_codes } from "@/data/mockData";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CountedItem {
  sku: string;
  name: string;
  count: number;
  lastScanned: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NAME_MAP: Record<string, string> = {
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

const findItemByUPC = (gtin: number): { sku: string; name: string } | null => {
  const match = upc_codes.find((u) => u.GTIN === gtin);
  if (!match) return null;
  return { sku: match.SKU, name: NAME_MAP[match.SKU] ?? match.SKU };
};

const MOCK_ITEMS = [
  { label: "Super Pista Ultimate", upc: "810093162987" },
  { label: "Tattico Bluetooth",    upc: "810093162642" },
  { label: "Impero Ultimate",      upc: "810093160938" },
  { label: "Eolo III",             upc: "850005186328" },
  { label: "Pista Corsa",          upc: "810093161001" },
  { label: "Cielo Tire",           upc: "810093161002" },
  { label: "Unknown UPC",          upc: "000000000000" },
];

// ─── ScannerWidget ────────────────────────────────────────────────────────────

function ScannerWidget({
  lastBarcode,
  flashState,
  totalScans,
  uniqueItems,
  isFocused,
  onBoxClick,
  inputRef,
  onKeyDown,
}: {
  lastBarcode: string;
  flashState: "idle" | "success" | "error";
  totalScans: number;
  uniqueItems: number;
  isFocused: boolean;
  onBoxClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  const borderColor = flashState === "success"
    ? "#bbf7d0"
    : flashState === "error"
    ? "#fecaca"
    : isFocused ? "#a3a3a3" : "#f5f5f5";
  const bgColor = flashState === "success" ? "#f0fdf4" : flashState === "error" ? "#fff5f5" : "#fafafa";
  const iconColor = flashState === "success" ? "#16a34a" : flashState === "error" ? "#dc2626" : isFocused ? "#525252" : "#a3a3a3";

  return (
    <Paper
      variant="outlined"
      onClick={onBoxClick}
      sx={{ borderRadius: 2, borderColor, bgcolor: bgColor, transition: "all 0.25s", overflow: "hidden", cursor: "text" }}
    >
      {/* Hidden input — always mounted, captures all barcode keystrokes when focused */}
      <input
        ref={inputRef}
        onKeyDown={onKeyDown}
        onChange={() => {}} // controlled by onKeyDown clearing value directly
        style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
        autoComplete="off"
        aria-label="barcode scanner input"
      />

      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
        <Box
          sx={{
            width: 52, height: 52, borderRadius: 2, flexShrink: 0, transition: "all 0.25s",
            bgcolor: flashState === "success" ? "#dcfce7" : flashState === "error" ? "#fee2e2" : "#f5f5f5",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {flashState === "success"
            ? <CheckIcon sx={{ fontSize: 26, color: "#16a34a" }} />
            : flashState === "error"
            ? <WarningIcon sx={{ fontSize: 26, color: "#dc2626" }} />
            : <ScannerIcon sx={{ fontSize: 26, color: iconColor }} />
          }
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: iconColor, transition: "color 0.25s" }}>
            {flashState === "success" ? "Item Scanned" : flashState === "error" ? "Not Recognized" : isFocused ? "Scanner Active — Ready to Scan" : "Click to Activate Scanner"}
          </Typography>
          <Typography sx={{ fontFamily: "monospace", fontSize: "0.9rem", fontWeight: 600, color: "text.primary", mt: 0.25, minHeight: 22 }}>
            {lastBarcode || (isFocused ? "Waiting for scan…" : "Scanner inactive")}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "text.primary", lineHeight: 1 }}>{totalScans}</Typography>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", mt: 0.25 }}>Total Scans</Typography>
          </Box>
          <Divider orientation="vertical" flexItem sx={{ borderColor: "#f5f5f5" }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "text.primary", lineHeight: 1 }}>{uniqueItems}</Typography>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", mt: 0.25 }}>Unique SKUs</Typography>
          </Box>
        </Stack>

        {!isFocused && (
          <Chip label="Click to focus" size="small" sx={{ bgcolor: "#f5f5f5", color: "text.secondary", fontSize: "0.65rem" }} />
        )}
      </Box>
    </Paper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CycleCount() {
  const [counts, setCounts] = useState<Record<string, CountedItem>>({});
  const [lastBarcode, setLastBarcode] = useState("");
  const [flashState, setFlashState] = useState<"idle" | "success" | "error">("idle");
  const [isFocused, setIsFocused] = useState(false);
  const [showMock, setShowMock] = useState(false);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [unknownBarcodes, setUnknownBarcodes] = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Re-focus after dialog closes
  useEffect(() => {
    if (!clearDialogOpen) inputRef.current?.focus();
  }, [clearDialogOpen]);

  const flash = useCallback((state: "success" | "error") => {
    setFlashState(state);
    if (flashTimeout.current) clearTimeout(flashTimeout.current);
    flashTimeout.current = setTimeout(() => setFlashState("idle"), 700);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const scanned = (e.currentTarget.value ?? "").trim();
      e.currentTarget.value = ""; // clear immediately

      if (!scanned) return;

      setLastBarcode(scanned);
      const item = findItemByUPC(Number(scanned));

      if (!item) {
        flash("error");
        setUnknownBarcodes((prev) => prev.includes(scanned) ? prev : [...prev, scanned]);
        return;
      }

      flash("success");
      setCounts((prev) => {
        const existing = prev[item.sku];
        return {
          ...prev,
          [item.sku]: {
            sku: item.sku,
            name: item.name,
            count: (existing?.count ?? 0) + 1,
            lastScanned: new Date().toISOString(),
          },
        };
      });
    }
  }, [flash]);

  // Mock scan: type directly into the hidden input and fire Enter
  const mockScan = useCallback((upc: string) => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    // Use React's nativeInputValueSetter to set value, then fire events
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
    nativeInputValueSetter?.call(input, upc);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    // Fire a synthetic React KeyboardEvent via the DOM
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
  }, []);

  // Simpler mockScan: just call handleKeyDown logic directly via a fake event
  const handleMockScan = useCallback((upc: string) => {
    setLastBarcode(upc);
    const item = findItemByUPC(Number(upc));
    if (!item) {
      flash("error");
      setUnknownBarcodes((prev) => prev.includes(upc) ? prev : [...prev, upc]);
      return;
    }
    flash("success");
    setCounts((prev) => {
      const existing = prev[item.sku];
      return {
        ...prev,
        [item.sku]: {
          sku: item.sku,
          name: item.name,
          count: (existing?.count ?? 0) + 1,
          lastScanned: new Date().toISOString(),
        },
      };
    });
  }, [flash]);

  const items = Object.values(counts).sort(
    (a, b) => new Date(b.lastScanned).getTime() - new Date(a.lastScanned).getTime()
  );
  const totalScans = items.reduce((sum, i) => sum + i.count, 0);

  const adjustCount = (sku: string, delta: number) => {
    setCounts((prev) => {
      const item = prev[sku];
      if (!item) return prev;
      const newCount = item.count + delta;
      if (newCount <= 0) { const next = { ...prev }; delete next[sku]; return next; }
      return { ...prev, [sku]: { ...item, count: newCount } };
    });
  };

  const removeItem = (sku: string) => {
    setCounts((prev) => { const next = { ...prev }; delete next[sku]; return next; });
  };

  const handleClear = () => {
    setCounts({});
    setUnknownBarcodes([]);
    setLastBarcode("");
    setFlashState("idle");
    setClearDialogOpen(false);
  };

  const exportData = (format: "csv" | "xlsx") => {
    const rows = items.map((item) => ({
      SKU: item.sku,
      "Product Name": item.name,
      Count: item.count,
      "Last Scanned": new Date(item.lastScanned).toLocaleString(),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [{ wch: 28 }, { wch: 36 }, { wch: 10 }, { wch: 22 }];
    const filename = `SILCA_CycleCount_${new Date().toISOString().split("T")[0]}`;
    if (format === "csv") {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([XLSX.utils.sheet_to_csv(ws)], { type: "text/csv" }));
      a.download = `${filename}.csv`;
      a.click();
    } else {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cycle Count");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    }
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">Cycle Count</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Scan items to count inventory. Each scan increments the item's count. Export when complete.
          </Typography>
        </Box>
        {items.length > 0 && (
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small" startIcon={<ClearIcon />} onClick={() => setClearDialogOpen(true)}
              sx={{ fontSize: "0.75rem", borderColor: "#fecaca", color: "#dc2626", "&:hover": { borderColor: "#dc2626", bgcolor: "#fff5f5" } }}>
              Clear All
            </Button>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={() => exportData("xlsx")}
              sx={{ fontSize: "0.75rem", borderColor: "#e5e5e5", color: "text.secondary", "&:hover": { borderColor: "#a3a3a3" } }}>
              Export XLSX
            </Button>
            <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={() => exportData("csv")}
              sx={{ fontSize: "0.75rem", bgcolor: "#171717", "&:hover": { bgcolor: "#404040" } }}>
              Export CSV
            </Button>
          </Stack>
        )}
      </Stack>

      <ScannerWidget
        lastBarcode={lastBarcode}
        flashState={flashState}
        totalScans={totalScans}
        uniqueItems={items.length}
        isFocused={isFocused}
        onBoxClick={() => { inputRef.current?.focus(); }}
        inputRef={inputRef}
        onKeyDown={handleKeyDown}
      />
      {/* Track focus state separately since the input is position:absolute */}
      <Box
        sx={{ height: 0, overflow: "hidden" }}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={() => setIsFocused(false)}
      />

      {/* Mock scan buttons */}
      <Box sx={{ mt: 1.5, mb: 3 }}>
        <Button size="small" startIcon={<BugIcon sx={{ fontSize: 14 }} />} onClick={() => setShowMock((v) => !v)}
          sx={{ fontSize: "0.65rem", color: "#a3a3a3", p: 0 }}>
          {showMock ? "Hide" : "Show"} mock scan buttons
        </Button>
        {showMock && (
          <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
            {MOCK_ITEMS.map((item) => (
              <Button key={item.upc} size="small" variant="outlined"
                onClick={() => handleMockScan(item.upc)}
                sx={{ fontSize: "0.65rem", borderColor: "#e5e5e5", color: "text.secondary", py: 0.25 }}>
                {item.label}
              </Button>
            ))}
          </Stack>
        )}
      </Box>

      {/* Unknown barcodes warning */}
      {unknownBarcodes.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2, fontSize: "0.78rem" }} onClose={() => setUnknownBarcodes([])}>
          <strong>{unknownBarcodes.length} unrecognized barcode{unknownBarcodes.length > 1 ? "s" : ""}:</strong>{" "}
          {unknownBarcodes.map((b, i) => (
            <Typography key={b} component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
              {b}{i < unknownBarcodes.length - 1 ? ", " : ""}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Count table */}
      <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>Count Results</Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mt: 0.25 }}>Scanned Items</Typography>
          </Box>
          {items.length > 0 && (
            <Chip label={`${items.length} SKU${items.length !== 1 ? "s" : ""} · ${totalScans} total`} size="small" sx={{ bgcolor: "#f5f5f5", fontSize: "0.7rem", fontWeight: 600 }} />
          )}
        </Box>

        {items.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 10, color: "text.secondary" }}>
            <ScannerIcon sx={{ fontSize: 44, mb: 2, opacity: 0.25 }} />
            <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>No items scanned yet</Typography>
            <Typography variant="caption" color="text.secondary">Click the scanner widget above, then scan barcodes</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5" } }}>
                {["#", "SKU", "Product Name", "Count", "Last Scanned", ""].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", py: 1.25, whiteSpace: "nowrap" }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, i) => (
                <TableRow key={item.sku} sx={{ "&:hover": { bgcolor: "#fafafa" }, "& td": { borderBottom: "1px solid #fafafa" } }}>
                  <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem", width: 36 }}>{i + 1}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>{item.sku}</TableCell>
                  <TableCell sx={{ fontSize: "0.8rem", color: "text.primary" }}>{item.name}</TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={0.5}>
                      <IconButton size="small" onClick={() => { adjustCount(item.sku, -1); inputRef.current?.focus(); }}
                        sx={{ color: "#d4d4d4", "&:hover": { color: "#dc2626" }, p: 0.25 }}>
                        <RemoveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <Chip label={item.count} size="small" sx={{ minWidth: 36, bgcolor: "#171717", color: "white", fontWeight: 800, fontSize: "0.78rem", fontFamily: "monospace", height: 24 }} />
                      <IconButton size="small" onClick={() => { adjustCount(item.sku, 1); inputRef.current?.focus(); }}
                        sx={{ color: "#d4d4d4", "&:hover": { color: "#16a34a" }, p: 0.25 }}>
                        <AddIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.75rem", color: "text.secondary", whiteSpace: "nowrap" }}>
                    {new Date(item.lastScanned).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => { removeItem(item.sku); inputRef.current?.focus(); }}
                      sx={{ color: "#d4d4d4", "&:hover": { color: "#ef4444" } }}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {items.length > 0 && (
          <Box sx={{ px: 3, py: 1.5, borderTop: "1px solid #f5f5f5", bgcolor: "#fafafa", display: "flex", justifyContent: "flex-end", gap: 4 }}>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>Unique SKUs</Typography>
              <Typography sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem" }}>{items.length}</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>Total Units</Typography>
              <Typography sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem" }}>{totalScans}</Typography>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Clear confirmation dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <WarningIcon sx={{ fontSize: 16, color: "#dc2626" }} />
          </Box>
          Clear All Counts?
        </DialogTitle>
        <DialogContent sx={{ pt: "12px !important" }}>
          <Typography variant="body2" color="text.secondary">
            This will remove all <strong>{items.length} scanned items</strong> ({totalScans} total units). This cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button onClick={() => setClearDialogOpen(false)} sx={{ color: "text.secondary", fontSize: "0.8rem" }}>Cancel</Button>
          <Button variant="contained" onClick={handleClear} sx={{ bgcolor: "#dc2626", "&:hover": { bgcolor: "#b91c1c" }, fontSize: "0.8rem" }}>Clear All</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
// import {
//   Box, Typography, Paper, Button, Stack, Table, TableBody,
//   TableCell, TableHead, TableRow, Chip, IconButton,
//   Dialog, DialogTitle, DialogContent, DialogActions,
//   TextField, Divider, Alert,
// } from "@mui/material";
// import {
//   QrCodeScanner as ScannerIcon,
//   Download as DownloadIcon,
//   Delete as DeleteIcon,
//   DeleteSweep as ClearIcon,
//   Add as AddIcon,
//   Remove as RemoveIcon,
//   BugReport as BugIcon,
//   CheckCircle as CheckIcon,
//   Warning as WarningIcon,
// } from "@mui/icons-material";
// import { upc_codes } from "@/data/mockData";

// // ─── Types ────────────────────────────────────────────────────────────────────

// interface CountedItem {
//   sku: string;
//   name: string;
//   count: number;
//   lastScanned: string; // ISO timestamp
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// const findItemByUPC = (gtin: number): { sku: string; name: string } | null => {
//   const match = upc_codes.find((u) => u.GTIN === gtin);
//   if (!match) return null;
//   // Derive a human-readable name from SKU (in real app this comes from NetSuite)
//   const nameMap: Record<string, string> = {
//     "AM-PU-001-ASY-0100BK": "Super Pista Ultimate – Black",
//     "AM-PU-001-ASY-0100SL": "Super Pista Ultimate – Silver",
//     "AM-PU-002-ASY-0100RD": "Pista Corsa – Red",
//     "AM-PU-004-ASY-0300SL": "Impero Ultimate – Silver",
//     "AM-PU-006-ASY-0000SL": "Tattico Bluetooth – Silver",
//     "AM-PU-009-ASY-0200BK": "Eolo III – Black",
//     "AM-AC-007-COI-0300BK": "Cielo Road Tire – Black",
//     "AM-AC-008-COI-0000SL": "Mensola Wall Mount – Silver",
//     "AM-AP-010-COI-0000BK": "Leggero Saddle Bag – Black",
//   };
//   return { sku: match.SKU, name: nameMap[match.SKU] ?? match.SKU };
// };

// const mockScan = (value: string) => {
//   for (const char of value) {
//     document.dispatchEvent(new KeyboardEvent("keydown", { key: char }));
//   }
//   document.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
// };

// const MOCK_ITEMS = [
//   { label: "Super Pista Ultimate", upc: "810093162987" },
//   { label: "Tattico Bluetooth", upc: "810093162642" },
//   { label: "Impero Ultimate", upc: "810093160938" },
//   { label: "Eolo III", upc: "850005186328" },
//   { label: "Pista Corsa", upc: "810093161001" },
//   { label: "Cielo Tire", upc: "810093161002" },
//   { label: "Unknown UPC", upc: "000000000000" },
// ];

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ScannerWidget({
//   lastBarcode,
//   flashState,
//   totalScans,
//   uniqueItems,
// }: {
//   lastBarcode: string;
//   flashState: "idle" | "success" | "error";
//   totalScans: number;
//   uniqueItems: number;
// }) {
//   const borderColor = flashState === "success" ? "#bbf7d0" : flashState === "error" ? "#fecaca" : "#f5f5f5";
//   const bgColor = flashState === "success" ? "#f0fdf4" : flashState === "error" ? "#fff5f5" : "#fafafa";
//   const iconColor = flashState === "success" ? "#16a34a" : flashState === "error" ? "#dc2626" : "#a3a3a3";

//   return (
//     <Paper
//       variant="outlined"
//       sx={{
//         borderRadius: 2,
//         borderColor,
//         bgcolor: bgColor,
//         transition: "all 0.25s",
//         overflow: "hidden",
//       }}
//     >
//       <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
//         {/* Icon */}
//         <Box
//           sx={{
//             width: 52,
//             height: 52,
//             borderRadius: 2,
//             bgcolor: flashState === "success" ? "#dcfce7" : flashState === "error" ? "#fee2e2" : "#f5f5f5",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             flexShrink: 0,
//             transition: "all 0.25s",
//           }}
//         >
//           {flashState === "success" ? (
//             <CheckIcon sx={{ fontSize: 26, color: "#16a34a" }} />
//           ) : flashState === "error" ? (
//             <WarningIcon sx={{ fontSize: 26, color: "#dc2626" }} />
//           ) : (
//             <ScannerIcon sx={{ fontSize: 26, color: "#a3a3a3" }} />
//           )}
//         </Box>

//         {/* Status text */}
//         <Box sx={{ flex: 1 }}>
//           <Typography
//             sx={{
//               fontSize: "0.65rem",
//               fontWeight: 700,
//               letterSpacing: "0.12em",
//               textTransform: "uppercase",
//               color: iconColor,
//               transition: "color 0.25s",
//             }}
//           >
//             {flashState === "success"
//               ? "Item Scanned"
//               : flashState === "error"
//               ? "Not Recognized"
//               : "Scanner Ready"}
//           </Typography>
//           <Typography
//             sx={{
//               fontFamily: "monospace",
//               fontSize: "0.9rem",
//               fontWeight: 600,
//               color: "text.primary",
//               mt: 0.25,
//               minHeight: 22,
//             }}
//           >
//             {lastBarcode || "Waiting for scan…"}
//           </Typography>
//         </Box>

//         {/* Stats */}
//         <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
//           <Box sx={{ textAlign: "center" }}>
//             <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "text.primary", lineHeight: 1 }}>
//               {totalScans}
//             </Typography>
//             <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", mt: 0.25 }}>
//               Total Scans
//             </Typography>
//           </Box>
//           <Divider orientation="vertical" flexItem sx={{ borderColor: "#f5f5f5" }} />
//           <Box sx={{ textAlign: "center" }}>
//             <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "text.primary", lineHeight: 1 }}>
//               {uniqueItems}
//             </Typography>
//             <Typography sx={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", mt: 0.25 }}>
//               Unique SKUs
//             </Typography>
//           </Box>
//         </Stack>
//       </Box>
//     </Paper>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CycleCount() {
//   const [counts, setCounts] = useState<Record<string, CountedItem>>({});
//   const [lastBarcode, setLastBarcode] = useState("");
//   const [flashState, setFlashState] = useState<"idle" | "success" | "error">("idle");
//   const [showMock, setShowMock] = useState(false);
//   const [clearDialogOpen, setClearDialogOpen] = useState(false);
//   const [unknownBarcodes, setUnknownBarcodes] = useState<string[]>([]);
//   const accumulatedBarcode = useRef("");
//   const flashTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const flash = (state: "success" | "error") => {
//     setFlashState(state);
//     if (flashTimeout.current) clearTimeout(flashTimeout.current);
//     flashTimeout.current = setTimeout(() => setFlashState("idle"), 700);
//   };

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Enter" || e.code === "NumpadEnter") {
//         const scanned = accumulatedBarcode.current.trim();
//         accumulatedBarcode.current = "";
//         if (!scanned) return;

//         setLastBarcode(scanned);
//         const item = findItemByUPC(Number(scanned));

//         if (!item) {
//           flash("error");
//           setUnknownBarcodes((prev) =>
//             prev.includes(scanned) ? prev : [...prev, scanned]
//           );
//           return;
//         }

//         flash("success");
//         setCounts((prev) => {
//           const existing = prev[item.sku];
//           return {
//             ...prev,
//             [item.sku]: {
//               sku: item.sku,
//               name: item.name,
//               count: (existing?.count ?? 0) + 1,
//               lastScanned: new Date().toISOString(),
//             },
//           };
//         });
//       } else if (e.key.length === 1) {
//         accumulatedBarcode.current += e.key;
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);
//     return () => document.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   const items = Object.values(counts).sort(
//     (a, b) => new Date(b.lastScanned).getTime() - new Date(a.lastScanned).getTime()
//   );

//   const totalScans = items.reduce((sum, i) => sum + i.count, 0);

//   const adjustCount = (sku: string, delta: number) => {
//     setCounts((prev) => {
//       const item = prev[sku];
//       if (!item) return prev;
//       const newCount = item.count + delta;
//       if (newCount <= 0) {
//         const next = { ...prev };
//         delete next[sku];
//         return next;
//       }
//       return { ...prev, [sku]: { ...item, count: newCount } };
//     });
//   };

//   const removeItem = (sku: string) => {
//     setCounts((prev) => {
//       const next = { ...prev };
//       delete next[sku];
//       return next;
//     });
//   };

//   const handleClear = () => {
//     setCounts({});
//     setUnknownBarcodes([]);
//     setLastBarcode("");
//     setFlashState("idle");
//     setClearDialogOpen(false);
//   };

//   const exportData = (format: "csv" | "xlsx") => {
//     const rows = items.map((item) => ({
//       SKU: item.sku,
//       "Product Name": item.name,
//       Count: item.count,
//       "Last Scanned": new Date(item.lastScanned).toLocaleString(),
//     }));

//     const ws = XLSX.utils.json_to_sheet(rows);

//     // Auto-size columns
//     ws["!cols"] = [
//       { wch: 28 }, // SKU
//       { wch: 36 }, // Product Name
//       { wch: 10 }, // Count
//       { wch: 22 }, // Last Scanned
//     ];

//     const filename = `SILCA_CycleCount_${new Date().toISOString().split("T")[0]}`;

//     if (format === "csv") {
//       const csv = XLSX.utils.sheet_to_csv(ws);
//       const a = document.createElement("a");
//       a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
//       a.download = `${filename}.csv`;
//       a.click();
//     } else {
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, "Cycle Count");
//       XLSX.writeFile(wb, `${filename}.xlsx`);
//     }
//   };

//   return (
//     <Box>
//       {/* Header */}
//       <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
//         <Box>
//           <Typography variant="h5" fontWeight={700} color="text.primary">
//             Cycle Count
//           </Typography>
//           <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//             Scan items to count inventory. Each scan increments the item's count.
//             Export to CSV or Excel when complete.
//           </Typography>
//         </Box>

//         {items.length > 0 && (
//           <Stack direction="row" spacing={1}>
//             <Button
//               variant="outlined"
//               size="small"
//               startIcon={<ClearIcon />}
//               onClick={() => setClearDialogOpen(true)}
//               sx={{ fontSize: "0.75rem", borderColor: "#fecaca", color: "#dc2626", "&:hover": { borderColor: "#dc2626", bgcolor: "#fff5f5" } }}
//             >
//               Clear All
//             </Button>
//             <Button
//               variant="outlined"
//               size="small"
//               startIcon={<DownloadIcon />}
//               onClick={() => exportData("xlsx")}
//               sx={{ fontSize: "0.75rem", borderColor: "#e5e5e5", color: "text.secondary", "&:hover": { borderColor: "#a3a3a3" } }}
//             >
//               Export XLSX
//             </Button>
//             <Button
//               variant="contained"
//               size="small"
//               startIcon={<DownloadIcon />}
//               onClick={() => exportData("csv")}
//               sx={{ fontSize: "0.75rem", bgcolor: "#171717", "&:hover": { bgcolor: "#404040" } }}
//             >
//               Export CSV
//             </Button>
//           </Stack>
//         )}
//       </Stack>

//       {/* Scanner widget */}
//       <ScannerWidget
//         lastBarcode={lastBarcode}
//         flashState={flashState}
//         totalScans={totalScans}
//         uniqueItems={items.length}
//       />

//       {/* Mock scan dev tools */}
//       <Box sx={{ mt: 1.5, mb: 3 }}>
//         <Button
//           size="small"
//           startIcon={<BugIcon sx={{ fontSize: 14 }} />}
//           onClick={() => setShowMock((v) => !v)}
//           sx={{ fontSize: "0.65rem", color: "#a3a3a3", p: 0 }}
//         >
//           {showMock ? "Hide" : "Show"} mock scan buttons
//         </Button>
//         {showMock && (
//           <Stack direction="row" flexWrap="wrap" gap={0.75} sx={{ mt: 1 }}>
//             {MOCK_ITEMS.map((item) => (
//               <Button
//                 key={item.upc}
//                 size="small"
//                 variant="outlined"
//                 onClick={() => mockScan(item.upc)}
//                 sx={{ fontSize: "0.65rem", borderColor: "#e5e5e5", color: "text.secondary", py: 0.25 }}
//               >
//                 {item.label}
//               </Button>
//             ))}
//           </Stack>
//         )}
//       </Box>

//       {/* Unknown barcodes warning */}
//       {unknownBarcodes.length > 0 && (
//         <Alert
//           severity="warning"
//           sx={{ mb: 2, fontSize: "0.78rem" }}
//           onClose={() => setUnknownBarcodes([])}
//         >
//           <strong>{unknownBarcodes.length} unrecognized barcode{unknownBarcodes.length > 1 ? "s" : ""}:</strong>{" "}
//           {unknownBarcodes.map((b, i) => (
//             <Typography key={b} component="span" sx={{ fontFamily: "monospace", fontSize: "0.75rem" }}>
//               {b}{i < unknownBarcodes.length - 1 ? ", " : ""}
//             </Typography>
//           ))}
//         </Alert>
//       )}

//       {/* Count table */}
//       <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
//         <Box
//           sx={{
//             px: 3,
//             py: 2,
//             borderBottom: "1px solid #f5f5f5",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <Box>
//             <Typography
//               sx={{
//                 fontSize: "0.6rem",
//                 fontWeight: 700,
//                 letterSpacing: "0.12em",
//                 textTransform: "uppercase",
//                 color: "text.secondary",
//               }}
//             >
//               Count Results
//             </Typography>
//             <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mt: 0.25 }}>
//               Scanned Items
//             </Typography>
//           </Box>
//           {items.length > 0 && (
//             <Chip
//               label={`${items.length} SKU${items.length !== 1 ? "s" : ""} · ${totalScans} total`}
//               size="small"
//               sx={{ bgcolor: "#f5f5f5", fontSize: "0.7rem", fontWeight: 600 }}
//             />
//           )}
//         </Box>

//         {items.length === 0 ? (
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "center",
//               py: 10,
//               color: "text.secondary",
//             }}
//           >
//             <ScannerIcon sx={{ fontSize: 44, mb: 2, opacity: 0.25 }} />
//             <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
//               No items scanned yet
//             </Typography>
//             <Typography variant="caption" color="text.secondary">
//               Scan barcodes with a Zebra scanner or use the mock buttons above
//             </Typography>
//           </Box>
//         ) : (
//           <Table size="small">
//             <TableHead>
//               <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5" } }}>
//                 {["#", "SKU", "Product Name", "Count", "Last Scanned", ""].map((h) => (
//                   <TableCell
//                     key={h}
//                     sx={{
//                       fontSize: "0.6rem",
//                       fontWeight: 700,
//                       letterSpacing: "0.1em",
//                       textTransform: "uppercase",
//                       color: "text.secondary",
//                       py: 1.25,
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     {h}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {items.map((item, i) => (
//                 <TableRow
//                   key={item.sku}
//                   sx={{
//                     "&:hover": { bgcolor: "#fafafa" },
//                     "& td": { borderBottom: "1px solid #fafafa" },
//                   }}
//                 >
//                   <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem", width: 36 }}>
//                     {i + 1}
//                   </TableCell>
//                   <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>
//                     {item.sku}
//                   </TableCell>
//                   <TableCell sx={{ fontSize: "0.8rem", color: "text.primary" }}>
//                     {item.name}
//                   </TableCell>
//                   <TableCell>
//                     <Stack direction="row" alignItems="center" spacing={0.5}>
//                       <IconButton
//                         size="small"
//                         onClick={() => adjustCount(item.sku, -1)}
//                         sx={{ color: "#d4d4d4", "&:hover": { color: "#dc2626" }, p: 0.25 }}
//                       >
//                         <RemoveIcon sx={{ fontSize: 14 }} />
//                       </IconButton>
//                       <Chip
//                         label={item.count}
//                         size="small"
//                         sx={{
//                           minWidth: 36,
//                           bgcolor: "#171717",
//                           color: "white",
//                           fontWeight: 800,
//                           fontSize: "0.78rem",
//                           fontFamily: "monospace",
//                           height: 24,
//                         }}
//                       />
//                       <IconButton
//                         size="small"
//                         onClick={() => adjustCount(item.sku, 1)}
//                         sx={{ color: "#d4d4d4", "&:hover": { color: "#16a34a" }, p: 0.25 }}
//                       >
//                         <AddIcon sx={{ fontSize: 14 }} />
//                       </IconButton>
//                     </Stack>
//                   </TableCell>
//                   <TableCell sx={{ fontSize: "0.75rem", color: "text.secondary", whiteSpace: "nowrap" }}>
//                     {new Date(item.lastScanned).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
//                   </TableCell>
//                   <TableCell align="right">
//                     <IconButton
//                       size="small"
//                       onClick={() => removeItem(item.sku)}
//                       sx={{ color: "#d4d4d4", "&:hover": { color: "#ef4444" } }}
//                     >
//                       <DeleteIcon sx={{ fontSize: 16 }} />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         )}

//         {/* Footer totals */}
//         {items.length > 0 && (
//           <Box
//             sx={{
//               px: 3,
//               py: 1.5,
//               borderTop: "1px solid #f5f5f5",
//               bgcolor: "#fafafa",
//               display: "flex",
//               justifyContent: "flex-end",
//               gap: 4,
//             }}
//           >
//             <Box sx={{ textAlign: "right" }}>
//               <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>
//                 Unique SKUs
//               </Typography>
//               <Typography sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem" }}>
//                 {items.length}
//               </Typography>
//             </Box>
//             <Box sx={{ textAlign: "right" }}>
//               <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary" }}>
//                 Total Units
//               </Typography>
//               <Typography sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem" }}>
//                 {totalScans}
//               </Typography>
//             </Box>
//           </Box>
//         )}
//       </Paper>

//       {/* Clear confirmation dialog */}
//       <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)} maxWidth="xs" fullWidth>
//         <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
//           <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
//             <WarningIcon sx={{ fontSize: 16, color: "#dc2626" }} />
//           </Box>
//           Clear All Counts?
//         </DialogTitle>
//         <DialogContent sx={{ pt: "12px !important" }}>
//           <Typography variant="body2" color="text.secondary">
//             This will remove all <strong>{items.length} scanned items</strong> ({totalScans} total units) from the current count. This cannot be undone.
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
//           <Button onClick={() => setClearDialogOpen(false)} sx={{ color: "text.secondary", fontSize: "0.8rem" }}>
//             Cancel
//           </Button>
//           <Button
//             variant="contained"
//             onClick={handleClear}
//             sx={{ bgcolor: "#dc2626", "&:hover": { bgcolor: "#b91c1c" }, fontSize: "0.8rem" }}
//           >
//             Clear All
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }
