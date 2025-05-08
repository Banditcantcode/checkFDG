import { NextRequest, NextResponse } from 'next/server';
import { getAllItems, addItem, updateItem, getItemByName } from '@/lib/db';

export async function GET() {
  try {
    const items = await getAllItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error getting items:', error);
    return NextResponse.json(
      { error: 'Failed to get items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, value } = await request.json();
    
    if (!name || value === undefined) {
      return NextResponse.json(
        { error: 'Name and value are required' },
        { status: 400 }
      );
    }
    
    const valueAsNumber = Number(value);
    
    if (isNaN(valueAsNumber)) {
      return NextResponse.json(
        { error: 'Value must be a number' },
        { status: 400 }
      );
    }
    
    const newItem = await addItem(name, valueAsNumber);
    
    if (!newItem) {
      return NextResponse.json(
        { error: 'Failed to add item' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Error adding item:', error);
    return NextResponse.json(
      { error: 'Failed to add item' },
      { status: 500 }
    );
  }
} 