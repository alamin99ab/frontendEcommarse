"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AddNewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    imageUrl: '',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`, {
          cache: 'no-store'
        });

        // প্রথমে চেক করা হচ্ছে API থেকে সফল রেসপন্স এসেছে কিনা
        if (!res.ok) {
          throw new Error(`Failed to fetch categories with status: ${res.status}`);
        }

        const data = await res.json();
        
        // এখন চেক করা হচ্ছে ডেটা সরাসরি অ্যারে কিনা, অথবা অবজেক্টের ভেতরে আছে কিনা
        const categoryList = Array.isArray(data) ? data : data.categories;

        if (Array.isArray(categoryList)) {
            setCategories(categoryList);
        } else {
            // যদি কোনোভাবেই অ্যারে না পাওয়া যায়
            throw new Error("Category data is not in the expected format.");
        }

      } catch (error) {
          console.error(error);
          setError('ক্যাটাগরি লোড করা যায়নি।');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');
      
      alert('পণ্য সফলভাবে যোগ করা হয়েছে!');
      router.push('/dashboard/seller/products');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">নতুন পণ্য যোগ করুন</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">পণ্যের নাম</label>
          <input type="text" name="name" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">বিবরণ</label>
          <textarea name="description" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" rows="4"></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">মূল্য (৳)</label>
            <input type="number" name="price" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">স্টক</label>
            <input type="number" name="stock" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">ক্যাটাগরি</label>
              <select name="category" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" required>
                <option value="">ক্যাটাগরি নির্বাচন করুন</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
                <label className="block text-gray-700 font-semibold mb-2">ছবির URL</label>
                <input type="text" name="imageUrl" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500" />
            </div>
        </div>

        <div className="mt-8 flex justify-center">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors">
              {loading ? 'সাবমিট হচ্ছে...' : 'পণ্য যোগ করুন'}
            </button>
        </div>
      </form>
    </div>
  );
}