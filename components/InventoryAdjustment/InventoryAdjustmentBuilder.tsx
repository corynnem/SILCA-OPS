"use client";

import { useState, useMemo } from "react";
import {
  Box, Typography, Paper, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Table, TableBody, TableCell,
  TableHead, TableRow, Stack, Autocomplete, Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  CalendarMonth as CalendarIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { PRODUCTS, REASONS } from "@/data/inventoryData";
import { AdjustmentRow } from "@/types/AdjustmentTypes";

function todayDisplay() {
  return new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", mb: 1.5 }}>
      {children}
    </Typography>
  );
}

export default function InventoryAdjustmentBuilder() {
  const [rows, setRows] = useState<AdjustmentRow[]>([]);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    sku: "",
    description: "",
    quantity: 1,
    dateRequested: todayDisplay(),
    reason: "",
  });

  const selectedProduct = PRODUCTS.find((p) => p.sku === form.sku);

  const canAdd = form.sku && form.reason;

  const handleAdd = () => {
    if (!canAdd) return;
    const newRow: AdjustmentRow = {
      id: `${Date.now()}`,
      sku: form.sku,
      description: form.description || selectedProduct?.name || "",
      quantity: form.quantity,
      dateRequested: form.dateRequested,
      reason: form.reason,
    };
    setRows((prev) => [...prev, newRow]);
    setForm({ sku: "", description: "", quantity: 1, dateRequested: todayDisplay(), reason: "" });
  };

  const handleRemove = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleCopyAll = () => {
    const header = "Part Number\tDescription\tInventory +/-\tDate Requested\tReason";
    const body = rows.map((r) => `${r.sku}\t${r.description}\t${r.quantity}\t${r.dateRequested}\t${r.reason}`).join("\n");
    navigator.clipboard.writeText(`${header}\n${body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        Inventory Adjustment Builder
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Build rows for your adjustment spreadsheet. Click <strong>Copy All Rows</strong> to copy tab-separated values — paste directly into Excel.
      </Typography>

      {/* Form Card */}
      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5", bgcolor: "#fafafa" }}>
          <SectionLabel>New Row</SectionLabel>
        </Box>
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "2fr 2fr 100px 160px 1fr" }, gap: 2 }}>
            {/* Part Number */}
            <Box>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                Part Number
              </Typography>
              <Autocomplete
                size="small"
                options={PRODUCTS}
                getOptionLabel={(o) => o.sku}
                value={PRODUCTS.find((p) => p.sku === form.sku) ?? null}
                onChange={(_, v) => setForm((f) => ({ ...f, sku: v?.sku ?? "", description: v?.name ?? "" }))}
                renderInput={(params) => <TextField {...params} placeholder="Search SKU…" />}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start !important", py: "8px !important" }}>
                    <Typography sx={{ fontFamily: "monospace", fontSize: "0.75rem", fontWeight: 600 }}>{option.sku}</Typography>
                    <Typography sx={{ fontSize: "0.7rem", color: "text.secondary" }}>{option.name}</Typography>
                  </Box>
                )}
                sx={{ "& input": { fontFamily: "monospace", fontSize: "0.8rem" } }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                Description
              </Typography>
              <Autocomplete
                size="small"
                options={PRODUCTS}
                getOptionLabel={(o) => o.name}
                value={PRODUCTS.find((p) => p.name === form.description) ?? null}
                onChange={(_, v) => setForm((f) => ({ ...f, description: v?.name ?? "", sku: v?.sku ?? f.sku }))}
                renderInput={(params) => <TextField {...params} placeholder="Search product name…" />}
                sx={{ "& input": { fontSize: "0.8rem" } }}
              />
            </Box>

            {/* Quantity */}
            <Box>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                Inventory +/-
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={form.quantity}
                onChange={(e) => setForm((f) => ({ ...f, quantity: Number(e.target.value) }))}
                sx={{ "& input": { fontFamily: "monospace", fontSize: "0.8rem", textAlign: "center" } }}
              />
            </Box>

            {/* Date */}
            <Box>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                Date Requested
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.dateRequested}
                onChange={(e) => setForm((f) => ({ ...f, dateRequested: e.target.value }))}
                sx={{ "& input": { fontSize: "0.8rem" } }}
              />
            </Box>

            {/* Reason */}
            <Box>
              <Typography sx={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "text.secondary", mb: 0.5 }}>
                Reason
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={form.reason}
                  onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                  displayEmpty
                  sx={{ fontSize: "0.8rem" }}
                >
                  <MenuItem value=""><em style={{ color: "#a3a3a3" }}>Select reason…</em></MenuItem>
                  {REASONS.map((r) => (
                    <MenuItem key={r} value={r} sx={{ fontSize: "0.8rem" }}>{r}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={!canAdd}
            onClick={handleAdd}
            startIcon={<AddIcon />}
            sx={{
              mt: 2.5,
              bgcolor: "#171717",
              "&:hover": { bgcolor: "#404040" },
              "&.Mui-disabled": { bgcolor: "#d4d4d4", color: "white" },
              py: 1.25,
              fontSize: "0.875rem",
            }}
          >
            Add Row to Table
          </Button>
        </Box>
      </Paper>

      {/* Rows Table */}
      <Paper variant="outlined" sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="body2" fontWeight={600}>Adjustment Rows</Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={rows.length === 0}
            onClick={handleCopyAll}
            startIcon={copied ? <CheckIcon sx={{ fontSize: "0.85rem !important", color: "#16a34a" }} /> : <CopyIcon sx={{ fontSize: "0.85rem !important" }} />}
            sx={{
              fontSize: "0.7rem",
              color: copied ? "#16a34a" : "text.secondary",
              borderColor: "#e5e5e5",
              "&:hover": { borderColor: "#a3a3a3" },
              "&.Mui-disabled": { opacity: 0.4 },
            }}
          >
            {copied ? "Copied!" : "Copy All Rows"}
          </Button>
        </Box>

        {rows.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 8, color: "text.secondary" }}>
            <CalendarIcon sx={{ fontSize: 40, mb: 1.5, opacity: 0.4 }} />
            <Typography variant="body2">No rows yet. Fill in the form above and click Add Row.</Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5" } }}>
                {["#", "Part Number", "Description", "Qty", "Date Requested", "Reason", ""].map((h) => (
                  <TableCell key={h} sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "text.secondary", py: 1.25 }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={row.id} sx={{ "&:hover": { bgcolor: "#fafafa" }, "& td": { borderBottom: "1px solid #fafafa" } }}>
                  <TableCell sx={{ color: "text.secondary", fontSize: "0.75rem", width: 36 }}>{i + 1}</TableCell>
                  <TableCell sx={{ fontFamily: "monospace", fontWeight: 700, fontSize: "0.78rem" }}>{row.sku}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem", color: "text.secondary" }}>{row.description}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.quantity > 0 ? `+${row.quantity}` : row.quantity}
                      size="small"
                      sx={{
                        bgcolor: row.quantity > 0 ? "#dcfce7" : "#fee2e2",
                        color: row.quantity > 0 ? "#16a34a" : "#dc2626",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        fontFamily: "monospace",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontSize: "0.78rem" }}>{row.dateRequested}</TableCell>
                  <TableCell sx={{ fontSize: "0.78rem", color: "text.secondary" }}>{row.reason}</TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => handleRemove(row.id)} sx={{ minWidth: 0, color: "#d4d4d4", "&:hover": { color: "#ef4444" } }}>
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
