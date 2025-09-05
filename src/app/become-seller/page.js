"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function BecomeSellerPage() {
  const { token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: '',
    address: '',
    phoneNo: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // মূল পরিবর্তন এখানে: URL টি ঠিক করা হয়েছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'আবেদন জমা দেওয়া যায়নি।');

      setSuccess('আপনার আবেদন সফলভাবে জমা হয়েছে। অনুমোদনের জন্য অপেক্ষা করুন।');
      setTimeout(() => router.push('/profile'), 3000);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 flex justify-center">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6">বিক্রেতা হওয়ার জন্য আবেদন করুন</h1>
          <p className="text-center text-gray-600 mb-8">আপনার দোকানের তথ্য দিয়ে নিচের ফরমটি পূরণ করুন।</p>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">দোকান/ব্যবসার নাম</label>
            <input type="text" name="businessName" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">ঠিকানা</label>
            <input type="text" name="address" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">ফোন নম্বর</label>
            <input type="text" name="phoneNo" onChange={handleChange} className="w-full p-3 border border-gray-300 rounded-lg" required />
          </div>

          <div className="flex justify-center">
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400">
              {loading ? 'জমা হচ্ছে...' : 'আবেদন জমা দিন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}