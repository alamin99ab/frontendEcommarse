"use client";

import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { FiSearch, FiChevronDown } from "react-icons/fi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ক্যাটাগরি ফেচ
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`
        );
        const data = await res.json();
        if (data.success) setCategories(data.categories || []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // প্রোডাক্ট ফেচ
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.append("keyword", searchTerm);
        if (selectedCategory) params.append("category", selectedCategory);
        if (sortOption) params.append("sort", sortOption);

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

    const debounceTimeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, selectedCategory, sortOption]);

  return (
    <div>
      {/* 🔍 Top Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        {/* Search */}
        <div className="relative w-full md:w-1/3">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">All Products</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>

        <span className="text-gray-600">{products.length} products</span>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600">
            No products found for your search.
          </p>
        </div>
      )}
    </div>
  );
}
