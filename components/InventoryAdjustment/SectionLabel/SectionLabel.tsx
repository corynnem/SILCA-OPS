import React from "react";
import { Typography } from "@mui/material";


const SectionLabel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "text.secondary", mb: 1.5 }}>
      {children}
    </Typography>
  );
}

export default SectionLabel