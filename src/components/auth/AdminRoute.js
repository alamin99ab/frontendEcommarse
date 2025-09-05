// src/components/auth/AdminRoute.js
"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/'); // যদি অ্যাডমিন না হয়, হোমপেজে পাঠিয়ে দাও
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return <p className="text-center p-8">Loading or Redirecting...</p>;
  }

  return children; // যদি অ্যাডমিন হয়, তাহলে পেইজটি দেখাবে
}