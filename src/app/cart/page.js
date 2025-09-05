// src/app/cart/page.js
"use client";
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">আপনার শপিং কার্ট</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 text-xl">আপনার কার্ট খালি।</p>
          <Link href="/products" className="mt-4 inline-block bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            কেনাকাটা শুরু করুন
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center justify-between p-4 mb-4 bg-white rounded-lg shadow-md">
                <div className="flex items-center">
                  <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
                  <div>
                    <h2 className="font-semibold text-lg">{item.name}</h2>
                    <p className="text-gray-600">৳ {item.price}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-16 text-center border rounded mx-4"
                    min="1"
                  />
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                    সরান
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-2xl font-bold mb-4">সর্বমোট</h2>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>৳ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-xl border-t pt-2">
              <span>Total</span>
              <span>৳ {total.toFixed(2)}</span>
            </div>
            <Link href="/checkout" className="w-full">
              <button 
                disabled={cartItems.length === 0}
                className="w-full mt-6 bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 disabled:bg-gray-400"
              >
                চেকআউট করুন
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}