"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PaymentPage() {
    const { cartItems, clearCart } = useCart();
    const { user, token } = useAuth();
    const router = useRouter();

    const [shippingInfo, setShippingInfo] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const savedAddress = localStorage.getItem('shippingInfo');
        if (!savedAddress) {
            router.push('/checkout');
        } else {
            setShippingInfo(JSON.parse(savedAddress));
        }
    }, [router]);

    const handlePlaceOrder = async () => {
        setLoading(true);
        setError('');
        const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

        try {
            if (paymentMethod === 'Cash on Delivery') {
                const orderData = {
                    shippingInfo,
                    orderItems: cartItems.map(item => ({ product: item._id, name: item.name, quantity: item.qty, price: item.price, imageUrl: item.imageUrl, seller: item.seller })),
                    totalPrice: total,
                    paymentMethod: 'Cash on Delivery',
                };
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                    body: JSON.stringify(orderData),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to place order');
                
                alert('আপনার অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!');
                clearCart();
                localStorage.removeItem('shippingInfo');
                router.push('/profile');

            } else if (paymentMethod === 'SSLCOMMERZ') {
                const paymentData = {
                    cartItems: cartItems.map(item => ({
                        product: item._id, // '_id' এর পরিবর্তে 'product' ব্যবহার করা হয়েছে
                        quantity: item.qty,
                    })),
                    shippingInfo,
                    totalPrice: total,
                };
                
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/payment/init`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`},
                    body: JSON.stringify(paymentData),
                });
                const data = await res.json();
                if (data.url) {
                    window.location.replace(data.url);
                } else {
                    throw new Error(data.message || 'Payment initiation failed.');
                }
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!shippingInfo) return <p className="text-center p-8">লোড হচ্ছে...</p>;
    
    return (
        <div className="container mx-auto max-w-lg px-6 py-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">পেমেন্ট পদ্ধতি নির্বাচন করুন</h1>
                <div className="space-y-4">
                    <div className="flex items-center p-4 border rounded-lg cursor-pointer" onClick={() => setPaymentMethod('Cash on Delivery')}>
                        <input type="radio" id="cod" name="paymentMethod" value="Cash on Delivery" checked={paymentMethod === 'Cash on Delivery'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                        <label htmlFor="cod" className="ml-3 font-semibold cursor-pointer">ক্যাশ অন ডেলিভারি (COD)</label>
                    </div>
                    <div className="flex items-center p-4 border rounded-lg cursor-pointer" onClick={() => setPaymentMethod('SSLCOMMERZ')}>
                        <input type="radio" id="sslcommerz" name="paymentMethod" value="SSLCOMMERZ" checked={paymentMethod === 'SSLCOMMERZ'} onChange={(e) => setPaymentMethod(e.target.value)} className="h-4 w-4" />
                        <label htmlFor="sslcommerz" className="ml-3 font-semibold cursor-pointer">অনলাইন পেমেন্ট (SSLCOMMERZ)</label>
                    </div>
                </div>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
                <button
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="w-full mt-6 bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
                >
                    {loading ? 'প্রসেস হচ্ছে...' : (paymentMethod === 'SSLCOMMERZ' ? 'এখন পেমেন্ট করুন' : 'অর্ডার চূড়ান্ত করুন')}
                </button>
            </div>
        </div>
    );
}