import fs from 'fs/promises';
import path from 'path';
import { Item, InventoryItem, InventoryResult } from '@/types';

// Path to our local database file
const DB_FILE_PATH = path.join(process.cwd(), 'data', 'db.json');

// Sample items to add to the database initially
const sampleItems: Item[] = [
  { id: 1, name: 'Cash', value: 1, sellLocation: 'Bank', sellable: true },
  { id: 2, name: 'Screwdriver', value: 50, sellLocation: 'Pawnshop', sellable: true },
  { id: 3, name: 'Lock Picking Tool', value: 150, sellLocation: 'Pawnshop', sellable: true },
  { id: 4, name: 'Phone 11', value: 500, sellLocation: 'Pawnshop', sellable: true },
  { id: 5, name: 'Pistol Mag (50Cal)', value: 120, sellLocation: 'Gun Store', sellable: true },
  { id: 6, name: 'Desert Eagle', value: 1000, sellLocation: 'Gun Store', sellable: true },
  { id: 7, name: 'NOS Feed Line', value: 250, sellLocation: 'Car Parts Shop', sellable: true },
  { id: 8, name: 'Carbon Fibre', value: 300, sellLocation: 'Car Parts Shop', sellable: true },
  { id: 9, name: 'Red Keycard', value: 0, sellable: false },
  { id: 10, name: 'Drivers License', value: 0, sellable: false }
];

// Initial database structure
const initialDb = {
  items: [] as Item[],
  lastId: 0
};

// Helper to ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readDb(): Promise<typeof initialDb> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DB_FILE_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    const dbWithSamples = {
      ...initialDb,
      items: [...sampleItems],
      lastId: sampleItems.length
    };
    await writeDb(dbWithSamples);
    return dbWithSamples;
  }
}

async function writeDb(data: typeof initialDb): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DB_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function initDatabase() {
  try {
    await readDb();
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export async function getItemByName(name: string): Promise<Item | null> {
  try {
    const db = await readDb();
    const exactMatch = db.items.find(item => 
      item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
    
    if (exactMatch) return exactMatch;
    
    const partialMatch = db.items.find(item => 
      item.name.toLowerCase().includes(name.toLowerCase().trim()) || 
      name.toLowerCase().trim().includes(item.name.toLowerCase())
    );
    
    return partialMatch || null;
  } catch (error) {
    console.error('Error getting item by name:', error);
    return null;
  }
}

export async function getAllItems(): Promise<Item[]> {
  try {
    const db = await readDb();
    return db.items;
  } catch (error) {
    console.error('Error getting all items:', error);
    return [];
  }
}

export async function addItem(
  name: string, 
  value: number, 
  sellLocation?: string, 
  sellable: boolean = true
): Promise<Item | null> {
  try {
    const db = await readDb();
    
    const existingItemIndex = db.items.findIndex(
      item => item.name.toLowerCase() === name.toLowerCase()
    );
    
    if (existingItemIndex !== -1) {
      return null;
    }
    
    const newId = db.lastId + 1;
    const newItem: Item = {
      id: newId,
      name,
      value,
      sellLocation,
      sellable
    };
    
    db.items.push(newItem);
    db.lastId = newId;
    
    await writeDb(db);
    return newItem;
  } catch (error) {
    console.error('Error adding item:', error);
    return null;
  }
}

export async function updateItem(
  id: number, 
  name: string, 
  value: number, 
  sellLocation?: string, 
  sellable?: boolean
): Promise<Item | null> {
  try {
    const db = await readDb();
    
    const itemIndex = db.items.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return null; // Item not found
    }
    
    const currentItem = db.items[itemIndex];
    
    db.items[itemIndex] = {
      id,
      name,
      value,
      sellLocation: sellLocation ?? currentItem.sellLocation,
      sellable: sellable ?? currentItem.sellable ?? true
    };
    
    await writeDb(db);
    return db.items[itemIndex];
  } catch (error) {
    console.error('Error updating item:', error);
    return null;
  }
}

export async function processInventory(inventoryText: string): Promise<InventoryResult> {
  try {
    const db = await readDb();
    
    const lines = inventoryText.trim().split('\n');
    const inventoryItems: InventoryItem[] = [];
    let totalValue = 0;

    for (const line of lines) {
      // Use a regex split to handle both tabs and multiple spaces | this shit was done with ai cause i fucking hate regex and i dont know how to actually do it properly
      const parts = line.split(/\t+|\s{2,}/).map(part => part.trim());
      
      if (parts.length === 1) {
        const text = parts[0];
        const lastSpaceIndex = text.lastIndexOf(' ');
        if (lastSpaceIndex > 0) {
          const itemName = text.substring(0, lastSpaceIndex).trim();
          const quantityStr = text.substring(lastSpaceIndex + 1).trim();
          const quantity = parseInt(quantityStr, 10);
          
          if (!isNaN(quantity)) {
            parts[0] = itemName;
            parts[1] = quantityStr;
          }
        }
      }
      
      if (parts.length < 2) continue;
      
      const name = parts[0];
      const quantity = parseInt(parts[1], 10);
      
      if (isNaN(quantity)) continue;
      
      let item = db.items.find(item => 
        item.name.toLowerCase().trim() === name.toLowerCase().trim()
      );
      
      if (!item) {
        item = db.items.find(item => 
          item.name.toLowerCase().includes(name.toLowerCase().trim()) || 
          name.toLowerCase().trim().includes(item.name.toLowerCase())
        );
      }
      
      if (item) {
        const itemTotalValue = item.value * quantity;
        
        inventoryItems.push({
          name: item.name,
          quantity,
          value: item.value,
          totalValue: itemTotalValue,
          sellLocation: item.sellLocation,
          sellable: item.sellable
        });
        
        if (item.sellable !== false) {
          totalValue += itemTotalValue;
        }
      } else {
        inventoryItems.push({
          name,
          quantity
        });
      }
    }
    
    return {
      items: inventoryItems,
      totalValue
    };
  } catch (error) {
    console.error('Error processing inventory:', error);
    return {
      items: [],
      totalValue: 0
    };
  }
} 