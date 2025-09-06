"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Image কম্পোনেন্ট ইমপোর্ট করা হয়েছে
// আইকন ইমপোর্ট করা হয়েছে
import { FiUser, FiShoppingBag, FiEdit3, FiLogOut } from 'react-icons/fi';

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      setError('');
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/myorders`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('অর্ডার লোড করা সম্ভব হচ্ছে না।');
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
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
    return <div className="text-center p-8">Redirecting to login...</div>;
  }
  
  const renderContent = () => {
    if (activeTab === 'profile') {
      return (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">বাক্তিগত তথ্য</h2>
            <button className="flex items-center space-x-2 text-sm text-blue-600 hover:underline">
              <FiEdit3 />
              <span>তথ্য এডিট করুন</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
            <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">নাম</p>
                <p className="font-semibold text-lg">{user.name}</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ইমেইল</p>
                <p className="font-semibold text-lg">{user.email}</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ভূমিকা</p>
                <p className="font-semibold text-lg capitalize">{user.role}</p>
            </div>
             <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">কয়েন ব্যালেন্স</p>
                    <p className="font-semibold text-lg text-yellow-600">{user.coinBalance || 0}</p>
                </div>
              <span className="text-2xl">🪙</span>
            </div>
          </div>
          {user.role === 'customer' && (
            <div className="mt-8 border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">আমাদের সাথে ব্যবসা করুন</h3>
              <p className="text-gray-600 mb-4">আপনি কি আপনার পণ্য আমাদের প্ল্যাটফর্মে বিক্রি করতে আগ্রহী?</p>
              <Link href="/become-seller">
                <button className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-6 py-2 rounded-lg hover:from-green-600 hover:to-teal-700 transition-all transform hover:scale-105">
                  বিক্রেতা হওয়ার জন্য আবেদন করুন
                </button>
              </Link>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'orders') {
      return (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">আমার অর্ডারসমূহ</h2>
          {loading ? (
            <p>অর্ডার লোড হচ্ছে...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order, index) => (
                <div key={order._id} className="bg-white p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow animate-slide-in-up" style={{ animationDelay: `${index * 100}ms`, opacity: 0, animationFillMode: 'forwards' }}>
                  <div className="flex flex-wrap justify-between items-center mb-3 pb-3 border-b">
                    <div>
                      <p className="font-semibold text-gray-800">অর্ডার #{order._id.substring(0, 8)}</p>
                      <p className="text-sm text-gray-500">তারিখ: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${order.isDelivered ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {order.isDelivered ? 'ডেলিভার্ড' : 'প্রসেসিং'}
                    </span>
                  </div>
                  <div className="flex space-x-2 mb-3 overflow-x-auto py-2">
                     {order.orderItems.map(item => (
                       <div key={item.product} className="flex-shrink-0">
                         <Image 
                           src={item.imageUrl || 'https://via.placeholder.com/100'} 
                           alt={item.name} 
                           width={64} 
                           height={64} 
                           className="w-16 h-16 object-cover rounded-md"
                           title={`${item.name} (x${item.quantity})`}
                         />
                       </div>
                     ))}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-800">মোট: ৳ {order.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <FiShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">আপনি এখনো কোনো অর্ডার করেননি।</h3>
              <p className="mt-1 text-sm text-gray-500">কেনাকাটা শুরু করুন এবং আপনার অর্ডারগুলো এখানে দেখুন।</p>
              <div className="mt-6">
                <Link href="/products">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                    কেনাকাটা করুন
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-lg sticky top-24">
              <div className="text-center mb-4 border-b pb-4">
                  <Image 
                    src={user.avatar || 'https://via.placeholder.com/100'} 
                    alt="User Avatar"
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto"
                  />
                  <h3 className="font-bold text-xl text-gray-800 mt-3">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-semibold transition-colors duration-200 ${activeTab === 'profile' ? 'bg-green-600 text-white shadow' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <FiUser className="h-5 w-5" />
                    <span>প্রোফাইল</span>
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-semibold transition-colors duration-200 ${activeTab === 'orders' ? 'bg-green-600 text-white shadow' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <FiShoppingBag className="h-5 w-5" />
                    <span>আমার অর্ডারসমূহ</span>
                  </button>
                </li>
                 <li>
                  <button 
                    onClick={logout}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left font-semibold transition-colors duration-200 text-red-500 hover:bg-red-50`}
                  >
                    <FiLogOut className="h-5 w-5" />
                    <span>লগআউট</span>
                  </button>
                </li>
              </ul>
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg min-h-[500px]">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}