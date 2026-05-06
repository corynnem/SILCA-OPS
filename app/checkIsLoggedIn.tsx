"use client";
 
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Navigation from "@/components/Navigation/Navigation";
import { useLoggedIn } from "@/context/LoggedInContext";
import { usePathname, useRouter } from "next/navigation";
 
const CheckIsLoggedIn = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, hydrating } = useLoggedIn();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Wait until localStorage has been read before making any redirect decision
    if (hydrating) return;

    if (isLoggedIn && pathname === "/login") {
      router.replace("/pick-and-pack");
      return;
    }

    if (!isLoggedIn && pathname !== "/login") {
      router.replace("/login");
    }
  }, [hydrating, isLoggedIn, pathname, router]);

  // Don't flash the wrong page while we're reading localStorage
  if (hydrating) return null;

  return (
    <Box sx={{ bgcolor: "background.default" }}>
      <Navigation />
      <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 5 }}>{children}</Box>
    </Box>
  );
};
 
export default CheckIsLoggedIn;
 



