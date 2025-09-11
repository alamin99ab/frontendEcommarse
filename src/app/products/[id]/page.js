import Image from 'next/image';
import ProductActions from '@/components/ProductActions';

// API থেকে নির্দিষ্ট প্রোডাক্টের ডেটা আনার ফাংশন
async function getProductDetails(id) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        // API endpoint চেক করুন, এটি আপনার backend log অনুযায়ী সঠিক
        const res = await fetch(`${apiUrl}/api/v1/products/${id}`, {
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error(`API request for product ${id} failed with status: ${res.status}`);
            return null;
        }

        const data = await res.json();
        return data.product; // আপনার backend এ product অবজেক্টের ভেতরে ডেটা থাকে
    } catch (error) {
        console.error("Failed to fetch product details:", error);
        return null;
    }
}

// কম্পোনেন্টের নাম পরিবর্তন করা হলো যেন কোনো conflict না হয়
export default async function ProductDetailsPage({ params }) {
    // params থেকে id সঠিকভাবে নেওয়া হচ্ছে
    const product = await getProductDetails(params.id);

    if (!product) {
        return <div className="text-center py-20 text-lg text-red-600">দুঃখিত, এই পণ্যটি খুঁজে পাওয়া যায়নি।</div>;
    }

    // ★★★ সঠিক ইমেজ URL ব্যবহার করা হচ্ছে ★★★
    const mainImageUrl = (product.images && product.images.length > 0)
        ? product.images[0] // API response অনুযায়ী সঠিক path
        : 'https://placehold.co/600x600.png'; // সঠিক ফলব্যাক ইমেজ

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 bg-white p-6 md:p-8 rounded-lg shadow-lg">
                
                {/* Product Image Section */}
                <div className="w-full h-80 md:h-96 relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                        src={mainImageUrl}
                        alt={product.name || 'Product Image'}
                        fill
                        className="object-contain" // legacy props সরিয়ে দেওয়া হয়েছে
                    />
                </div>

                {/* Product Details Section */}
                <div className="flex flex-col justify-center">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
                    <p className="text-gray-500 mb-4">
                        ক্যাটেগরি: <strong>{product.category?.name || 'N/A'}</strong>
                    </p>
                    
                    <div className="flex items-center mb-5">
                        <div className="flex text-yellow-400 text-xl">
                            {'★'.repeat(Math.round(product.rating || 4))}
                            {'☆'.repeat(5 - Math.round(product.rating || 4))}
                        </div>
                        <span className="ml-3 text-gray-600">({product.numReviews || 0} রিভিউ)</span>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                    <div className="mb-6">
                        <span className="text-4xl font-bold text-blue-700">৳{product.price?.toFixed(2)}</span>
                        {product.oldPrice && (
                            <span className="ml-4 text-xl text-gray-400 line-through">৳{product.oldPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="mb-6">
                        <span className={`font-semibold px-3 py-1 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.stock > 0 ? `স্টকে ${product.stock}টি আছে` : 'স্টক আউট'}
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    {product.stock > 0 ? (
                        <ProductActions product={product} />
                    ) : (
                        <p className="text-red-500 font-semibold">এই মুহূর্তে পণ্যটি স্টকে নেই।</p>
                    )}
                </div>
            </div>
        </div>
    );
}