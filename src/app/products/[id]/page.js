async function getProductById(productId) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`, { 
      cache: 'no-store' 
    });

    if (!res.ok) {
      console.error('Failed to fetch product, status:', res.status);
      return null; // পণ্য না পাওয়া গেলে null রিটার্ন করা
    }
    return res.json();
  } catch (error) {
    console.error('Error in getProductById:', error);
    return null;
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProductById(params.id);

  if (!product) {
    return (
      <div className="container mx-auto py-10 text-center">
        <h1 className="text-3xl font-bold">দুঃখিত, পণ্যটি খুঁজে পাওয়া যায়নি।</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div>
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
          <p className="text-gray-600 text-lg mb-6">{product.description}</p>
          <p className="text-3xl font-bold text-green-600 mb-6">৳ {product.price}</p>
          <button className="w-full md:w-auto bg-green-600 text-white px-8 py-3 rounded-md text-lg hover:bg-green-700 transition-colors">
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}