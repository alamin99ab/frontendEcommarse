import Link from 'next/link';
import Image from 'next/image';
import ProductActions from './ProductActions'; // ProductActions কম্পোনেন্ট ইমপোর্ট করুন

const ProductCard = ({ product }) => {
  if (!product) return null;

  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const imageUrl = (product.images && product.images[0]) || 'https://placehold.co/250x250.png';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full relative">
      {/* Product Status & Discount Badges */}
      <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
        {product.isBestSeller && <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Best Seller</span>}
        {product.isNew && <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>}
      </div>
      {discount > 0 && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </div>
      )}

      <Link href={`/products/${product._id}`} className="block h-48 relative overflow-hidden group">
        <Image 
          src={imageUrl} 
          alt={product.name || 'Product Image'} 
          fill={true}
          // Console warning ঠিক করার জন্য sizes প্রপার্টি যোগ করা হয়েছে
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="text-yellow-400">{'★'.repeat(Math.round(product.rating || 0))}</span>
          <span className="text-gray-300">{'★'.repeat(5 - Math.round(product.rating || 0))}</span>
          <span className="ml-2">({product.numReviews || 0} reviews)</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2 h-14 overflow-hidden">
          <Link href={`/products/${product._id}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline my-3">
          <span className="text-xl font-bold text-gray-900">৳{product.price?.toFixed(2) || '0.00'}</span>
          {discount > 0 && (
            <span className="ml-2 text-sm text-gray-500 line-through">৳{product.oldPrice.toFixed(2)}</span>
          )}
        </div>

        {/* ★★★ সমাধান এখানে ★★★ */}
        {/* ProductActions কম্পোনেন্ট ব্যবহার করা হয়েছে, যা addToCart ফাংশন কল করবে */}
        <div className="mt-auto">
            <ProductActions product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;