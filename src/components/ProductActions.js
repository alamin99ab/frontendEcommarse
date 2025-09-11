'use client';

import { useCart } from '@/context/CartContext'; // <-- Path ঠিক করা হয়েছে
import { FiShoppingCart, FiHeart } from 'react-icons/fi'; // Wishlist আইকন যোগ করা হলো

export default function ProductActions({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
    }
  };

  // Wishlist functionality (dummy for now)
  const handleAddToWishlist = () => {
    // এখানে Wishlist এ যোগ করার লজিক যোগ করতে পারেন
    alert(`${product.name} Wishlist-এ যোগ করা হয়েছে! (কার্যকরী নয়)`);
  };

  return (
    <div className="flex items-center space-x-4 mt-4">
      <button
        onClick={handleAddToCart}
        className="flex flex-1 items-center justify-center bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
      >
        <FiShoppingCart className="mr-2" />
        কার্টে যোগ করুন
      </button>
      <button 
        onClick={handleAddToWishlist}
        className="flex items-center justify-center bg-gray-200 text-gray-800 font-semibold p-3 rounded-lg hover:bg-gray-300 transition-colors"
        title="Add to Wishlist"
      >
        <FiHeart />
      </button>
    </div>
  );
}