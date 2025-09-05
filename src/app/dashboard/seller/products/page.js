"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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

export default function MyProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyProducts = async () => {
    if (!token) return;
    try {
      // মূল পরিবর্তন এখানে: { cache: 'no-store' } যোগ করা হয়েছে
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/myproducts`, {
        cache: 'no-store',
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
        <Link href="/dashboard/seller/products/new" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center">
          + নতুন পণ্য যোগ করুন
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>পণ্য লোড হচ্ছে...</p>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 uppercase">Name</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 uppercase">Price</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 uppercase">Stock</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 uppercase">Category</th>
                  <th className="p-3 text-left text-sm font-semibold text-gray-600 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{product.name}</td>
                    <td className="p-3">৳ {product.price}</td>
                    <td className="p-3">{product.stock} টি</td>
                    <td className="p-3">{product.category?.name || 'N/A'}</td>
                    <td className="p-3 flex items-center space-x-4">
                      <Link href={`/dashboard/seller/products/edit/${product._id}`} className="text-blue-500 hover:text-blue-700">
                        <EditIcon />
                      </Link>
                      <button onClick={() => handleDelete(product._id)} className="text-red-500 hover:text-red-700">
                        <DeleteIcon />
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