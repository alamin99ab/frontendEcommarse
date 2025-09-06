"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { FiMapPin, FiPhone, FiMail, FiUser, FiArrowRight } from 'react-icons/fi';
import toast from 'react-hot-toast';

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

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/checkout');
    }
    const savedAddress = localStorage.getItem('shippingInfo');
    if (savedAddress) {
      setShippingInfo(JSON.parse(savedAddress));
    }
  }, [user, router]);

  const handleInputChange = (e) => {
    setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode || !shippingInfo.phoneNo) {
      toast.error('দয়া করে সকল তথ্য পূরণ করুন।');
      return;
    }
    localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    router.push('/payment');
  };
  
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  if (!user) {
    return <p className="text-center p-8">Redirecting to login...</p>;
  }

  return (
    <div className="min-h-screen bg-white"> {/* ✅ সাদা ব্যাকগ্রাউন্ড */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Shipping Information Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 border-b pb-4">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">নাম</label>
                  <div className="relative">
                    <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      value={user.name} 
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50" 
                      readOnly 
                    />
                  </div>
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">ইমেইল</label>
                  <div className="relative">
                    <FiMail className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="email" 
                      value={user.email} 
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg bg-gray-50" 
                      readOnly 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">ঠিকানা</label>
                <div className="relative">
                  <FiMapPin className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    name="address" 
                    value={shippingInfo.address} 
                    onChange={handleInputChange} 
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">শহর</label>
                  <input 
                    type="text" 
                    name="city" 
                    value={shippingInfo.city} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    required 
                  />
                </div>
                <div>
                  <label className="block mb-2 font-semibold text-gray-700">পোস্টাল কোড</label>
                  <input 
                    type="text" 
                    name="postalCode" 
                    value={shippingInfo.postalCode} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    required 
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-gray-700">ফোন নম্বর</label>
                <div className="relative">
                  <FiPhone className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="tel" 
                    name="phoneNo" 
                    value={shippingInfo.phoneNo} 
                    onChange={handleInputChange} 
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg" 
                    required 
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  type="submit" 
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center"
                >
                  <span>Continue to Payment</span>
                  <FiArrowRight className="ml-2" />
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <h2 className="text-2xl font-bold mb-4 border-b pb-4">Order Summary ({totalItems} items)</h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">৳ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>Total</span>
                <span>৳ {subtotal.toFixed(2)}</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
