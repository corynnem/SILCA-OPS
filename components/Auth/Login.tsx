"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { useSnackbar } from "@/context/SnackbarContext";
import { useAuth } from "@/lib/graphql/hooks";
import { useLoggedIn } from "@/context/LoggedInContext";

export default function Login() {
  const { login } = useAuth();
  const { setUser } = useLoggedIn()
  const router = useRouter();
  const { success, error } = useSnackbar();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      const payload = await login(email, password);

      if(payload) {
        setUser(payload?.user)
        success({ message: `Welcome, ${payload?.user.name}` });
        router.push("/pick-and-pack");
      }
    } catch (err) {
      error({
        message: "Login failed",
        description:
          err instanceof Error ? err.message : "Invalid email or password",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "90vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 380 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: "1.1rem",
              letterSpacing: "0.2em",
              color: "text.primary",
              mb: 0.75,
            }}
          >
            SILCA
          </Typography>
          <Typography
            sx={{
              fontSize: "0.7rem",
              letterSpacing: "0.15em",
              color: "text.secondary",
              fontWeight: 600,
            }}
          >
            OPERATIONS SUITE
          </Typography>
        </Box>

        {/* Card */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            border: "1px solid #e5e5e5",
            p: 4,
          }}
        >
          <Typography
            sx={{
              fontSize: "0.95rem",
              fontWeight: 700,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Sign in
          </Typography>
          <Typography
            sx={{ fontSize: "0.78rem", color: "text.secondary", mb: 3 }}
          >
            Enter your credentials to continue
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "text.secondary",
                  mb: 0.75,
                }}
              >
                EMAIL
              </Typography>
              <TextField
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@silca.cc"
                autoComplete="email"
                autoFocus
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: "0.85rem",
                    bgcolor: "#fafafa",
                    "& fieldset": { borderColor: "#e5e5e5" },
                    "&:hover fieldset": { borderColor: "#a3a3a3" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#171717",
                      borderWidth: 1.5,
                    },
                  },
                }}
              />
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "text.secondary",
                  mb: 0.75,
                }}
              >
                PASSWORD
              </Typography>
              <TextField
                fullWidth
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1.5,
                    fontSize: "0.85rem",
                    bgcolor: "#fafafa",
                    "& fieldset": { borderColor: "#e5e5e5" },
                    "&:hover fieldset": { borderColor: "#a3a3a3" },
                    "&.Mui-focused fieldset": {
                      borderColor: "#171717",
                      borderWidth: 1.5,
                    },
                  },
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !email || !password}
              sx={{
                mt: 1,
                bgcolor: "#171717",
                color: "white",
                borderRadius: 1.5,
                py: 1.1,
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                boxShadow: "none",
                "&:hover": { bgcolor: "#262626", boxShadow: "none" },
                "&:disabled": { bgcolor: "#e5e5e5", color: "#a3a3a3" },
              }}
            >
              {loading ? (
                <CircularProgress size={16} sx={{ color: "white" }} />
              ) : (
                "Sign in"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}