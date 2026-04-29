"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
  QrCodeScanner as ScannerIcon,
  Upload as UploadIcon,
  Build as BuildIcon,
  ChevronRight as ChevronRightIcon,
  AssignmentTurnedIn as CycleIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    label: "Pick & Pack",
    href: "/pick-and-pack",
    icon: <ScannerIcon sx={{ fontSize: 18 }} />,
    description: "Scan and fulfill sales orders",
  },
  {
    label: "Cycle Count",
    href: "/cycle-count",
    icon: <CycleIcon sx={{ fontSize: 18 }} />,
    description: "Scan items and track inventory counts",
  },
  {
    label: "Inventory Adjustment",
    href: "/inventory-adjustment",
    icon: <InventoryIcon sx={{ fontSize: 18 }} />,
    description: "Log manual inventory changes",
  },
  {
    label: "Bulk Inventory Adjustment",
    href: "/bulk-adjustment",
    icon: <UploadIcon sx={{ fontSize: 18 }} />,
    description: "Upload & generate NetSuite CSV",
  },
  {
    label: "SKU Builder",
    href: "/sku-builder",
    icon: <BuildIcon sx={{ fontSize: 18 }} />,
    description: "Build SILCA part numbers",
  },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = NAV_ITEMS.find((item) => item.href === pathname);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#171717", boxShadow: "none" }}>
        <Toolbar variant="dense" sx={{ minHeight: 44, gap: 2, px: 2 }}>
          {/* Hamburger */}
          <IconButton
            size="small"
            onClick={() => setOpen(true)}
            sx={{ color: "#a3a3a3", "&:hover": { color: "white" }, mr: 0.5 }}
          >
            <MenuIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Logo */}
          <Typography
            sx={{
              color: "white",
              fontWeight: 700,
              fontSize: "0.75rem",
              letterSpacing: "0.15em",
              flexShrink: 0,
            }}
          >
            SILCA
          </Typography>

          {/* Breadcrumb dots */}
          {currentPage && (
            <>
              <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#525252", flexShrink: 0 }} />
              <Chip
                label={currentPage.label.toUpperCase()}
                size="small"
                sx={{
                  bgcolor: "#404040",
                  color: "white",
                  fontSize: "0.65rem",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  height: 22,
                  flexShrink: 0,
                }}
              />
            </>
          )}

          {/* Faded other pages */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2, ml: 1 }}>
            {NAV_ITEMS.filter((item) => item.href !== pathname).map((item, i) => (
              <Box key={item.href} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#404040" }} />
                <Link href={item.href} style={{ textDecoration: "none" }}>
                  <Typography
                    sx={{
                      color: "#525252",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.1em",
                      "&:hover": { color: "#a3a3a3" },
                      transition: "color 0.15s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.label.toUpperCase()}
                  </Typography>
                </Link>
              </Box>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            bgcolor: "#171717",
            color: "white",
          },
        }}
      >
        {/* Drawer Header */}
        <Box sx={{ px: 3, py: 2.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.2em", color: "white" }}>
            SILCA OPS
          </Typography>
          <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#737373", "&:hover": { color: "white" } }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: "#262626" }} />

        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography sx={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: "#525252", px: 1, mb: 1 }}>
            MODULES
          </Typography>
          <List disablePadding>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <ListItem key={item.href} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    component={Link}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    sx={{
                      borderRadius: 1.5,
                      py: 1.25,
                      px: 1.5,
                      bgcolor: isActive ? "#262626" : "transparent",
                      "&:hover": { bgcolor: "#262626" },
                      transition: "background 0.15s",
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 32, color: isActive ? "white" : "#737373" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      secondary={item.description}
                      primaryTypographyProps={{
                        fontSize: "0.8rem",
                        fontWeight: isActive ? 700 : 500,
                        color: isActive ? "white" : "#a3a3a3",
                        letterSpacing: "0.02em",
                      }}
                      secondaryTypographyProps={{
                        fontSize: "0.65rem",
                        color: "#525252",
                        mt: 0.25,
                      }}
                    />
                    {isActive && <ChevronRightIcon sx={{ fontSize: 14, color: "#525252" }} />}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box sx={{ mt: "auto", px: 3, py: 2.5, borderTop: "1px solid #262626" }}>
          <Typography sx={{ fontSize: "0.6rem", color: "#404040", letterSpacing: "0.1em" }}>
            SILCA OPERATIONS SUITE
          </Typography>
        </Box>
      </Drawer>
    </>
  );
}
