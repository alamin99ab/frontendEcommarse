"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const router = useRouter();

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    phoneNo: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
    // localStorage থেকে পুরনো ঠিকানা লোড করা (যদি থাকে)
    const savedAddress = localStorage.getItem('shippingInfo');
    if (savedAddress) {
      setShippingInfo(JSON.parse(savedAddress));
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phoneNo) {
      setError('দয়া করে সকল তথ্য পূরণ করুন।');
      return;
    }
    // ঠিকানা localStorage-এ সেভ করা হচ্ছে
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    // পেমেন্ট পেইজে পাঠানো হচ্ছে
    router.push('/payment');
  };
  
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  if (!user) {
    return <p className="text-center p-8">Redirecting to login...</p>;
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">ডেলিভারির ঠিকানা</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block mb-1 font-semibold">ঠিকানা</label>
              <input type="text" name="address" value={shippingInfo.address} onChange={handleInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">শহর</label>
              <input type="text" name="city" value={shippingInfo.city} onChange={handleInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">পোস্টাল কোড</label>
              <input type="text" name="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-semibold">ফোন নম্বর</label>
              <input type="text" name="phoneNo" value={shippingInfo.phoneNo} onChange={handleInputChange} className="w-full p-2 border rounded" required />
            </div>
          </div>
           <div className="mt-8 flex justify-end">
            <button type="submit" className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700">
              পেমেন্ট পেইজে যান
            </button>
          </div>
        </form>
        {/* Order Summary */}
        <div className="bg-white p-6 rounded-lg shadow-md h-fit">
          <h2 className="text-2xl font-bold mb-4">অর্ডার সারাংশ</h2>
          <div className="space-y-2 mb-4">
            {cartItems.map(item => (
                <div key={item._id} className="flex justify-between text-sm">
                    <span>{item.name} x {item.qty}</span>
                    <span>৳ {(item.price * item.qty).toFixed(2)}</span>
                </div>
            ))}
          </div>
          <div className="flex justify-between font-bold text-xl border-t pt-2">
            <span>মোট</span>
            <span>৳ {total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}