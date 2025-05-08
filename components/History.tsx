'use client';

import { useState, useEffect } from 'react';
import { InventoryResult } from '@/types';

export default function History() {
  const [history, setHistory] = useState<{ date: string; result: InventoryResult }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedItems, setExpandedItems] = useState<number[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        const savedHistory = localStorage.getItem('inventoryHistory');
        
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        } else {
          setHistory([]);
        }
      } catch (err) {
        setError('Failed to load history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('inventoryHistory');
    setHistory([]);
    setExpandedItems([]);
  };

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <div className="p-4 bg-red-900 text-red-200 rounded-md border border-red-700 mb-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-primary-500">Inventory History</h2>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 focus:outline-none focus:ring-0"
          >
            Clear History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-10 bg-dark-800 rounded-lg">
          <p className="text-dark-300">No history available. Calculate some inventory values first!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map((item, index) => (
            <div key={index} className="bg-dark-800 rounded-lg overflow-hidden">
              <div 
                className="p-4 flex justify-between items-center cursor-pointer hover:bg-dark-700"
                onClick={() => toggleExpand(index)}
              >
                <div>
                  <span className="text-dark-300">{item.date}</span>
                  <div className="font-semibold text-lg text-primary-400 mt-1">
                    Total Sellable Value: ${item.result.totalValue.toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-dark-300 mr-2">{item.result.items.length} items</span>
                  <svg 
                    className={`w-6 h-6 text-dark-300 transform transition-transform ${expandedItems.includes(index) ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
              
              {expandedItems.includes(index) && (
                <div className="border-t border-dark-600 p-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-dark-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                            Item
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                            Quantity
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                            Value Per Unit
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                            Total Value
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-dark-300 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-dark-600">
                        {item.result.items.map((invItem, idx) => (
                          <tr key={idx} className="bg-dark-700">
                            <td className="px-4 py-2 whitespace-nowrap text-white">{invItem.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-white">{invItem.quantity}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-white">
                              {invItem.value ? `$${invItem.value.toLocaleString()}` : 'Unknown'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-white">
                              {invItem.totalValue ? `$${invItem.totalValue.toLocaleString()}` : 'Unknown'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {invItem.value ? (
                                invItem.sellable === false ? (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900 text-yellow-200">Unsellable</span>
                                ) : (
                                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900 text-green-200">{invItem.sellLocation || 'Sellable'}</span>
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 