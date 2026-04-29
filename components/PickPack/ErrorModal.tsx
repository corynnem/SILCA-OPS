"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import { Warning as WarningIcon } from "@mui/icons-material";
import { useContext } from "react";
import { DataGridContext } from "@/context/DataGridContext";

const ErrorModal = () => {
  const { errorModalText, errorModalOpen, setErrorModalOpen } = useContext(DataGridContext);
  const { title, subtext } = errorModalText;

  return (
    <Dialog open={errorModalOpen} onClose={() => setErrorModalOpen(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 28, height: 28, borderRadius: "50%", bgcolor: "#fef3c7", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <WarningIcon sx={{ fontSize: 16, color: "#d97706" }} />
        </Box>
        {title}
      </DialogTitle>
      <DialogContent sx={{ pt: "12px !important" }}>
        <Typography variant="body2" color="text.secondary">{subtext}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          variant="contained"
          onClick={() => setErrorModalOpen(false)}
          sx={{ bgcolor: "#171717", "&:hover": { bgcolor: "#404040" }, fontSize: "0.8rem" }}
        >
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ErrorModal;
