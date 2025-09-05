// src/app/payment/success/page.js
"use client";

import Link from 'next/link';
import { useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function PaymentSuccessPage() {
    const { clearCart } = useCart();

    useEffect(() => {
        // পেমেন্ট সফল হওয়ার পর কার্ট খালি করে দেওয়া হচ্ছে
        clearCart();
        localStorage.removeItem('shippingInfo');
    }, []);

    return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-3xl font-bold text-green-600 mb-4">পেমেন্ট সফল হয়েছে!</h1>
            <p className="text-gray-700 mb-8">আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে।</p>
            <Link href="/profile">
                <button className="bg-green-600 text-white px-6 py-2 rounded-md">আমার অর্ডার দেখুন</button>
            </Link>
        </div>
    );
}