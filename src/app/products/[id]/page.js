import Image from 'next/image';
import Link from 'next/link';
import { FiShoppingCart, FiChevronRight } from 'react-icons/fi';

async function getProductDetails(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${id}`, { cache: 'no-store' });
        if(!res.ok) return null;
        const data = await res.json();
        return data.product;
    } catch (error) {
        console.error("Failed to fetch product details:", error);
        return null;
    }
}

export default async function ProductDetailPage({ params }) {
    const product = await getProductDetails(params.id);

    if (!product) {
        return <div className="text-center py-20">দুঃখিত, এই পণ্যটি খুঁজে পাওয়া যায়নি।</div>;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Product Image Gallery */}
                    <div>
                        <div className="relative w-full h-96 rounded-lg overflow-hidden">
                            <Image
                                src={product.imageUrl || 'https://via.placeholder.com/500'}
                                alt={product.name}
                                layout="fill"
                                objectFit="cover"
                                priority
                            />
                        </div>
                        {/* Thumbnail images can be added here */}
                    </div>

                    {/* Product Details and Actions */}
                    <div>
                        <div className="flex items-center text-sm text-gray-500 mb-2">
                            <Link href="/">হোম</Link>
                            <FiChevronRight className="mx-1" />
                            <Link href="/products">প্রোডাক্টস</Link>
                            <FiChevronRight className="mx-1" />
                            <span className="font-semibold text-gray-700">{product.name}</span>
                        </div>
                        
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
                        
                        <div className="flex items-center mb-4">
                            <span className="text-yellow-400">★★★★☆</span>
                            <span className="ml-2 text-gray-600">({product.numReviews || 0} reviews)</span>
                        </div>
                        
                        <p className="text-gray-700 mb-6">{product.description}</p>
                        
                        <div className="mb-6">
                            <span className="text-4xl font-extrabold text-gray-900">৳ {product.price.toFixed(2)}</span>
                            {product.oldPrice && (
                                <span className="ml-3 text-xl text-gray-400 line-through">৳ {product.oldPrice.toFixed(2)}</span>
                            )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <button className="flex items-center justify-center bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105">
                                <FiShoppingCart className="mr-2"/>
                                কার্টে যোগ করুন
                            </button>
                            <button className="bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-gray-300 transition-colors">
                                Wishlist
                            </button>
                        </div>

                        <div className="mt-6 border-t pt-4 text-sm text-gray-600">
                           <p><strong>ক্যাটাগরি:</strong> {product.category?.name || 'N/A'}</p>
                           <p><strong>স্টক:</strong> {product.stock > 0 ? `${product.stock} টি আছে` : 'স্টক আউট'}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}