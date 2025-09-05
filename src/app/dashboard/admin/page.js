// src/app/dashboard/admin/page.js
"use client";
import { useAuth } from '@/context/AuthContext';

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">স্বাগতম, অ্যাডমিন {user?.name}!</h1>
      <p className="text-gray-600 mb-8">এখান থেকে আপনি সম্পূর্ণ ওয়েবসাইটটি পরিচালনা করতে পারবেন।</p>
      
      {/* পরিসংখ্যান কার্ড */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">মোট ব্যবহারকারী</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">০</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">মোট আয়</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">৳ ০</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">মোট পণ্য</h3>
          <p className="text-3xl font-bold text-purple-600 mt-2">০</p>
        </div>
         <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-xl font-semibold">মোট অর্ডার</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">০</p>
        </div>
      </div>
    </div>
  );
}