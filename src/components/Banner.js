// src/components/Banner.js
import Link from 'next/link';

export default function Banner() {
  const bannerStyle = {
    // আপনি এখানে আপনার পছন্দের একটি সুন্দর ছবি ব্যবহার করতে পারেন
    backgroundImage: `url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop')`,
  };

  return (
    <section 
      className="relative bg-cover bg-center h-96 md:h-[500px] flex items-center justify-center text-white" 
      style={bannerStyle}
    >
      {/* Semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          GRAMROOT FOODS
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          গ্রামীণ সজীবতার ডিজিটাল বাজার
        </p>
        <Link 
          href="/products" 
          className="bg-green-600 text-white px-8 py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition-colors"
        >
          এখনই কেনাকাটা করুন
        </Link>
      </div>
    </section>
  );
}