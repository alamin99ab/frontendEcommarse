import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';

// API থেকে ফিচারড প্রোডাক্ট আনার জন্য একটি ফাংশন
async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?limit=8`, { cache: 'no-store' });
    if (!res.ok) {
        // যদি API থেকে ডেটা না আসে, একটি সাধারণ HTTP এরর দেখাবে
        throw new Error(`API request failed with status: ${res.status}`);
    }
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section - Reference Image 1 Inspired */}
      <section className="relative pt-24 pb-16 md:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-white">
        {/* Abstract Background Shapes/Gradients (Optional, for more complex designs) */}
        {/* You can add SVG or div with rounded shapes and blur for a modern look */}
        
        <h1 className="hero-heading font-extrabold text-gray-900 mb-4 animate-slide-in-up" style={{ animationDelay: '100ms', opacity: 0, animationFillMode: 'forwards' }}>
          Discover Amazing <span className="text-purple-600">Products</span>
        </h1>
        <p className="hero-subheading text-gray-600 max-w-2xl mb-8 animate-slide-in-up" style={{ animationDelay: '300ms', opacity: 0, animationFillMode: 'forwards' }}>
          Shop the latest trends with unbeatable prices, fast shipping, and exceptional customer service. Your perfect product is just a click away.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-16 animate-zoom-in" style={{ animationDelay: '500ms', opacity: 0, animationFillMode: 'forwards' }}>
          <Link href="/products" passHref>
            <button className="bg-gradient-to-r from-blue-600 to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              Shop Now 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </Link>
          <Link href="/categories" passHref>
            <button className="bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg shadow-md hover:bg-gray-300 transition-colors duration-300 transform hover:scale-105">
              Browse Categories
            </button>
          </Link>
        </div>

        {/* Value Proposition/Statistics - Reference Image 1 Inspired */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl pt-8 border-t border-gray-100 animate-slide-in-up" style={{ animationDelay: '700ms', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">50K+</h3>
            <p className="text-gray-500 text-sm md:text-base">Happy Customers</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">10K+</h3>
            <p className="text-gray-500 text-sm md:text-base">Products</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">99%</h3>
            <p className="text-gray-500 text-sm md:text-base">Satisfaction</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800">24/7</h3>
            <p className="text-gray-500 text-sm md:text-base">Support</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section - Reference Image 2 Inspired */}
      <section className="container mx-auto px-6 py-16 md:py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
          Featured Products
        </h2>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover our hand-picked selection of premium products with unbeatable prices and quality.
        </p>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, index) => (
              <div 
                key={product._id} 
                className="transform transition-transform duration-300 hover:-translate-y-2 animate-slide-in-up" 
                style={{ animationDelay: `${200 * index}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg py-10">কোনো ফিচারড পণ্য পাওয়া যায়নি।</p>
        )}
        
        <div className="text-center mt-16">
          <Link href="/products" passHref>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-transform duration-300 hover:scale-105">
              সকল পণ্য দেখুন
            </button>
          </Link>
        </div>
      </section>

      {/* Optional: Call to Action / Categories Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16 md:py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">আপনার পছন্দের ক্যাটাগরি খুঁজুন</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            বিভিন্ন ধরনের পণ্যের বিশাল সংগ্রহ থেকে আপনার প্রয়োজন অনুযায়ী পণ্য খুঁজে নিন।
          </p>
          <Link href="/categories" passHref>
            <button className="bg-white text-purple-700 font-semibold py-3 px-8 rounded-lg shadow-lg hover:bg-gray-100 transition-transform duration-300 hover:scale-105">
              সকল ক্যাটাগরি দেখুন
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}