"use client";

import { useState, useCallback, useRef } from "react";
import * as XLSX from "xlsx";
import {
  Box, Typography, Button, Paper, Table, TableBody, TableCell,
  TableHead, TableRow, Stack, Select, MenuItem, FormControl,
  TextField, Stepper, Step, StepLabel, Alert, Grid, IconButton,
} from "@mui/material";
import {
  UploadFile as UploadIcon, Download as DownloadIcon,
  CheckCircle as CheckCircleIcon, Info as InfoIcon,
  TableChart as TableIcon, Delete as DeleteIcon, ArrowForward as ArrowIcon,
} from "@mui/icons-material";

const ADJUSTMENT_REASONS = [
  "Cycle Count Adjustment", "Damaged Goods", "Found Inventory", "Lost Inventory",
  "Mis-Ship", "Obsolete Inventory", "Physical Inventory Count", "Promotional Use",
  "Quality Hold", "Return to Stock", "Scrapped", "Shrinkage", "Transfer Error",
  "Warranty Replacement", "Write-Off",
];

const ADJUSTMENT_ACCOUNTS = [
  "10001 Cash - Operating - SYB (7570)", "10003 Cash - Wintrust (1918)", "10099 Undeposited Funds",
  "12110 Inventory : Inventory:Finished Goods", "12115 Inventory : Inventory Overhead",
  "12200 Inventory : Inventory In Transit", "51001 Cost of Goods Sold : Warranty Costs",
  "51005 Cost of Goods Sold : Scrapped Inventory", "51050 Cost of Goods Sold : Inventory Adjustment",
  "57000 Inventory FMV Adjustments", "66100 Condensed Item Adj. Expense",
  "66900 Reconciliation Discrepancies",
];

const LOCATIONS = [
  "1.1 Silca HQ", "1.2 QC Hold", "1.3 Vendor Location", "1.4 Shopify POS",
  "2.1 3PL Location 1 : Netherlands", "2.2 3PL Location 2 : United Kingdom",
  "2.3 3PL Location 3 : Australia", "2.4 3PL Location 4 : Canada",
  "3.1 Amazon Warehouse", "3.2 Amazon Global", "Drop Ship",
];

interface AdjRow {
  line: string; item: string; breakdown: string;
  location: string; adjustQtyBy: number; newQuantity: number;
}

interface NsRow {
  "Internal Id": string; "Tran Date": string; "Tran Id": string;
  "Inventory Adjustment Reason": string; "Adjustment Account": string;
  "Line": string; "Item": string; "Breakdown": string;
  "Location": string; "Adjust Qty By": number; "New Quantity": number;
}

function todayISO() { return new Date().toISOString().split("T")[0]; }

function parseExcel(file: File): Promise<AdjRow[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(new Uint8Array(e.target!.result as ArrayBuffer), { type: "array" });
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { defval: "" });
        const get = (r: Record<string, unknown>, ...keys: string[]) => {
          for (const k of keys) {
            const match = Object.keys(r).find((c) => c.trim().toLowerCase() === k.toLowerCase());
            if (match !== undefined) return String(r[match] ?? "");
          }
          return "";
        };
        const rows = json.map((r, i) => ({
          line: get(r, "line") || String(i + 1),
          item: get(r, "item", "sku", "part number", "partno"),
          breakdown: get(r, "breakdown", "memo", "notes", "description"),
          location: get(r, "location", "loc"),
          adjustQtyBy: Number(get(r, "adjust qty by", "adjustqtyby", "qty", "quantity", "inventory +/-")) || 0,
          newQuantity: Number(get(r, "new quantity", "newquantity", "new qty")) || 0,
        }));
        resolve(rows.filter((r) => r.item));
      } catch (err) { reject(err); }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>{children}</Typography>;
}

function ImportInstructions() {
  const steps = [
    { label: "Go to Import CSV", detail: "Setup → Import/Export → Import CSV Records" },
    { label: "Import Type", detail: "Transactions" },
    { label: "Record Type", detail: "Inventory Adjustment" },
    { label: "Character Encoding", detail: "Western (Windows 1252)" },
    { label: "CSV Column Delimiter", detail: "Comma" },
    { label: "Upload CSV File", detail: "Upload the exported CSV file and map fields as prompted." },
  ];
  return (
    <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", gap: 1 }}>
        <InfoIcon sx={{ fontSize: 16, color: "text.secondary" }} />
        <Typography variant="body2" fontWeight={600}>How to Import into NetSuite</Typography>
      </Box>
      <Box sx={{ px: 3, py: 2.5 }}>
        <Stack spacing={0}>
          {steps.map((step, i) => (
            <Box key={i} sx={{ display: "flex", gap: 2, pb: i < steps.length - 1 ? 2 : 0 }}>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Box sx={{ width: 22, height: 22, borderRadius: "50%", bgcolor: "#171717", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", fontWeight: 700, flexShrink: 0 }}>
                  {i + 1}
                </Box>
                {i < steps.length - 1 && <Box sx={{ width: 1, flex: 1, bgcolor: "#e5e5e5", mt: 0.5 }} />}
              </Box>
              <Box sx={{ pb: 0.5 }}>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>{step.label}</Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary", mt: 0.25 }}>{step.detail}</Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

export default function BulkInventoryAdjustment() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState(0);
  const [parseError, setParseError] = useState("");
  const [editedRows, setEditedRows] = useState<AdjRow[]>([]);
  const [header, setHeader] = useState({ internalId: "", tranId: "", reason: "", account: "51050 Cost of Goods Sold : Inventory Adjustment" });

  const nsRows: NsRow[] = editedRows.map((r) => ({
    "Internal Id": header.internalId, "Tran Date": todayISO(), "Tran Id": header.tranId,
    "Inventory Adjustment Reason": header.reason, "Adjustment Account": header.account,
    "Line": r.line, "Item": r.item, "Breakdown": r.breakdown,
    "Location": r.location, "Adjust Qty By": r.adjustQtyBy, "New Quantity": r.newQuantity,
  }));

  const handleFile = useCallback(async (f: File) => {
    setParseError(""); setFile(f);
    try {
      const rows = await parseExcel(f);
      if (!rows.length) { setParseError("No data rows found. Check column headers."); return; }
      setEditedRows(rows.map((r) => ({ ...r })));
      setStep(1);
    } catch { setParseError("Could not parse file. Ensure it's a valid .xlsx or .csv."); }
  }, []);

  const updateRow = (i: number, field: keyof AdjRow, value: string | number) =>
    setEditedRows((prev) => prev.map((r, j) => j === i ? { ...r, [field]: value } : r));

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(nsRows);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=windows-1252;" }));
    a.download = `SILCA_InvAdj_${todayISO()}.csv`;
    a.click();
  };

  const exportXLSX = () => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(nsRows), "Inventory Adjustment");
    XLSX.writeFile(wb, `SILCA_InvAdj_${todayISO()}.xlsx`);
  };

  const headerReady = !!(header.reason && header.account);

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Bulk Inventory Adjustment</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Upload your log, configure header fields, preview, then export a NetSuite-ready CSV.
          </Typography>
        </Box>
        {step === 2 && (
          <Stack direction="row" gap={1}>
            <Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={exportXLSX}
              sx={{ fontSize: "0.75rem", borderColor: "#e5e5e5", color: "text.secondary" }}>Export XLSX</Button>
            <Button variant="contained" size="small" startIcon={<DownloadIcon />} onClick={exportCSV}
              sx={{ fontSize: "0.75rem", bgcolor: "#171717", "&:hover": { bgcolor: "#404040" } }}>Export CSV for NetSuite</Button>
          </Stack>
        )}
      </Stack>

      <Stepper activeStep={step} sx={{ mb: 3, "& .MuiStepLabel-label": { fontSize: "0.75rem" } }}>
        {["Upload File", "Configure Header", "Preview & Export"].map((l) => <Step key={l}><StepLabel>{l}</StepLabel></Step>)}
      </Stepper>

      {/* Step 0 - Upload */}
      {step === 0 && (
        <>
          <Paper variant="outlined" onClick={() => fileRef.current?.click()}
            onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
            onDragOver={(e) => e.preventDefault()}
            sx={{ borderRadius: 2, borderStyle: "dashed", borderColor: "#d4d4d4", bgcolor: "white", cursor: "pointer", p: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5, "&:hover": { borderColor: "#a3a3a3", bgcolor: "#fafafa" } }}>
            <UploadIcon sx={{ fontSize: 40, color: "#a3a3a3" }} />
            <Typography fontWeight={600}>Drop your inventory adjustment Excel or CSV here</Typography>
            <Typography variant="body2" color="text.secondary">or click to browse — .xlsx, .xls, .csv supported</Typography>
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
          </Paper>
          {parseError && <Alert severity="error" sx={{ mt: 2 }}>{parseError}</Alert>}
          <ImportInstructions />
        </>
      )}

      {/* Step 1 - Configure */}
      {step === 1 && (
        <>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5" }}>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>Transaction Header</Typography>
              <Typography variant="caption" color="text.secondary">
                These fields apply to the entire batch. <strong>{editedRows.length} rows</strong> loaded from <strong>{file?.name}</strong>.
              </Typography>
            </Box>
            <Box sx={{ px: 3, py: 2.5 }}>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <FieldLabel>Internal ID <Typography component="span" sx={{ fontSize: "0.6rem", color: "#a3a3a3" }}>(optional)</Typography></FieldLabel>
                  <TextField fullWidth size="small" value={header.internalId} onChange={(e) => setHeader((h) => ({ ...h, internalId: e.target.value }))} placeholder="Leave blank for new record" sx={{ "& input": { fontFamily: "monospace", fontSize: "0.8rem" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel>Tran ID / Reference</FieldLabel>
                  <TextField fullWidth size="small" value={header.tranId} onChange={(e) => setHeader((h) => ({ ...h, tranId: e.target.value }))} placeholder="e.g. INV-ADJ-2026-001" sx={{ "& input": { fontFamily: "monospace", fontSize: "0.8rem" } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel>Reason <Typography component="span" sx={{ color: "#ef4444", fontSize: "0.65rem" }}>*</Typography></FieldLabel>
                  <FormControl fullWidth size="small">
                    <Select value={header.reason} onChange={(e) => setHeader((h) => ({ ...h, reason: e.target.value }))} displayEmpty sx={{ fontSize: "0.8rem" }}>
                      <MenuItem value=""><em style={{ color: "#a3a3a3" }}>Select reason…</em></MenuItem>
                      {ADJUSTMENT_REASONS.map((r) => <MenuItem key={r} value={r} sx={{ fontSize: "0.8rem" }}>{r}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FieldLabel>Adjustment Account <Typography component="span" sx={{ color: "#ef4444", fontSize: "0.65rem" }}>*</Typography></FieldLabel>
                  <FormControl fullWidth size="small">
                    <Select value={header.account} onChange={(e) => setHeader((h) => ({ ...h, account: e.target.value }))} sx={{ fontSize: "0.75rem", fontFamily: "monospace" }}>
                      {ADJUSTMENT_ACCOUNTS.map((a) => <MenuItem key={a} value={a} sx={{ fontSize: "0.75rem", fontFamily: "monospace" }}>{a}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Row editor */}
          <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5" }}>
              <Typography variant="body2" fontWeight={600}>Review & Edit Rows</Typography>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5" } }}>
                    {["#", "Item (SKU)", "Breakdown", "Location", "Adj Qty", "New Qty", ""].map((h) => (
                      <TableCell key={h} sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", py: 1.25 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {editedRows.map((row, i) => (
                    <TableRow key={i} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                      <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem", width: 36 }}>{i + 1}</TableCell>
                      <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem", whiteSpace: "nowrap" }}>{row.item}</TableCell>
                      <TableCell><TextField size="small" value={row.breakdown} onChange={(e) => updateRow(i, "breakdown", e.target.value)} sx={{ minWidth: 140, "& input": { fontSize: "0.75rem" } }} /></TableCell>
                      <TableCell>
                        <FormControl size="small" sx={{ minWidth: 160 }}>
                          <Select value={row.location} onChange={(e) => updateRow(i, "location", e.target.value)} displayEmpty sx={{ fontSize: "0.75rem" }}>
                            <MenuItem value=""><em style={{ color: "#a3a3a3" }}>Select…</em></MenuItem>
                            {LOCATIONS.map((l) => <MenuItem key={l} value={l} sx={{ fontSize: "0.75rem" }}>{l}</MenuItem>)}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell><TextField size="small" type="number" value={row.adjustQtyBy} onChange={(e) => updateRow(i, "adjustQtyBy", Number(e.target.value))} sx={{ width: 80, "& input": { fontSize: "0.75rem", fontFamily: "monospace" } }} /></TableCell>
                      <TableCell><TextField size="small" type="number" value={row.newQuantity} onChange={(e) => updateRow(i, "newQuantity", Number(e.target.value))} sx={{ width: 80, "& input": { fontSize: "0.75rem", fontFamily: "monospace" } }} /></TableCell>
                      <TableCell>
                        <IconButton size="small" onClick={() => setEditedRows((p) => p.filter((_, j) => j !== i))} sx={{ color: "#d4d4d4", "&:hover": { color: "#ef4444" } }}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>

          <Stack direction="row" gap={2} sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => { setStep(0); setFile(null); setEditedRows([]); }} sx={{ borderColor: "#e5e5e5", color: "text.secondary" }}>← Start Over</Button>
            <Button variant="contained" disabled={!headerReady || !editedRows.length} onClick={() => setStep(2)} endIcon={<ArrowIcon />}
              sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#404040" }, "&.Mui-disabled": { bgcolor: "#d4d4d4", color: "white" } }}>
              Preview NetSuite CSV
            </Button>
          </Stack>
        </>
      )}

      {/* Step 2 - Preview */}
      {step === 2 && (
        <>
          <Alert severity="success" icon={<CheckCircleIcon />} sx={{ mb: 3 }}>
            <strong>{nsRows.length} rows</strong> ready for NetSuite import.
          </Alert>
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5", display: "flex", gap: 1, alignItems: "center" }}>
              <TableIcon sx={{ fontSize: 16, color: "text.secondary" }} />
              <Typography variant="body2" fontWeight={600}>CSV Preview</Typography>
            </Box>
            <Box sx={{ overflowX: "auto" }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5", whiteSpace: "nowrap" } }}>
                    {Object.keys(nsRows[0] ?? {}).map((h) => (
                      <TableCell key={h} sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", py: 1.25 }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nsRows.map((row, i) => (
                    <TableRow key={i} sx={{ "&:hover": { bgcolor: "#fafafa" } }}>
                      {Object.values(row).map((v, j) => (
                        <TableCell key={j} sx={{ fontFamily: "monospace", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{String(v)}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
          <Stack direction="row" gap={2} sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={() => setStep(1)} sx={{ borderColor: "#e5e5e5", color: "text.secondary" }}>← Back to Edit</Button>
            <Button variant="outlined" startIcon={<DownloadIcon />} onClick={exportXLSX} sx={{ borderColor: "#e5e5e5", color: "text.secondary" }}>Export XLSX</Button>
            <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportCSV} sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#404040" } }}>Export CSV for NetSuite</Button>
          </Stack>
          <ImportInstructions />
        </>
      )}
    </Box>
  );
}
