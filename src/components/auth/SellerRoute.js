// src/components/auth/SellerRoute.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function SellerRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'seller')) {
      router.push('/'); // যদি সেলার না হয়, হোমপেজে পাঠিয়ে দাও
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'seller') {
    return <p className="text-center p-8">Loading...</p>; // লোডিং বা রিডাইরেক্ট হওয়ার সময় এটি দেখাবে
  }

  return children; // যদি সেলার হয়, তাহলে পেইজটি দেখাবে
}