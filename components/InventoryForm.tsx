'use client';

import { useState } from 'react';
import { InventoryResult } from '@/types';
import RequestUpdateButton from './RequestUpdateButton';

export default function InventoryForm() {
  const [inventoryText, setInventoryText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<InventoryResult | null>(null);
  const [error, setError] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inventoryText.trim()) {
      setError('Please enter your inventory data');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/inventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inventoryText }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process inventory');
      }
      
      const data = await response.json();
      setResult(data);
      
      try {
        await fetch('/api/globalStats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inventoryValue: data.totalValue }),
        });
      } catch (statsError) {
        console.error('Failed to update global stats:', statsError);
      }
      
      const event = new CustomEvent('inventoryCalculated', {
        detail: { result: data }
      });
      window.dispatchEvent(event);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setInventoryText('');
    setResult(null);
    setError('');
  };

  return (
    <div className="w-full">
      {!result && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-4">
            <label htmlFor="inventory" className="block mb-2 font-medium text-dark-200">
              Paste your inventory below (Item and quantity separated by tabs)
            </label>
            <textarea
              id="inventory"
              rows={10}
              className="w-full p-3 border border-dark-600 rounded-md bg-dark-700 text-white focus:outline-none focus:ring-0 focus:border-primary-500"
              placeholder="Cash&#9;1000
Screwdriver&#9;1
Phone&#9;2"
              value={inventoryText}
              onChange={(e) => setInventoryText(e.target.value)}
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md border border-red-700">
              {error}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 focus:outline-none focus:ring-0"
            >
              {loading ? 'Processing...' : 'Calculate Value'}
            </button>
          </div>
        </form>
      )}
      
      {result && (
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-primary-500">
            Inventory Results
          </h3>
          
          <div className="mb-6">
            <div className="text-xl mb-4 text-white">
              Total Sellable Value: <span className="text-primary-400">${result.totalValue.toLocaleString()}</span>
            </div>
            
            <div className="bg-dark-800 overflow-x-auto rounded-lg">
              <table className="min-w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Value Per Unit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Total Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {result.items.map((item, index) => (
                    <tr key={index} className="bg-dark-700">
                      <td className="px-6 py-4 whitespace-nowrap text-white">{item.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">{item.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {item.value ? `$${item.value.toLocaleString()}` : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-white">
                        {item.totalValue ? `$${item.totalValue.toLocaleString()}` : 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.value ? (
                          item.sellable === false ? (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900 text-yellow-200">Unsellable</span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-200">{item.sellLocation || 'Sellable'}</span>
                          )
                        ) : (
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-900 text-red-200">Unrecognized</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-dark-600 text-white rounded-md hover:bg-dark-500 focus:outline-none focus:ring-0"
            >
              Check Another Inventory
            </button>
          </div>
        </div>
      )}
      
      <RequestUpdateButton />
    </div>
  );
} 