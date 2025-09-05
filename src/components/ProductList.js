"use client";

import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং সর্টিং এর জন্য state
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  // ক্যাটাগরিগুলো লোড করার জন্য
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // প্রোডাক্ট লোড করার জন্য মূল useEffect
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append('keyword', searchTerm);
        if (selectedCategory) params.append('category', selectedCategory);
        if (sortOption) params.append('sort', sortOption);

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?${params.toString()}`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setProducts([]);
      }
      setLoading(false);
    };

    // সার্চ করার সময় একটু দেরি করে API কল করার জন্য debounce
    const debounceTimeout = setTimeout(() => {
        fetchProducts();
    }, 500); // 500ms delay

    return () => clearTimeout(debounceTimeout); // Cleanup

  }, [searchTerm, selectedCategory, sortOption]); // state পরিবর্তন হলেই useEffect আবার চলবে

  return (
    <div>
      {/* ফিল্টার এবং সার্চ বার */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 bg-gray-50 rounded-lg">
        <input 
          type="text"
          placeholder="পণ্য খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">সকল ক্যাটাগরি</option>
          {categories.map(cat => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="">সাজান</option>
          <option value="price-asc">মূল্য: কম থেকে বেশি</option>
          <option value="price-desc">মূল্য: বেশি থেকে কম</option>
        </select>
      </div>

      {/* পণ্যের তালিকা */}
      {loading ? (
        <p className="text-center">লোড হচ্ছে...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-center">কোনো পণ্য পাওয়া যায়নি।</p>
      )}
    </div>
  );
}