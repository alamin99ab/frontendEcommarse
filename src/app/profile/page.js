"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      setError('');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/myorders`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('আপনার অর্ডারগুলো লোড করা সম্ভব হচ্ছে না। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।');
        }
        const data = await res.json();
        if (data.success) {
            setOrders(data.orders);
        } else {
            throw new Error(data.message || 'Orders could not be loaded.');
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [user, token, router]);

  if (!user) {
    return <p className="text-center p-8">Redirecting to login...</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">আমার প্রোফাইল</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-semibold mb-4">বাক্তিগত তথ্য</h2>
        <p><strong>নাম:</strong> {user.name}</p>
        <p><strong>ইমেইল:</strong> {user.email}</p>
        <p><strong>ভূমিকা:</strong> <span className="font-semibold capitalize">{user.role}</span></p>
        <p><strong>কয়েন ব্যালেন্স:</strong> <span className="font-bold text-yellow-600">{user.coinBalance || 0} 🪙</span></p>
      </div>

      {user.role === 'customer' && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">আমাদের সাথে ব্যবসা করুন</h2>
          <Link href="/become-seller">
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
              বিক্রেতা হওয়ার জন্য আবেদন করুন
            </button>
          </Link>
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">আমার অর্ডারসমূহ</h2>
        {loading ? (
          <p>অর্ডার লোড হচ্ছে...</p>
        ) : error ? (
            <p className="text-red-500">{error}</p>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
               <thead>
                <tr className="border-b">
                  <th className="text-left p-2">অর্ডার আইডি</th>
                  <th className="text-left p-2">তারিখ</th>
                  <th className="text-left p-2">মোট মূল্য</th>
                  <th className="text-left p-2">ডেলিভারি অবস্থা</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id} className="border-b">
                    <td className="p-2">{order._id}</td>
                    <td className="p-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-2">৳ {order.totalPrice.toFixed(2)}</td>
                    <td className="p-2">{order.isDelivered ? 'ডেলিভার্ড' : 'প্রসেসিং'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>আপনি এখনো কোনো অর্ডার করেননি।</p>
        )}
      </div>
    </div>
  );
}