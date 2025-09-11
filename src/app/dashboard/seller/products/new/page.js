"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { FiUploadCloud } from 'react-icons/fi';

export default function AddNewProductPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });
  const [categories, setCategories] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ক্যাটাগরি লোড করা হচ্ছে
    const fetchCategories = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`, { 
              cache: 'no-store',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(Array.isArray(data) ? data : data.categories || []);
        } catch (error) {
            toast.error('ক্যাটাগরি লোড করা যায়নি।');
        }
    };
    fetchCategories();
  }, [token]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error('দয়া করে একটি ছবি নির্বাচন করুন');
      return;
    }
    
    setLoading(true);
    const toastId = toast.loading('পণ্য যোগ করা হচ্ছে...');

    try {
      // ধাপ ১: ছবি আপলোড করা
      setUploading(true);
      toast.loading('ছবি আপলোড হচ্ছে...', { id: toastId });
      
      const imageFormData = new FormData();
      imageFormData.append('image', imageFile);

      const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: imageFormData,
      });

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json();
        throw new Error(errorData.message || 'ছবি আপলোড করতে সমস্যা হয়েছে');
      }

      const uploadData = await uploadRes.json();
      const imageUrl = uploadData.url;

      // ধাপ ২: পণ্য তৈরি করা
      toast.loading('পণ্যের তথ্য সেভ করা হচ্ছে...', { id: toastId });
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        images: [imageUrl] // backend যদি images array expect করে
        // imageUrl: imageUrl // backend যদি imageUrl field expect করে
      };

      const productRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productData),
      });

      if (!productRes.ok) {
        const errorData = await productRes.json();
        throw new Error(errorData.message || 'পণ্য তৈরি করতে সমস্যা হয়েছে');
      }

      toast.success('পণ্য সফলভাবে যোগ করা হয়েছে!', { id: toastId });
      router.push('/dashboard/seller/products');
    } catch (err) {
      toast.error(err.message, { id: toastId });
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">নতুন পণ্য যোগ করুন</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
        {/* Image Upload Section */}
        <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">পণ্যের ছবি</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <FiUploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                            <span>একটি ফাইল আপলোড করুন</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleImageChange} 
                              accept="image/*" 
                              required
                            />
                        </label>
                        <p className="pl-1">অথবা টেনে এনে এখানে ছাড়ুন</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (সর্বোচ্চ 5MB)</p>
                    {imageFile && (
                      <p className="text-sm text-green-600 mt-2">নির্বাচিত ফাইল: {imageFile.name}</p>
                    )}
                </div>
            </div>
        </div>

        {/* Product Details Form */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">পণ্যের নাম</label>
          <input 
            type="text" 
            name="name" 
            onChange={handleFormChange} 
            className="w-full p-3 border border-gray-300 rounded-lg" 
            required 
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">বিবরণ</label>
          <textarea 
            name="description" 
            onChange={handleFormChange} 
            className="w-full p-3 border border-gray-300 rounded-lg" 
            rows="4"
            required
          ></textarea>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">মূল্য (৳)</label>
            <input 
              type="number" 
              name="price" 
              onChange={handleFormChange} 
              className="w-full p-3 border border-gray-300 rounded-lg" 
              required 
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">স্টক</label>
            <input 
              type="number" 
              name="stock" 
              onChange={handleFormChange} 
              className="w-full p-3 border border-gray-300 rounded-lg" 
              required 
              min="0"
            />
          </div>
        </div>
        
        <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">ক্যাটাগরি</label>
            <select 
              name="category" 
              onChange={handleFormChange} 
              className="w-full p-3 border border-gray-300 rounded-lg" 
              required
            >
              <option value="">ক্যাটাগরি নির্বাচন করুন</option>
              {categories.map(cat => ( 
                <option key={cat._id} value={cat._id}>{cat.name}</option> 
              ))}
            </select>
        </div>

        <div className="mt-8 flex justify-center">
            <button 
              type="submit" 
              disabled={loading || uploading} 
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors"
            >
              {uploading ? 'ছবি আপলোড হচ্ছে...' : 
               loading ? 'পণ্য যোগ করা হচ্ছে...' : 
               'পণ্য যোগ করুন'}
            </button>
        </div>
      </form>
    </div>
  );
}