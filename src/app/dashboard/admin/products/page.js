// src/app/dashboard/admin/products/page.js
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ManageAllProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllProducts = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
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
          fetchAllProducts(); // তালিকা রিফ্রেশ করা হচ্ছে
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
      <h1 className="text-3xl font-bold mb-6">সকল পণ্য ম্যানেজ করুন</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>পণ্য লোড হচ্ছে...</p>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">নাম</th>
                  <th className="text-left p-2">বিক্রেতা</th>
                  <th className="text-left p-2">মূল্য</th>
                  <th className="text-left p-2">স্টক</th>
                  <th className="text-left p-2">क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b">
                    <td className="p-2">{product.name}</td>
                    <td className="p-2">{product.seller?.name || 'N/A'}</td>
                    <td className="p-2">৳ {product.price}</td>
                    <td className="p-2">{product.stock}</td>
                    <td className="p-2">
                      {/* অ্যাডমিন এবং সেলার একই এডিট পেইজ ব্যবহার করতে পারবে */}
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
          <p>সাইটে কোনো পণ্য পাওয়া যায়নি।</p>
        )}
      </div>
    </div>
  );
}