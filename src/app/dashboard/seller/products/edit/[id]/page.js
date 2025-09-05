"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function MyProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/myproducts`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProducts(data.products);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পণ্যটি ডিলিট করতে চান?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('পণ্য সফলভাবে ডিলিট করা হয়েছে!');
          // তালিকা থেকে পণ্যটি সরানোর জন্য আবার লোড করা হচ্ছে
          fetchMyProducts(); 
        } else {
          throw new Error(data.message || 'Failed to delete product');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">আমার পণ্যসমূহ</h1>
        <Link href="/dashboard/seller/products/new" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          + নতুন পণ্য যোগ করুন
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>পণ্য লোড হচ্ছে...</p>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">নাম</th>
                  <th className="text-left p-2">মূল্য</th>
                  <th className="text-left p-2">স্টক</th>
                  <th className="text-left p-2">क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">৳ {product.price}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">
                      <Link href={`/dashboard/seller/products/edit/${product._id}`} className="text-blue-500 hover:underline mr-4">
                        এডিট
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:underline">
                        ডিলিট
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>আপনি এখনো কোনো পণ্য যোগ করেননি।</p>
        )}
      </div>
    </div>
  );
}