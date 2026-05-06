"use client";
 
import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Snackbar, Alert, AlertColor, Typography } from "@mui/material";
 
// ─── Types ────────────────────────────────────────────────────────────────────
 
interface SnackbarOptions {
  message: string;
  description?: string;
  duration?: number; // ms, defaults to 4000
}
 
interface SnackbarContextValue {
  success: (opts: SnackbarOptions) => void;
  warning: (opts: SnackbarOptions) => void;
  error: (opts: SnackbarOptions) => void;
}
 
interface SnackbarState {
  open: boolean;
  message: string;
  description?: string;
  severity: AlertColor;
  duration: number;
}
 
// ─── Context ──────────────────────────────────────────────────────────────────
 
const SnackbarContext = createContext<SnackbarContextValue | null>(null);
 
// ─── Provider ─────────────────────────────────────────────────────────────────
 
export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SnackbarState>({
    open: false,
    message: "",
    severity: "success",
    duration: 4000,
  });
 
  const show = useCallback(
    (severity: AlertColor, opts: SnackbarOptions) => {
      setState({
        open: true,
        message: opts.message,
        description: opts.description,
        severity,
        duration: opts.duration ?? 4000,
      });
    },
    []
  );
 
  const success = useCallback(
    (opts: SnackbarOptions) => show("success", opts),
    [show]
  );
  const warning = useCallback(
    (opts: SnackbarOptions) => show("warning", opts),
    [show]
  );
  const error = useCallback(
    (opts: SnackbarOptions) => show("error", opts),
    [show]
  );
 
  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setState((s) => ({ ...s, open: false }));
  };
 
  const SEVERITY_STYLES: Record<AlertColor, { bg: string; color: string; border: string }> = {
    success: { bg: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
    warning: { bg: "#fffbeb", color: "#b45309", border: "#fde68a" },
    error:   { bg: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
    info:    { bg: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  };
 
  const styles = SEVERITY_STYLES[state.severity];
 
  return (
    <SnackbarContext.Provider value={{ success, warning, error }}>
      {children}
      <Snackbar
        open={state.open}
        autoHideDuration={state.duration}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={state.severity}
          variant="outlined"
          sx={{
            bgcolor: styles.bg,
            borderColor: styles.border,
            color: styles.color,
            borderRadius: 2,
            fontSize: "0.8rem",
            fontWeight: 600,
            "& .MuiAlert-icon": { color: styles.color },
            "& .MuiAlert-action": { color: styles.color, opacity: 0.6 },
          }}
        >
          {state.message}
          {state.description && (
            <Typography
              component="span"
              sx={{
                display: "block",
                fontSize: "0.72rem",
                fontWeight: 400,
                opacity: 0.8,
                mt: 0.25,
              }}
            >
              {state.description}
            </Typography>
          )}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}
 
// ─── Hook ─────────────────────────────────────────────────────────────────────
 
export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error("useSnackbar must be used inside <SnackbarProvider>");
  }
  return ctx;
}
 