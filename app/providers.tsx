"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import { silcaTheme } from "@/theme";
import { DataGridProvider } from "@/context/DataGridContext";
import { SnackbarProvider } from "@/context/SnackbarContext";
import CheckIsLoggedIn from "./checkIsLoggedIn";
import { LoggedInProvider } from "@/context/LoggedInContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={silcaTheme}>
      <CssBaseline />
      <LoggedInProvider>
        <DataGridProvider>
          <SnackbarProvider>
            <CheckIsLoggedIn>
              {children}
            </CheckIsLoggedIn>
          </SnackbarProvider>
        </DataGridProvider>
      </LoggedInProvider>
    </ThemeProvider>
  );
}
