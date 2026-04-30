"use client";

import { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  ContentCopy as CopyIcon,
  Check as CheckIcon,
  CalendarMonth as CalendarIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { products, Product } from "@/data/mockData";
import { AdjustmentRow } from "@/types/AdjustmentTypes";
import NewRow, { Form } from "./NewRow/NewRow";
import { handleAdd, todayDisplay, handleCopyAll, handleRemove } from "./helpers";




export default function InventoryAdjustmentBuilder() {
  const [rows, setRows] = useState<AdjustmentRow[]>([]);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<Form>({
    sku: "",
    description: "",
    quantity: 1,
    dateRequested: todayDisplay(),
    reason: "",
  });

  const selectedProduct: Product = products.find((product: Product) => product["SKU"] === form.sku) || products[0]

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} color="text.primary">
        Inventory Adjustment Builder
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Build rows for your adjustment spreadsheet. Click{" "}
        <strong>Copy All Rows</strong> to copy tab-separated values — paste
        directly into Excel.
      </Typography>

      <NewRow
        setForm={setForm}
        form={form}
        handleAdd={handleAdd}
        setRows={setRows}
        setCopied={setCopied}
        selectedProduct={selectedProduct}
      />

      {/* Rows Table */}
      <Paper
        variant="outlined"
        sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="body2" fontWeight={600}>
            Adjustment Rows
          </Typography>
          <Button
            variant="outlined"
            size="small"
            disabled={rows.length === 0}
            onClick={() => handleCopyAll({ setCopied, rows })}
            startIcon={
              copied ? (
                <CheckIcon
                  sx={{ fontSize: "0.85rem !important", color: "#16a34a" }}
                />
              ) : (
                <CopyIcon sx={{ fontSize: "0.85rem !important" }} />
              )
            }
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              py: 8,
              color: "text.secondary",
            }}
          >
            <CalendarIcon sx={{ fontSize: 40, mb: 1.5, opacity: 0.4 }} />
            <Typography variant="body2">
              No rows yet. Fill in the form above and click Add Row.
            </Typography>
          </Box>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow sx={{ "& th": { borderBottom: "1px solid #f5f5f5" } }}>
                {[
                  "#",
                  "Part Number",
                  "Description",
                  "Qty",
                  "Date Requested",
                  "Reason",
                  "",
                ].map((h, i) => {
                  return(
                  <TableCell
                    key={i}
                    sx={{
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                      py: 1.25,
                    }}
                  >
                    {h}
                  </TableCell>
                )})}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow
                  key={'fjkdlsa;fjdksl;afjksl;'}
                  sx={{
                    "&:hover": { bgcolor: "#fafafa" },
                    "& td": { borderBottom: "1px solid #fafafa" },
                  }}
                >
                  <TableCell
                    sx={{
                      color: "text.secondary",
                      fontSize: "0.75rem",
                      width: 36,
                    }}
                  >
                    {i + 1}
                  </TableCell>
                  <TableCell
                    sx={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "0.78rem",
                    }}
                  >
                    {row.sku}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.78rem", color: "text.secondary" }}
                  >
                    {row.description}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={
                        row.quantity > 0 ? `+${row.quantity}` : row.quantity
                      }
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
                  <TableCell sx={{ fontSize: "0.78rem" }}>
                    {row.dateRequested}
                  </TableCell>
                  <TableCell
                    sx={{ fontSize: "0.78rem", color: "text.secondary" }}
                  >
                    {row.reason}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      size="small"
                      onClick={() => {
                        const { id } = row;
                        handleRemove({ id, setRows });
                      }}
                      sx={{
                        minWidth: 0,
                        color: "#d4d4d4",
                        "&:hover": { color: "#ef4444" },
                      }}
                    >
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
