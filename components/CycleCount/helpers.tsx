import { products } from "@/data/mockData";

  
  
  export const findItemByUPC = (gtin: number): { sku: string; name: string } | null => {
    const match = products.find((product) => product.GTIN === gtin);
    console.log(match)
    if (!match) return null;
    return { sku: match.SKU, name: match["Product Description"] ?? match.SKU };
  };
  
  
  export const searchForItem = (inputValue: string): { sku: string; name: string } | null => {
    const match = products.find((product) => product["Product Description"] && product["Product Description"].includes(inputValue));
    console.log(match)
    if (!match) return null;
    return { sku: match.SKU, name: match["Product Description"] ?? match.SKU };
  }
  