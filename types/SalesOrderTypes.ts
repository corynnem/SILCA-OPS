export interface ItemRef {
    refName: string;
    sku: string;
    id?: string;
  }
  
  export interface Items {
    item: ItemRef;
    quantity: number;
    line?: number;
  }
  
  export interface ItemList {
    items: Items[];
  }
  
  export interface SalesOrders {
    id: string;
    tranid: string;
    otherrefnum: string;
    item: ItemList;
    status?: string;
    createdDate?: string;
  }
  