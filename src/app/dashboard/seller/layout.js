// src/app/dashboard/seller/layout.js
"use client";

import Link from 'next/link';
import SellerRoute from '@/components/auth/SellerRoute';

export default function SellerDashboardLayout({ children }) {
  return (
    <SellerRoute>
      <div className="flex min-h-screen">
        {/* সাইডবার */}
        <aside className="w-64 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">সেলার ড্যাশবোর্ড</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <Link href="/dashboard/seller" className="hover:text-green-400">ড্যাশবোর্ড</Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/seller/products" className="hover:text-green-400">আমার পণ্য</Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/seller/orders" className="hover:text-green-400">আমার অর্ডার</Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* প্রধান কন্টেন্ট */}
        <main className="flex-1 p-8 bg-gray-100">
          {children}
        </main>
      </div>
    </SellerRoute>
  );
}