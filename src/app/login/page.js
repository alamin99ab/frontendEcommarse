// src/app/login/page.js
"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // নতুন ইমপোর্ট
import { useRouter } from 'next/navigation'; // নতুন ইমপোর্ট

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useAuth(); // context থেকে login ফাংশন নেওয়া হলো
    const router = useRouter(); // redirect করার জন্য

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.message || 'Login failed');
            }
            
            // Context এর login ফাংশন কল করা হলো
            login(data.user, data.token);
            
            // হোমপেজে redirect করা হলো
            router.push('/');

        } catch (err) {
            setError(err.message);
        }
    };

    // ... বাকি form এর JSX কোড আগের মতোই থাকবে ...
    return (
        <div className="container mx-auto px-6 py-12 flex justify-center">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-2xl font-bold text-center mb-6">Login to Your Account</h1>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 border rounded-lg" required />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 border rounded-lg" required />
                    </div>
                    <div className="flex items-center justify-between">
                        <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">Sign In</button>
                        <Link href="/register" className="inline-block align-baseline font-bold text-sm text-green-600 hover:text-green-800">
                            Create an Account
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}