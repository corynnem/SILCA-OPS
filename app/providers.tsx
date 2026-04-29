"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { silcaTheme } from "@/theme";
import { DataGridProvider } from "@/context/DataGridContext";
import Navigation from "@/components/Navigation/Navigation";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={silcaTheme}>
      <CssBaseline />
      <DataGridProvider>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
          <Navigation />
          <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 5 }}>
            {children}
          </Box>
        </Box>
      </DataGridProvider>
    </ThemeProvider>
  );
}
