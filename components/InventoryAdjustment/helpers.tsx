import { Form } from "./NewRow/NewRow";
import { AdjustmentRow } from "@/types/AdjustmentTypes";

export interface HandleAddProps {
    form: Form;
    selectedProduct: any;
    setRows: React.Dispatch<React.SetStateAction<AdjustmentRow[]>>;
    setForm: (arg: Form) => void 
}

export interface HandleRemoveProps {
    id: string,
    setRows: React.Dispatch<React.SetStateAction<AdjustmentRow[]>>;
}

export interface HandleCopyAllProps {
    setCopied: (arg: boolean) => void;
    rows: AdjustmentRow[];
}

export const todayDisplay = () => {
  return new Date().toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
};

export const handleAdd = ({
  form,
  selectedProduct,
  setRows,
  setForm,
}: HandleAddProps) => {
  const canAdd = form.sku && form.reason;
  if (!canAdd) return;
  const newRow: AdjustmentRow = {
    id: `${Date.now()}`,
    sku: form.sku,
    description: form.description || selectedProduct?.name || "",
    quantity: form.quantity,
    dateRequested: form.dateRequested,
    reason: form.reason,
  };
  setRows((prev: AdjustmentRow[]) => [...prev, newRow]);
  setForm({
    sku: "",
    description: "",
    quantity: 1,
    dateRequested: todayDisplay(),
    reason: "",
  });
};

export const handleRemove = ({ id, setRows }: HandleRemoveProps) =>
  setRows((prev: AdjustmentRow[]) => prev.filter((row) => row.id !== id));

export const handleCopyAll = ({setCopied, rows}: HandleCopyAllProps) => {
  const header =
    "Part Number\tDescription\tInventory +/-\tDate Requested\tReason";
  const body = rows
    .map(
      (r) =>
        `${r.sku}\t${r.description}\t${r.quantity}\t${r.dateRequested}\t${r.reason}`
    )
    .join("\n");
  navigator.clipboard.writeText(`${header}\n${body}`);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

