"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

// আইকন কম্পোনেন্ট
const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z" />
  </svg>
);
const DeleteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);


export default function ManageCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetForm = () => {
    setName('');
    setImageUrl('');
    setEditingCategory(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const apiEndpoint = editingCategory
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${editingCategory._id}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`;
    
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save category');
      
      alert(`ক্যাটাগরি সফলভাবে ${editingCategory ? 'আপডেট' : 'তৈরি'} করা হয়েছে!`);
      resetForm();
      fetchCategories();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setName(category.name);
    setImageUrl(category.imageUrl || '');
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ক্যাটাগরিটি ডিলিট করতে চান?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories/${categoryId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to delete category');

        alert('ক্যাটাগরি সফলভাবে ডিলিট করা হয়েছে!');
        fetchCategories();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ক্যাটাগরি ম্যানেজমেন্ট</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">{editingCategory ? 'ক্যাটাগরি এডিট করুন' : 'নতুন ক্যাটাগরি যোগ করুন'}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">ক্যাটাগরির নাম</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" required />
            </div>
            <div className="mb-4">
              <label className="block font-semibold text-gray-700 mb-2">ছবির URL</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="flex items-center">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                {editingCategory ? 'আপডেট করুন' : 'যোগ করুন'}
              </button>
              {editingCategory && (
                <button type="button" onClick={resetForm} className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                  বাতিল
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">বিদ্যমান ক্যাটাগরি</h2>
          {loading ? (
            <p>লোড হচ্ছে...</p>
          ) : (
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat._id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                  <span className="font-medium text-gray-800">{cat.name}</span>
                  <div className="flex items-center space-x-3">
                    <button onClick={() => handleEdit(cat)} className="text-blue-500 hover:text-blue-700">
                      <EditIcon />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="text-red-500 hover:text-red-700">
                      <DeleteIcon />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}