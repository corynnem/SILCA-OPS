import { createTheme } from "@mui/material/styles";

export const silcaTheme = createTheme({
  palette: {
    background: { default: "#f0ede8" },
    text: { primary: "#171717", secondary: "#737373" },
    primary: { main: "#171717" },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
  components: {
    MuiPaper: {
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 600 } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 12 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "0.02em",
          borderBottom: "1px solid #f5f5f5",
          paddingBottom: 12,
        },
      },
    },
  },
});
