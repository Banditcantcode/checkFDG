'use client';

import { useState, useEffect } from 'react';

export default function GlobalStats() {
  const [globalTotal, setGlobalTotal] = useState<number>(0);
  const [inventoriesChecked, setInventoriesChecked] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGlobalStats = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/globalStats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch global stats');
        }
        
        const stats = await response.json();
        setGlobalTotal(stats.totalValue || 0);
        setInventoriesChecked(stats.count || 0);
      } catch (error) {
        console.error('Error fetching global stats:', error);
        // Fallback to zeros if the API call fails if im retarded idk
        setGlobalTotal(0);
        setInventoriesChecked(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGlobalStats();

    const intervalId = setInterval(fetchGlobalStats, 30000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  if (isLoading) {
    return <div className="h-8"></div>;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 bg-dark-800 py-3 px-4 rounded-lg mb-4 text-center">
      <div>
        <span className="text-dark-300 mr-2">Total Inventory Values Checked:</span>
        <span className="text-primary-400 font-bold">${globalTotal.toLocaleString()}</span>
      </div>
      <div className="h-5 border-r border-dark-600 hidden sm:block"></div>
      <div>
        <span className="text-dark-300 mr-2">Inventories Processed:</span>
        <span className="text-primary-400 font-bold">{inventoriesChecked.toLocaleString()}</span>
      </div>
    </div>
  );
} 