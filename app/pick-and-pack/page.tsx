"use client"

import { Box } from "@mui/material";
import PickDataGrid from "@/components/PickPack/PickDataGrid";
import { useLoggedIn } from "@/context/LoggedInContext";

export default function PickAndPackPage() {

  return (
    <Box>
      <PickDataGrid />
    </Box>
  );
}
