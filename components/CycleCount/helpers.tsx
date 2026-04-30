import { upc_codes } from "@/data/mockData";

  
  
  export const findItemByUPC = (gtin: number): { sku: string; name: string } | null => {
    const match = upc_codes.find((product) => product.GTIN === gtin);
    console.log(match)
    if (!match) return null;
    return { sku: match.SKU, name: match["Product Description"] ?? match.SKU };
  };
  
  
  export const searchForItem = (inputValue: string): { sku: string; name: string } | null => {
    const match = upc_codes.find((product) => product["Product Description"].includes(inputValue));
    console.log(match)
    if (!match) return null;
    return { sku: match.SKU, name: match["Product Description"] ?? match.SKU };
  };

  export const MOCK_ITEMS = [
    { label: "Super Pista Ultimate", upc: "810093162987" },
    { label: "Tattico Bluetooth",    upc: "810093162642" },
    { label: "Impero Ultimate",      upc: "810093160938" },
    { label: "Eolo III",             upc: "850005186328" },
    { label: "Pista Corsa",          upc: "810093161001" },
    { label: "Cielo Tire",           upc: "810093161002" },
    { label: "Unknown UPC",          upc: "000000000000" },
  ];
  