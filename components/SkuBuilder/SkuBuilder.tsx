"use client";

import { useState, useMemo } from "react";
import {
  Box, Typography, Select, MenuItem, FormControl, Button,
  Paper, Table, TableBody, TableCell, TableHead, TableRow,
  Stack, Grid, Chip,
} from "@mui/material";
import { Add as AddIcon, ContentCopy as CopyIcon, Check as CheckIcon, CalendarMonth as CalendarIcon, Delete as DeleteIcon } from "@mui/icons-material";

const SEGMENT_BB_CATEGORY: Record<string, string> = {
  AC: "Accessory", PU: "Pump", TO: "Tool", CC: "Common Component",
  SC: "SILCA Collaboration", RM: "Raw Material", AP: "Apparel", PG: "Packaging",
};
const SEGMENT_CCC_FAMILY: Record<string, string> = {
  "001": "Super Pista", "002": "Pista", "003": "Imperatore", "004": "Impero",
  "005": "Ultimate", "006": "Tattico", "007": "Cielo", "008": "Mensola",
  "009": "Eolo", "010": "Leggero", "097": "Bulk Supplies", "098": "Standard Hardware",
  "099": "Promotional Items", "970": "M6x1 Hardware", "971": "M5x0.8 Hardware", "972": "M4x0.7 Hardware",
};
const SEGMENT_DDD_TYPE: Record<string, string> = {
  ASY: "Assembly", COI: "Component / Individual", PKG: "Package",
  RAW: "Raw Material", JIG: "Jig / Fixture", TOL: "Tool",
};
const SEGMENT_EE_SIZE: Record<string, string> = {
  "00": "One Size / Universal", "01": "Small / 60mm", "02": "Medium / 80mm",
  "03": "Large / 100mm", "04": "Extra Large / 120mm", "10": "200mm",
  "20": "300mm", "30": "400mm", "40": "500mm",
};
const SEGMENT_FF_COLOR: Record<string, string> = {
  "00": "Standard / No Finish", BK: "Black", RD: "Red", SL: "Silver",
  GD: "Gold", BL: "Blue", GR: "Green", CH: "Charcoal", TI: "Titanium", CP: "Copper", NB: "Natural / Bare",
};

type SkuState = { aa: string; bb: string; ccc: string; ddd: string; ee: string; ff: string };

function buildSku(s: SkuState): string {
  const parts: string[] = [];
  if (s.aa) parts.push(s.aa);
  if (s.bb) parts.push(s.bb);
  if (s.ccc) parts.push(s.ccc);
  if (s.ddd) parts.push(s.ddd);
  const variant = (s.ee || "") + (s.ff || "");
  if (variant) parts.push(variant);
  return parts.join("-");
}

function buildDescription(s: SkuState): string {
  const parts: string[] = [];
  const family = s.ccc ? SEGMENT_CCC_FAMILY[s.ccc] : null;
  const type = s.ddd ? SEGMENT_DDD_TYPE[s.ddd] : null;
  const color = s.ff && s.ff !== "00" ? SEGMENT_FF_COLOR[s.ff] : null;
  const size = s.ee && s.ee !== "00" ? SEGMENT_EE_SIZE[s.ee] : null;
  const category = s.bb ? SEGMENT_BB_CATEGORY[s.bb] : null;
  if (family) parts.push(family);
  else if (category) parts.push(category);
  if (type) parts.push(type);
  if (size) parts.push(size);
  if (color) parts.push(color);
  return parts.join(" ").toUpperCase();
}

function SegmentBadge({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.25, opacity: active ? 1 : 0.3, transition: "opacity 0.2s" }}>
      <Typography sx={{ fontFamily: "monospace", fontSize: "1rem", fontWeight: 700, letterSpacing: "0.1em", color: active ? "text.primary" : "text.secondary" }}>
        {value || label}
      </Typography>
      <Typography sx={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>
        {label}
      </Typography>
    </Box>
  );
}

function SelectField({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: Record<string, string>; placeholder?: string;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
        {label}
      </Typography>
      <FormControl fullWidth size="small">
        <Select value={value} onChange={(e) => onChange(e.target.value)} displayEmpty sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>
          <MenuItem value=""><em style={{ color: "#a3a3a3" }}>{placeholder ?? "Select…"}</em></MenuItem>
          {Object.entries(options).map(([k, v]) => (
            <MenuItem key={k} value={k} sx={{ fontFamily: "monospace", fontSize: "0.78rem" }}>{k} — {v}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export default function SkuBuilder() {
  const [sku, setSku] = useState<SkuState>({ aa: "", bb: "", ccc: "", ddd: "", ee: "", ff: "" });
  const [copied, setCopied] = useState(false);
  const [rows, setRows] = useState<Array<{ sku: string; description: string }>>([]);

  const generatedSku = useMemo(() => buildSku(sku), [sku]);
  const generatedDesc = useMemo(() => buildDescription(sku), [sku]);
  const isReady = !!(sku.bb && sku.ccc && sku.ddd);

  const set = (key: keyof SkuState) => (val: string) => setSku((prev) => ({ ...prev, [key]: val }));

  const handleCopySku = () => {
    navigator.clipboard.writeText(generatedSku);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleAddRow = () => {
    if (!isReady) return;
    setRows((prev) => [...prev, { sku: generatedSku, description: generatedDesc }]);
    setSku({ aa: "", bb: "", ccc: "", ddd: "", ee: "", ff: "" });
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(rows.map((r) => `${r.sku}\t${r.description}`).join("\n"));
  };

  const segments = [
    { label: "AA", value: sku.aa }, { label: "BB", value: sku.bb },
    { label: "CCC", value: sku.ccc }, { label: "DDD", value: sku.ddd },
    { label: "EE", value: sku.ee }, { label: "FF", value: sku.ff },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={700}>SKU Builder</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Select each segment to generate a part number. Click <strong>Add Row to Table</strong> to queue multiple SKUs.
      </Typography>

      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        {/* Preview Bar */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "#fafafa", px: 3, py: 2, borderBottom: "1px solid #f5f5f5" }}>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {segments.map((seg, i) => (
              <Stack key={seg.label} direction="row" alignItems="center" spacing={1.5}>
                {i > 0 && <Typography sx={{ color: "#d4d4d4", fontWeight: 300, fontSize: "1.1rem" }}>–</Typography>}
                <SegmentBadge label={seg.label} value={seg.value} active={!!seg.value} />
              </Stack>
            ))}
          </Stack>
          <Button variant="outlined" size="small" disabled={!isReady} onClick={handleCopySku}
            startIcon={copied ? <CheckIcon sx={{ fontSize: "0.85rem !important", color: "#16a34a" }} /> : <CopyIcon sx={{ fontSize: "0.85rem !important" }} />}
            sx={{ fontSize: "0.7rem", color: copied ? "#16a34a" : "text.secondary", borderColor: "#e5e5e5", "&:hover": { borderColor: "#a3a3a3" }, "&.Mui-disabled": { opacity: 0.4 } }}>
            {copied ? "Copied!" : "Copy SKU"}
          </Button>
        </Box>

        {/* Output */}
        {isReady && (
          <Box sx={{ display: "flex", gap: 4, bgcolor: "rgba(250,250,250,0.5)", px: 3, py: 1.5, borderBottom: "1px solid #f5f5f5" }}>
            <Box>
              <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>Generated SKU</Typography>
              <Typography sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", mt: 0.25 }}>{generatedSku}</Typography>
            </Box>
            {generatedDesc && (
              <Box>
                <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>Description</Typography>
                <Typography sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", mt: 0.25 }}>{generatedDesc}</Typography>
              </Box>
            )}
          </Box>
        )}

        {/* Selectors */}
        <Box sx={{ px: 3, py: 2.5 }}>
          <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", mb: 2 }}>New SKU</Typography>
          <Grid container spacing={2}>
            {[
              { label: "AA — Channel", key: "aa" as keyof SkuState, options: { AM: "Aftermarket good", FG: "Finished Good" }, placeholder: "Optional…" },
              { label: "BB — Category", key: "bb" as keyof SkuState, options: SEGMENT_BB_CATEGORY },
              { label: "CCC — Family", key: "ccc" as keyof SkuState, options: SEGMENT_CCC_FAMILY },
              { label: "DDD — Part Type", key: "ddd" as keyof SkuState, options: SEGMENT_DDD_TYPE },
              { label: "EE — Size/Variant", key: "ee" as keyof SkuState, options: SEGMENT_EE_SIZE, placeholder: "Optional…" },
              { label: "FF — Color/Finish", key: "ff" as keyof SkuState, options: SEGMENT_FF_COLOR, placeholder: "Optional…" },
            ].map((f) => (
              <Grid item xs={6} sm={4} lg={2} key={f.key}>
                <SelectField label={f.label} value={sku[f.key]} onChange={set(f.key)} options={f.options} placeholder={f.placeholder} />
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box sx={{ px: 3, pb: 3 }}>
          <Button variant="contained" fullWidth disabled={!isReady} onClick={handleAddRow} startIcon={<AddIcon />}
            sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#404040" }, "&.Mui-disabled": { bgcolor: "#d4d4d4", color: "white" }, py: 1.25, fontSize: "0.875rem" }}>
            Add Row to Table
          </Button>
        </Box>
      </Paper>

      {/* Rows */}
      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 3, py: 2, borderBottom: "1px solid #f5f5f5" }}>
          <Typography variant="body2" fontWeight={600}>SKU Rows</Typography>
          <Button variant="outlined" size="small" disabled={rows.length === 0} onClick={handleCopyAll}
            startIcon={<CopyIcon sx={{ fontSize: "0.85rem !important" }} />}
            sx={{ fontSize: "0.7rem", color: "text.secondary", borderColor: "#e5e5e5", "&:hover": { borderColor: "#a3a3a3" }, "&.Mui-disabled": { opacity: 0.4 } }}>
            Copy All Rows
          </Button>
        </Box>

        {rows.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, color: "text.secondary" }}>
            <CalendarIcon sx={{ fontSize: 40, mb: 1.5, opacity: 0.4 }} />
            <Typography variant="body2">No SKUs yet. Build one above and click Add Row.</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5" } }}>
                {["#", "Part Number (SKU)", "Description", ""].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", py: 1.25 }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} sx={{ "&:hover": { bgcolor: "#fafafa" }, "& td": { borderBottom: "1px solid #fafafa" } }}>
                  <TableCell sx={{ color: "text.secondary", fontSize: "0.78rem", width: 40 }}>{i + 1}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.8rem" }}>{row.sku}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontSize: "0.78rem", color: "text.secondary" }}>{row.description || "—"}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => setRows((prev) => prev.filter((_, j) => j !== i))}
                      sx={{ minWidth: 0, color: "#d4d4d4", "&:hover": { color: "#ef4444" } }}>
                      <DeleteIcon sx={{ fontSize: 16 }} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
