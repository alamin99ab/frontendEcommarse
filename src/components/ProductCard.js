import Link from 'next/link';
import Image from 'next/image';

const ProductCard = ({ product }) => {
  if (!product) return null; // Ensure product data exists

  // Calculate discount percentage if oldPrice exists
  const discount = product.oldPrice && product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Placeholder image if product.imageUrl is not available
  const imageUrl = product.imageUrl || 'https://via.placeholder.com/250';

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full relative">
      {/* Product Status (e.g., Best Seller, New, Limited) */}
      {(product.isBestSeller || product.isNew || product.isLimited) && (
        <div className="absolute top-2 left-2 flex flex-wrap gap-1 z-10">
          {product.isBestSeller && <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Best Seller</span>}
          {product.isNew && <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">New</span>}
          {product.isLimited && <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Limited</span>}
        </div>
      )}

      {/* Discount Badge */}
      {discount > 0 && (
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
          -{discount}%
        </div>
      )}

      <Link href={`/products/${product._id}`} className="block h-48 relative overflow-hidden group">
        <Image 
          src={imageUrl} 
          alt={product.name} 
          layout="fill" 
          objectFit="cover" 
          className="transition-transform duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {/* Rating (Dummy for now, can be replaced with actual rating) */}
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <span className="text-yellow-400">★</span> 
          <span className="ml-1">{product.rating || '4.5'}</span> {/* Add actual rating later */}
          <span className="ml-2">({product.numReviews || '200'} reviews)</span> {/* Add actual review count later */}
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          <Link href={`/products/${product._id}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h3>

        <div className="flex items-baseline mb-3">
          <span className="text-xl font-bold text-gray-900">৳ {product.price?.toFixed(2) || '0.00'}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="ml-2 text-sm text-gray-500 line-through">৳ {product.oldPrice.toFixed(2)}</span>
          )}
        </div>

        <button 
          // onClick={() => addToCart(product)} // Add your addToCart function here
          className="mt-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
        >
          কার্টে যোগ করুন
        </button>
      </div>
    </div>
  );
};

export default ProductCard;