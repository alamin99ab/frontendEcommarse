// src/components/SearchOverlay.js

"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Close Icon SVG
const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

export default function SearchOverlay({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?keyword=${searchTerm}`;
        const res = await fetch(url);
        const data = await res.json();
        setResults(data.products || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      }
      setLoading(false);
    };
    
    // Debounce to avoid API call on every keystroke
    const debounceTimeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center p-4 transition-opacity duration-300">
      <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-green-400" aria-label="Close search">
        <CloseIcon />
      </button>

      <div className="w-full max-w-2xl mt-20">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="আপনি কী খুঁজছেন?"
          className="w-full p-4 text-xl text-center bg-transparent text-white border-b-2 border-green-400 focus:outline-none focus:border-white"
          autoFocus
        />
        
        <div className="mt-8 bg-white rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {loading && <p className="p-4 text-center text-gray-600">খুঁজছি...</p>}
          {!loading && results.length > 0 && (
            <ul>
              {results.map(product => (
                <li key={product._id} onClick={onClose}>
                  <Link href={`/products/${product._id}`} className="flex items-center p-4 hover:bg-gray-100 border-b">
                    <img src={product.imageUrl || 'https://via.placeholder.com/50'} alt={product.name} className="w-12 h-12 object-cover rounded mr-4" />
                    <div>
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-green-600">৳ {product.price}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          {!loading && searchTerm && results.length === 0 && (
            <p className="p-4 text-center text-gray-600">"{searchTerm}" এর জন্য কোনো ফলাফল পাওয়া যায়নি।</p>
          )}
        </div>
      </div>
    </div>
  );
}