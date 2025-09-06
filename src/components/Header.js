"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
// react-icons থেকে আইকনগুলো ইমপোর্ট করা হচ্ছে
import { FiUser, FiLogIn, FiLogOut, FiShoppingCart, FiGrid, FiBriefcase } from 'react-icons/fi';

export default function Header() {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  
  const cartItemCount = cartItems.reduce((count, item) => count + item.qty, 0);

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <div>
          <Link href="/" className="text-2xl font-bold text-green-600">
            GramRoot Foods
          </Link>
        </div>

        {/* Navigation Links and Icons */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-gray-600">
          {/* Products Link */}
          <Link href="/products" className="hover:text-green-600 transition-colors flex items-center space-x-2">
            <FiGrid className="h-5 w-5" />
            <span className="hidden sm:inline">সকল পণ্য</span>
          </Link>

          {/* User Authentication Links */}
          {user ? (
            <>
              {/* Dashboard Links */}
              {user.role === 'admin' && (
                <Link href="/dashboard/admin" className="hover:text-green-600 transition-colors flex items-center space-x-2">
                  <FiBriefcase className="h-5 w-5 text-red-500" />
                  <span className="hidden sm:inline">অ্যাডমিন</span>
                </Link>
              )}
              {user.role === 'seller' && (
                <Link href="/dashboard/seller" className="hover:text-green-600 transition-colors flex items-center space-x-2">
                   <FiBriefcase className="h-5 w-5 text-blue-500" />
                  <span className="hidden sm:inline">ড্যাশবোর্ড</span>
                </Link>
              )}
              
              {/* Profile Link */}
              <Link href="/profile" className="hover:text-green-600 transition-colors flex items-center space-x-2">
                <FiUser className="h-5 w-5" />
                <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
              </Link>

              {/* Logout Button */}
              <button onClick={logout} className="hover:text-green-600 transition-colors flex items-center space-x-2">
                <FiLogOut className="h-5 w-5" />
                <span className="hidden sm:inline">লগআউট</span>
              </button>
            </>
          ) : (
            // Login Link
            <Link href="/login" className="hover:text-green-600 transition-colors flex items-center space-x-2">
              <FiLogIn className="h-5 w-5" />
              <span className="hidden sm:inline">লগইন</span>
            </Link>
          )}

          {/* Cart Link with Badge */}
          <Link href="/cart" className="hover:text-green-600 transition-colors relative">
            <FiShoppingCart className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  );
}