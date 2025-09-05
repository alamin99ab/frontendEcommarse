// src/app/payment/fail/page.js
import Link from 'next/link';

export default function PaymentFailPage() {
    return (
        <div className="container mx-auto text-center py-20">
            <h1 className="text-3xl font-bold text-red-600 mb-4">পেমেন্ট ব্যর্থ হয়েছে!</h1>
            <p className="text-gray-700 mb-8">কোনো একটি সমস্যার কারণে আপনার পেমেন্ট সম্পন্ন করা যায়নি।</p>
            <Link href="/cart">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md">আবার চেষ্টা করুন</button>
            </Link>
        </div>
    );
}