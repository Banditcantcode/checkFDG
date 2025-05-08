import { NextRequest, NextResponse } from 'next/server';
import { getItemByName, updateItem } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const name = params.name;
    
    if (!name) {
      return NextResponse.json(
        { error: 'Item name is required' },
        { status: 400 }
      );
    }
    
    const decodedName = decodeURIComponent(name);
    
    const item = await getItemByName(decodedName);
    
    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(item);
  } catch (error) {
    console.error('Error getting item by name:', error);
    return NextResponse.json(
      { error: 'Failed to get item' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const name = params.name;
    const { value, id } = await request.json();
    
    if (!name || !id || value === undefined) {
      return NextResponse.json(
        { error: 'Item ID, name, and value are required' },
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
    
    const updatedItem = await updateItem(id, name, valueAsNumber);
    
    if (!updatedItem) {
      return NextResponse.json(
        { error: 'Failed to update item' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
} 