// src/app/dashboard/admin/applications/page.js
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ManageApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // শুধুমাত্র অপেক্ষমাণ আবেদনগুলো দেখানো হচ্ছে
        setApplications(data.applications.filter(app => app.status === 'pending'));
      }
    } catch (error) {
      console.error("Failed to fetch applications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]);

  const handleUpdateStatus = async (id, status) => {
    if (window.confirm(`আপনি কি নিশ্চিত যে এই আবেদনটি '${status}' করতে চান?`)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/applications/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert(`আবেদন সফলভাবে ${status} করা হয়েছে!`);
          // তালিকা থেকে আবেদনটি সরিয়ে দেওয়া হচ্ছে
          setApplications(prev => prev.filter(app => app._id !== id));
        } else {
          throw new Error(data.message || 'Failed to update status');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">বিক্রেতাদের আবেদন ম্যানেজমেন্ট</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>আবেদন লোড হচ্ছে...</p>
        ) : applications.length > 0 ? (
          <div className="space-y-4">
            {applications.map(app => (
              <div key={app._id} className="p-4 border rounded-lg">
                <p><strong>আবেদনকারীর নাম:</strong> {app.user?.name}</p>
                <p><strong>ইমেইল:</strong> {app.user?.email}</p>
                <p><strong>ব্যবসার নাম:</strong> {app.businessName}</p>
                <p><strong>ঠিকানা:</strong> {app.address}</p>
                <p><strong>ফোন নম্বর:</strong> {app.phoneNo}</p>
                <p><strong>আবেদনের তারিখ:</strong> {new Date(app.createdAt).toLocaleDateString()}</p>
                <div className="mt-4 space-x-4">
                  <button 
                    onClick={() => handleUpdateStatus(app._id, 'approved')}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                  >
                    অনুমোদন করুন
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(app._id, 'rejected')}
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                  >
                    প্রত্যাখ্যান করুন
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>কোনো নতুন আবেদন নেই।</p>
        )}
      </div>
    </div>
  );
}