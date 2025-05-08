'use client';

import { useState, useEffect, useRef } from 'react';
import { Item } from '@/types';
import RequestUpdateButton from './RequestUpdateButton';

export default function ItemLookup() {
  const [itemName, setItemName] = useState('');
  const [loading, setLoading] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [error, setError] = useState('');
  const [isPartialMatch, setIsPartialMatch] = useState(false);
  const [suggestions, setSuggestions] = useState<Item[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const fetchAllItems = async () => {
      try {
        const response = await fetch('/api/items');
        if (response.ok) {
          const data = await response.json();
          setAllItems(data);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    };
    
    fetchAllItems();
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  useEffect(() => {
    if (itemName.trim() === '') {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    
    const query = itemName.toLowerCase().trim();
    const matchingItems = allItems
      .filter(item => item.name.toLowerCase().includes(query))
      .sort((a, b) => {
        const aStartsWith = a.name.toLowerCase().startsWith(query);
        const bStartsWith = b.name.toLowerCase().startsWith(query);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;

        return a.name.length - b.name.length;
      })
      .slice(0, 8);
    
    setSuggestions(matchingItems);
    setShowSuggestions(matchingItems.length > 0);
  }, [itemName, allItems]);
  
  const handleSuggestionClick = (selectedItem: Item) => {
    setItemName(selectedItem.name);
    setShowSuggestions(false);
    setItem(selectedItem);
    setIsPartialMatch(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!itemName.trim()) {
      setError('Please enter an item name');
      return;
    }
    
    setLoading(true);
    setError('');
    setIsPartialMatch(false);
    
    try {
      const response = await fetch(`/api/items/${encodeURIComponent(itemName)}`);
      
      if (response.status === 404) {
        setError('Item not found');
        setItem(null);
        return;
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to lookup item');
      }
      
      const data = await response.json();
      
      if (data.name.toLowerCase().trim() !== itemName.toLowerCase().trim()) {
        setIsPartialMatch(true);
      }
      
      setItem(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex mb-4 relative">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 p-3 border border-dark-600 rounded-l-md bg-dark-700 text-white focus:outline-none focus:ring-0 focus:border-primary-500"
            placeholder="Enter item name"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 focus:outline-none focus:ring-0"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          
          {showSuggestions && (
            <div 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-20 z-10 bg-dark-700 border border-dark-500 rounded-md mt-1 max-h-60 overflow-y-auto"
            >
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="px-4 py-2 hover:bg-dark-600 cursor-pointer border-b border-dark-600 last:border-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="text-white">{suggestion.name}</div>
                  <div className="text-primary-400 text-sm">${suggestion.value.toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 text-red-200 rounded-md border border-red-700">
            {error}
          </div>
        )}
      </form>
      
      {item && (
        <div className="bg-dark-800 p-6 rounded-lg shadow-md border border-dark-600 mb-4">
          <h3 className="text-2xl font-bold mb-2 text-primary-400">{item.name}</h3>
          <div className="text-xl text-white">
            Value: <span className="text-primary-400">${item.value.toLocaleString()}</span>
          </div>
          {item.category && (
            <div className="mt-1 text-sm text-dark-300">
              Category: <span className="text-primary-300">{item.category}</span>
            </div>
          )}
          {isPartialMatch && (
            <div className="mt-3 text-amber-400 text-sm">
              Note: Exact match not found. This is the closest item in our database.
            </div>
          )}
        </div>
      )}
      
      <RequestUpdateButton />
    </div>
  );
} 