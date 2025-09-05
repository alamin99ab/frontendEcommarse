"use client";
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

// Coin Icon SVG Component
const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
);

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div>
          <Link href="/" className="text-2xl font-bold text-green-600">
            GramRoot Foods
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/products" className="text-gray-600 hover:text-green-600">সকল পণ্য</Link>
          
          {user ? (
            <>
              {/* Coin Balance Display */}
              <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 font-semibold px-3 py-1 rounded-full">
                <CoinIcon />
                <span>{user.coinBalance || 0}</span>
              </div>

              {/* Conditional Dashboard Links */}
              {user.role === 'admin' && (
                <Link href="/dashboard/admin" className="text-red-600 font-semibold hover:underline">
                  অ্যাডমিন প্যানেল
                </Link>
              )}
              {user.role === 'seller' && (
                <Link href="/dashboard/seller" className="text-green-700 font-semibold hover:underline">
                  সেলার ড্যাশবোর্ড
                </Link>
              )}
              
              <Link href="/profile" className="text-gray-700 hover:text-green-600 font-semibold">
                আমার প্রোফাইল
              </Link>
              <button onClick={logout} className="text-gray-600 hover:text-green-600">লগআউট</button>
            </>
          ) : (
            <Link href="/login" className="text-gray-600 hover:text-green-600">লগইন</Link>
          )}

          <Link href="/cart" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            কার্ট
          </Link>
        </div>
      </nav>
    </header>
  );
}