import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const statsFilePath = path.join(process.cwd(), 'data', 'globalStats.json');

async function ensureStatsFile() {
  try {
    const dataDir = path.join(process.cwd(), 'data');
    try {
      await fs.access(dataDir);
    } catch (error) {
      // Create data directory if it doesn't exist
      await fs.mkdir(dataDir, { recursive: true });
    }

    try {
      await fs.access(statsFilePath);
    } catch (error) {
      const initialStats = { totalValue: 0, count: 0 };
      await fs.writeFile(statsFilePath, JSON.stringify(initialStats, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring stats file exists:', error);
  }
}

export async function GET() {
  try {
    await ensureStatsFile();
    const statsData = await fs.readFile(statsFilePath, 'utf8');
    const stats = JSON.parse(statsData);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching global stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch global stats' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { inventoryValue } = await request.json();
    
    if (typeof inventoryValue !== 'number' || isNaN(inventoryValue)) {
      return NextResponse.json(
        { error: 'Invalid inventory value' },
        { status: 400 }
      );
    }
    
    await ensureStatsFile();
    
    const statsData = await fs.readFile(statsFilePath, 'utf8');
    const stats = JSON.parse(statsData);
    
    const updatedStats = {
      totalValue: stats.totalValue + inventoryValue,
      count: stats.count + 1
    };
    
    await fs.writeFile(statsFilePath, JSON.stringify(updatedStats, null, 2));
    
    return NextResponse.json(updatedStats);
  } catch (error) {
    console.error('Error updating global stats:', error);
    return NextResponse.json(
      { error: 'Failed to update global stats' },
      { status: 500 }
    );
  }
} 