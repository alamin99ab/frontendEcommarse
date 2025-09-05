// src/app/dashboard/admin/layout.js
"use client";

import Link from 'next/link';
import AdminRoute from '@/components/auth/AdminRoute';

export default function AdminDashboardLayout({ children }) {
  return (
    <AdminRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-900 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">অ্যাডমিন প্যানেল</h2>
          <nav>
            <ul>
              <li className="mb-4">
                <Link href="/dashboard/admin" className="hover:text-teal-400">ড্যাশবোর্ড</Link>
              </li>
              {/* নতুন লিঙ্কটি এখানে যোগ করা হয়েছে */}
              <li className="mb-4">
                <Link href="/dashboard/admin/applications" className="hover:text-teal-400">আবেদন ম্যানেজ</Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/admin/users" className="hover:text-teal-400">ব্যবহারকারী ম্যানেজ</Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/admin/categories" className="hover:text-teal-400">ক্যাটাগরি ম্যানেজ</Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/admin/products" className="hover:text-teal-400">পণ্য ম্যানেজ</Link>
              </li>
              <li className="mb-4">
                <Link href="/dashboard/admin/orders" className="hover:text-teal-400">অর্ডার ম্যানেজ</Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-8 bg-gray-100">
          {children}
        </main>
      </div>
    </AdminRoute>
  );
}