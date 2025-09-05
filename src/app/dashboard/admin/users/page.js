"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ManageUsersPage() {
  const { user: adminUser, token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        // নিজের অ্যাকাউন্ট তালিকা থেকে বাদ দেওয়া হচ্ছে
        setUsers(data.users.filter(user => user._id !== adminUser._id));
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'seller' ? 'customer' : 'seller';
    if (window.confirm(`আপনি কি এই ব্যবহারকারীর ভূমিকা পরিবর্তন করে '${newRole}' করতে চান?`)) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('ভূমিকা সফলভাবে পরিবর্তন করা হয়েছে!');
          // তালিকা আপডেট করা হচ্ছে
          setUsers(users.map(user => user._id === userId ? { ...user, role: newRole } : user));
        } else {
          throw new Error(data.message || 'Failed to change role');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই ব্যবহারকারীকে ডিলিট করতে চান?')) {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/users/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success) {
          alert('ব্যবহারকারীকে সফলভাবে ডিলিট করা হয়েছে!');
          // তালিকা থেকে ব্যবহারকারীকে সরানো হচ্ছে
          setUsers(users.filter(user => user._id !== userId));
        } else {
          throw new Error(data.message || 'Failed to delete user');
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">ব্যবহারকারী ম্যানেজমেন্ট</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        {loading ? (
          <p>ব্যবহারকারীদের তালিকা লোড হচ্ছে...</p>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">নাম</th>
                  <th className="text-left p-2">ইমেইল</th>
                  <th className="text-left p-2">ভূমিকা (Role)</th>
                  <th className="text-left p-2">क्रिया</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' ? 'bg-red-200 text-red-800' :
                        user.role === 'seller' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-green-200 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-2">
                      <button 
                        onClick={() => handleRoleChange(user._id, user.role)} 
                        className="text-blue-500 hover:underline mr-4 text-sm"
                      >
                        {user.role === 'seller' ? 'Customer বানান' : 'Seller বানান'}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user._id)} 
                        className="text-red-500 hover:underline text-sm"
                      >
                        ডিলিট
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
        )}
      </div>
    </div>
  );
}