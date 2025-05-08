'use client';

import { useState, useEffect } from 'react';
import InventoryForm from './InventoryForm';
import ItemLookup from './ItemLookup';
import History from './History';
import About from './About';

export default function TabSystem() {
  const [activeTab, setActiveTab] = useState<'inventory' | 'lookup' | 'history' | 'about'>('inventory');

  useEffect(() => {
    const handleInventoryCalculated = (event: CustomEvent) => {
      const { result } = event.detail;
      if (!result) return;
      
      try {
        const existingHistory = localStorage.getItem('inventoryHistory');
        const history = existingHistory ? JSON.parse(existingHistory) : [];
        const newEntry = {
          date: new Date().toLocaleString(),
          result
        };
        
        const updatedHistory = [newEntry, ...history].slice(0, 10);
        localStorage.setItem('inventoryHistory', JSON.stringify(updatedHistory));
      } catch (err) {
        console.error('Failed to save to history:', err);
      }
    };

    window.addEventListener('inventoryCalculated', handleInventoryCalculated as EventListener);
    
    return () => {
      window.removeEventListener('inventoryCalculated', handleInventoryCalculated as EventListener);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex justify-center border-b border-dark-600 mb-3 flex-wrap">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-6 py-2 font-medium text-lg tab mx-2 sm:mx-4 ${activeTab === 'inventory' ? 'tab-active' : 'text-dark-300'}`}
        >
          Inventory Check
        </button>
        <button 
          onClick={() => setActiveTab('lookup')}
          className={`px-6 py-2 font-medium text-lg tab mx-2 sm:mx-4 ${activeTab === 'lookup' ? 'tab-active' : 'text-dark-300'}`}
        >
          Item Lookup
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`px-6 py-2 font-medium text-lg tab mx-2 sm:mx-4 ${activeTab === 'history' ? 'tab-active' : 'text-dark-300'}`}
        >
          History
        </button>
        <button 
          onClick={() => setActiveTab('about')}
          className={`px-6 py-2 font-medium text-lg tab mx-2 sm:mx-4 ${activeTab === 'about' ? 'tab-active' : 'text-dark-300'}`}
        >
          About
        </button>
      </div>
      
      <div className="tab-content">
        {activeTab === 'inventory' && <InventoryForm />}
        {activeTab === 'lookup' && <ItemLookup />}
        {activeTab === 'history' && <History />}
        {activeTab === 'about' && <About />}
      </div>
    </div>
  );
} 