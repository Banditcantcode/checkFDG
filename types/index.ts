export interface Item {
  id: number;
  name: string;
  value: number;
  category?: string; 
  sellLocation?: string; // Where the item can be sold (pawnshop, car parts, etc.)
  sellable?: boolean; // Whether the item can be sold at all
}

export interface InventoryItem {
  name: string;
  quantity: number;
  value?: number; // Value per unit
  totalValue?: number; // Quantity * value
  sellLocation?: string; // Where the item can be sold
  sellable?: boolean; // Whether the item can be sold at all
}

export interface InventoryResult {
  items: InventoryItem[];
  totalValue: number;
} 