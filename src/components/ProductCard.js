"use client";
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Link href={`/products/${product._id}`}>
        <div>
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/300'} 
            alt={product.name} 
            className="w-full h-48 object-cover" 
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="text-gray-600 mt-1">৳ {product.price}</p>
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button 
          onClick={() => addToCart(product)}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          কার্টে যোগ করুন
        </button>
      </div>
    </div>
  );
}