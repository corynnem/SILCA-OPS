"use client";
 
import { useRouter } from "next/navigation";
import { IconButton, Tooltip, Typography } from "@mui/material";
import { Logout as LogoutIcon } from "@mui/icons-material";
import { useAuth } from "@/lib/graphql/hooks";
import { useSnackbar } from "@/context/SnackbarContext";
import { useLoggedIn } from "@/context/LoggedInContext";

interface LogoutButtonProps {
  /** Pass "nav" for the dark AppBar, "drawer" for the dark Drawer. Defaults to "nav". */
  variant?: "nav" | "drawer";
}
 
export default function LogoutButton({ variant = "nav" }: LogoutButtonProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const { success } = useSnackbar();
  const { clearLoggedInUser } = useLoggedIn()

  const handleLogout = () => {
    logout();
    clearLoggedInUser()
    success({ message: "Signed out" });
    router.push('/login')
  };

  return (
    <Tooltip title="Sign out" placement="bottom">
      <IconButton
        size="small"
        onClick={handleLogout}
        sx={{
          color: variant === "nav" ? "#525252" : "#737373",
          "&:hover": { color: variant === "nav" ? "white" : "white" },
          transition: "color 0.15s",
        }}
      >
        <Typography
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "70px",
            color: "#525252",
            fontSize: ".7rem",
            fontWeight: 600,
            letterSpacing: "0.1em",
            "&:hover": { color: "#a3a3a3" },
            transition: "color 0.15s",
            whiteSpace: "nowrap",
          }}
        >
          LOGOUT <LogoutIcon sx={{ fontSize: 15, ml: 1 }} />
        </Typography>
      </IconButton>
    </Tooltip>
  );
}