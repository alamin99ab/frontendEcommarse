// src/app/dashboard/seller/orders/page.js
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function MyOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      // দ্রষ্টব্য: আমরা ধরে নিচ্ছি API রাউটটি /api/v1/orders/myorders
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/myorders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [token]);

  const handleMarkAsDelivered = async (orderId) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই অর্ডারটি ডেলিভার করা হয়েছে?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${orderId}/deliver`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('অর্ডার সফলভাবে আপডেট করা হয়েছে!');
          fetchMyOrders(); // তালিকাটি রিফ্রেশ করা হচ্ছে
        } else {
          throw new Error(data.message || 'Failed to update order');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">আমার অর্ডারসমূহ</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>অর্ডার লোড হচ্ছে...</p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">অর্ডার আইডি</th>
                  <th className="text-left p-2">তারিখ</th>
                  <th className="text-left p-2">মোট মূল্য</th>
                  <th className="text-left p-2">ডেলিভারি অবস্থা</th>
                  <th className="text-left p-2">क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2 truncate" title={order._id}>{order._id.substring(0, 10)}...</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">৳ {order.totalPrice.toFixed(2)}</td>
                    <td className="p-2">
                      {order.isDelivered 
                        ? <span className="text-green-600 font-semibold">ডেলিভার্ড</span> 
                        : <span className="text-yellow-600 font-semibold">প্রসেসিং</span>
                      }
                    </td>
                    <td className="p-2">
                      {!order.isDelivered && (
                        <button 
                          onClick={() => handleMarkAsDelivered(order._id)}
                          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                        >
                          ডেলিভার্ড হিসেবে চিহ্নিত করুন
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>আপনার কোনো অর্ডার পাওয়া যায়নি।</p>
        )}
      </div>
    </div>
  );
}