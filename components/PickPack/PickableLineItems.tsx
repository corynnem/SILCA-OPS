import { Box, Typography, LinearProgress } from "@mui/material";
import { CheckCircle as CheckCircleIcon, RadioButtonUnchecked as RadioButtonUncheckedIcon } from "@mui/icons-material";
import { Items } from "@/types/SalesOrderTypes";

interface PickableLineItemsProps {
  item: Items;
  scanCount: number;
  SONumber: string;
}

const PickableLineItems = ({ item: SOItem, scanCount }: PickableLineItemsProps) => {
  const { item, quantity } = SOItem;
  const { refName } = item;

  const leftToPick = quantity - scanCount;
  const quantityMet = scanCount === quantity;
  const inProgress = scanCount > 0 && !quantityMet;
  const progress = Math.min((scanCount / quantity) * 100, 100);

  return (
    <Box
      sx={{
        mt: 1,
        p: 1.5,
        borderRadius: 2,
        border: "1px solid",
        borderColor: quantityMet ? "#bbf7d0" : inProgress ? "#fde68a" : "#f5f5f5",
        bgcolor: quantityMet ? "#f0fdf4" : inProgress ? "#fffbeb" : "white",
        transition: "all 0.3s",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
        <Box sx={{ pt: 0.25, flexShrink: 0 }}>
          {quantityMet
            ? <CheckCircleIcon sx={{ fontSize: 18, color: "#16a34a" }} />
            : <RadioButtonUncheckedIcon sx={{ fontSize: 18, color: inProgress ? "#d97706" : "#d4d4d4" }} />
          }
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "text.primary",
              textDecoration: quantityMet ? "line-through" : "none",
              opacity: quantityMet ? 0.6 : 1,
            }}
          >
            {refName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                bgcolor: "#f5f5f5",
                "& .MuiLinearProgress-bar": {
                  bgcolor: quantityMet ? "#16a34a" : inProgress ? "#d97706" : "#d4d4d4",
                },
              }}
            />
            <Typography sx={{ fontSize: "0.7rem", fontWeight: 600, color: "text.secondary", flexShrink: 0 }}>
              {scanCount}/{quantity}
            </Typography>
          </Box>
          {!quantityMet && (
            <Typography sx={{ fontSize: "0.65rem", color: inProgress ? "#d97706" : "#a3a3a3", mt: 0.25 }}>
              {leftToPick} left to pick
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PickableLineItems;
