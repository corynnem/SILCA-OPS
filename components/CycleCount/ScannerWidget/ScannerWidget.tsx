"use client";

import { Box, Typography, Paper, Stack, Chip, Divider } from "@mui/material";
import {
  QrCodeScanner as ScannerIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  DeleteSweep as ClearIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  BugReport as BugIcon,
  CheckCircle as CheckIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

const ScannerWidget = ({
  lastBarcode,
  flashState,
  totalScans,
  uniqueItems,
  isFocused,
  onBoxClick,
  inputRef,
  onKeyDown,
}: {
  lastBarcode: string;
  flashState: "idle" | "success" | "error";
  totalScans: number;
  uniqueItems: number;
  isFocused: boolean;
  onBoxClick: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) => {
  const borderColor =
    flashState === "success"
      ? "#bbf7d0"
      : flashState === "error"
      ? "#fecaca"
      : isFocused
      ? "#a3a3a3"
      : "#f5f5f5";
  const bgColor =
    flashState === "success"
      ? "#f0fdf4"
      : flashState === "error"
      ? "#fff5f5"
      : "#fafafa";
  const iconColor =
    flashState === "success"
      ? "#16a34a"
      : flashState === "error"
      ? "#dc2626"
      : isFocused
      ? "#525252"
      : "#a3a3a3";

  return (
    <Paper
      variant="outlined"
      onClick={onBoxClick}
      sx={{
        borderRadius: 2,
        borderColor,
        bgcolor: bgColor,
        transition: "all 0.25s",
        overflow: "hidden",
        cursor: "text",
      }}
    >
      {/* Hidden input — always mounted, captures all barcode keystrokes when focused */}
      <input
        ref={inputRef}
        onKeyDown={onKeyDown}
        onChange={() => {}} // controlled by onKeyDown clearing value directly
        style={{
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          width: 1,
          height: 1,
        }}
        autoComplete="off"
        aria-label="barcode scanner input"
      />

      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 3 }}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2,
            flexShrink: 0,
            transition: "all 0.25s",
            bgcolor:
              flashState === "success"
                ? "#dcfce7"
                : flashState === "error"
                ? "#fee2e2"
                : "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {flashState === "success" ? (
            <CheckIcon sx={{ fontSize: 26, color: "#16a34a" }} />
          ) : flashState === "error" ? (
            <WarningIcon sx={{ fontSize: 26, color: "#dc2626" }} />
          ) : (
            <ScannerIcon sx={{ fontSize: 26, color: iconColor }} />
          )}
        </Box>

        <Box sx={{ flex: 1 }}>
          <Typography
            sx={{
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: iconColor,
              transition: "color 0.25s",
            }}
          >
            {flashState === "success"
              ? "Item Scanned"
              : flashState === "error"
              ? "Not Recognized"
              : isFocused
              ? "Scanner Active — Ready to Scan"
              : "Click to Activate Scanner"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "monospace",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "text.primary",
              mt: 0.25,
              minHeight: 22,
            }}
          >
            {lastBarcode ||
              (isFocused ? "Waiting for scan…" : "Scanner inactive")}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} sx={{ flexShrink: 0 }}>
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              {totalScans}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.secondary",
                mt: 0.25,
              }}
            >
              Total Scans
            </Typography>
          </Box>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: "#f5f5f5" }}
          />
          <Box sx={{ textAlign: "center" }}>
            <Typography
              sx={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "text.primary",
                lineHeight: 1,
              }}
            >
              {uniqueItems}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.6rem",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "text.secondary",
                mt: 0.25,
              }}
            >
              Unique SKUs
            </Typography>
          </Box>
        </Stack>

        {!isFocused && (
          <Chip
            label="Click to focus"
            size="small"
            sx={{
              bgcolor: "#f5f5f5",
              color: "text.secondary",
              fontSize: "0.65rem",
            }}
          />
        )}
      </Box>
    </Paper>
  );
}

export default ScannerWidget