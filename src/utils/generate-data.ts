import { InventoryItem } from "../types";
import { v4 as uuidv4 } from 'uuid';

export function generateInventoryData(count: number): InventoryItem[] {
    const categories = ['Electronics', 'Furniture', 'Groceries', 'Clothing', 'Stationery'];
    const items: InventoryItem[] = [];
  
    for (let i = 0; i < count; i++) {
      const id = uuidv4();
      const category = categories[Math.floor(Math.random() * categories.length)];
      const name = `${category} Product ${i + 1}`;
      const price = parseFloat((Math.random() * 1000 + 10).toFixed(2));
      const quantityInStock = Math.floor(Math.random() * 100);
  
      items.push({
        id,
        name,
        category,
        price,
        quantityInStock,
      });
    }
  
    return items;
  }
  