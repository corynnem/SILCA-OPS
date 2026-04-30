"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Autocomplete,
} from "@mui/material";
import {
  Add as AddIcon,
} from "@mui/icons-material";
import { REASONS } from "@/data/inventoryData";
import SectionLabel from "../SectionLabel/SectionLabel";
import { HandleAddProps } from "../helpers";
import { AdjustmentRow } from "@/types/AdjustmentTypes";
import { products, Product } from "@/data/mockData";

export interface Form {
    id?: string
    sku: string
    description: string
    quantity: number
    dateRequested: string
    reason: string
}

export interface NewRowProps {
  setForm: React.Dispatch<React.SetStateAction<Form>>;
  form: Form;
  handleAdd: (args: HandleAddProps) => void;
  setRows: React.Dispatch<React.SetStateAction<AdjustmentRow[]>>;
  setCopied: (arg: boolean) => void
  selectedProduct: Product;
}

const NewRow = ({ setForm, form, handleAdd, setRows, selectedProduct }: NewRowProps) => {
  const canAdd = form.sku && form.reason;
  return (
    <Box>
      {/* Form Card */}
      <Paper
        variant="outlined"
        sx={{ mt: 3, borderRadius: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 3,
            py: 2,
            borderBottom: "1px solid #f5f5f5",
            bgcolor: "#fafafa",
          }}
        >
          <SectionLabel>New Row</SectionLabel>
        </Box>
        <Box sx={{ px: 3, py: 2.5 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                lg: "2fr 2fr 100px 160px 1fr",
              },
              gap: 2,
            }}
          >
            {/* Part Number */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                Part Number
              </Typography>
              <Autocomplete
                size="small"
                options={products}
                getOptionKey={(option) => option.GTIN}
                getOptionLabel={(option) => option["SKU"]}
                value={
                  products.find((product) => product["SKU"] === form.sku) ??
                  null
                }
                onChange={(_, inputValue) => {
                  const sku = inputValue?.SKU;
                  const productName = inputValue?.["Product Description"];
                  setForm((form: Form) => ({
                    ...form,
                    sku: sku ?? "",
                    description: productName ?? "",
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search SKU…" />
                )}
                renderOption={(props, option) => {
                  const sku = option?.SKU;
                  const productName = option?.["Product Description"];
                  return (
                    <Box
                      component="li"
                      {...props}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start !important",
                        py: "8px !important",
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "monospace",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                        }}
                      >
                        {sku}
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.7rem", color: "text.secondary" }}
                      >
                        {productName}
                      </Typography>
                    </Box>
                  );
                }}
                sx={{
                  "& input": { fontFamily: "monospace", fontSize: "0.8rem" },
                }}
              />
            </Box>

            {/* Description */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                Description
              </Typography>
              <Autocomplete
                size="small"
                options={products}
                getOptionKey={(option) => option.GTIN}
                getOptionLabel={(option) => option["Product Description"] || ""}
                value={
                  products.find(
                    (product) =>
                      product["Product Description"] === form.description
                  ) ?? null
                }
                onChange={(_, inputValue) => {
                  const sku = inputValue?.SKU;
                  const productName = inputValue?.["Product Description"];

                  setForm((form) => ({
                    ...form,
                    description: productName ?? "",
                    sku: sku ?? form.sku,
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Search product name…" />
                )}
                sx={{ "& input": { fontSize: "0.8rem" } }}
              />
            </Box>

            {/* Quantity */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                Inventory +/-
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm((f) => ({ ...f, quantity: Number(e.target.value) }))
                }
                sx={{
                  "& input": {
                    fontFamily: "monospace",
                    fontSize: "0.8rem",
                    textAlign: "center",
                  },
                }}
              />
            </Box>

            {/* Date */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                Date Requested
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={form.dateRequested}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dateRequested: e.target.value }))
                }
                sx={{ "& input": { fontSize: "0.8rem" } }}
              />
            </Box>

            {/* Reason */}
            <Box>
              <Typography
                sx={{
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "text.secondary",
                  mb: 0.5,
                }}
              >
                Reason
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={form.reason}
                  onChange={(e) =>
                    setForm((form) => ({ ...form, reason: e.target.value }))
                  }
                  displayEmpty
                  sx={{ fontSize: "0.8rem" }}
                >
                  <MenuItem value="">
                    <em style={{ color: "#a3a3a3" }}>Select reason…</em>
                  </MenuItem>
                  {REASONS.map((r, i) => (
                    <MenuItem key={i} value={r} sx={{ fontSize: "0.8rem" }}>
                      {r}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>

          <Button
            variant="contained"
            fullWidth
            disabled={!canAdd}
            onClick={() => {
              handleAdd({ form, selectedProduct, setRows, setForm });
            }}
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
    </Box>
  );
};

export default NewRow;
