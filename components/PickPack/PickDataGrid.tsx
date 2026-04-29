"use client";

import { useContext, useEffect } from "react";
import { Box, Typography, Paper, Chip, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import PickItemsModal from "./PickItemsModal";
import ErrorModal from "./ErrorModal";
import { DataGridContext } from "@/context/DataGridContext";
import { getDataGridRows } from "./helpers";
import { getSalesOrdersLocalStorage, postSalesOrdersLocalStorage } from "@/helpers";

export interface WarehouseGridRow {
  id: string;
  shopifyOrderNumber: string;
  salesOrderNumber: string;
  totalItems: number;
}

const columns: GridColDef<WarehouseGridRow>[] = [
  {
    field: "id",
    headerName: "",
    width: 80,
    sortable: false,
    renderCell: (params) => <PickItemsModal salesOrderNumber={params.row.salesOrderNumber} />,
  },
  {
    field: "shopifyOrderNumber",
    headerName: "Shopify Order #",
    flex: 1,
    minWidth: 140,
  },
  {
    field: "salesOrderNumber",
    headerName: "Sales Order #",
    flex: 1,
    minWidth: 150,
    renderCell: (params) => (
      <Typography sx={{ fontFamily: "monospace", fontSize: "0.8rem", fontWeight: 600 }}>
        {params.value}
      </Typography>
    ),
  },
  {
    field: "totalItems",
    headerName: "Total Items",
    width: 110,
    renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        sx={{ bgcolor: "#f5f5f5", fontSize: "0.7rem", fontWeight: 600, height: 20 }}
      />
    ),
  },
];

const PickDataGrid = () => {
  const { setSalesOrders, salesOrders } = useContext(DataGridContext);
  const { mockSalesOrders } = getSalesOrdersLocalStorage();

  useEffect(() => {
    if (!salesOrders || salesOrders.length === 0) {
      setSalesOrders(mockSalesOrders);
      postSalesOrdersLocalStorage(mockSalesOrders);
    }
  }, []);

  const rows = getDataGridRows(salesOrders?.length ? salesOrders : mockSalesOrders);

  return (
    <Box>
      <ErrorModal />
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, overflow: "hidden" }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #f5f5f5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box>
            <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary" }}>
              Open Orders
            </Typography>
            <Typography variant="body2" fontWeight={600} color="text.primary" sx={{ mt: 0.25 }}>
              Sales Orders Pending Pick
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Chip
              label={`${rows.length} orders`}
              size="small"
              sx={{ bgcolor: "#f5f5f5", fontSize: "0.7rem", fontWeight: 600 }}
            />
          </Stack>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          checkboxSelection
          disableRowSelectionOnClick
          sx={{
            border: 0,
            "& .MuiDataGrid-columnHeader": {
              bgcolor: "#fafafa",
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#737373",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.8rem",
              borderColor: "#fafafa",
            },
            "& .MuiDataGrid-row:hover": { bgcolor: "#fafafa" },
            "& .MuiDataGrid-footerContainer": { borderTop: "1px solid #f5f5f5" },
            "& .MuiCheckbox-root": { color: "#d4d4d4" },
            minHeight: 400,
          }}
        />
      </Paper>
    </Box>
  );
};

export default PickDataGrid;
