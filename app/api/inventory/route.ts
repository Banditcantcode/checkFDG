import { NextRequest, NextResponse } from 'next/server';
import { processInventory } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { inventoryText } = await request.json();
    
    if (!inventoryText) {
      return NextResponse.json(
        { error: 'Inventory text is required' },
        { status: 400 }
      );
    }
    
    const result = await processInventory(inventoryText);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing inventory:', error);
    return NextResponse.json(
      { error: 'Failed to process inventory' },
      { status: 500 }
    );
  }
} 