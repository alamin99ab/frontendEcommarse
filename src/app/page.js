import Banner from "@/components/Banner";
import CategoryCard from "@/components/CategoryCard";
import ProductCard from "@/components/ProductCard";

async function fetchData(path) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1${path}`, {
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${path}, status: ${res.status}`);
    }
    return res.json();
  } catch (error) {
    console.error(`Error fetching data for ${path}:`, error.message);
    return null; 
  }
}

export default async function HomePage() {
  const [categoriesData, productsData] = await Promise.all([
    fetchData('/categories'),
    fetchData('/products')
  ]);

  // API থেকে আসা অবজেক্ট থেকে আসল অ্যারেগুলো বের করা
  const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData?.categories || [];
  const allProducts = Array.isArray(productsData) ? productsData : productsData?.products || [];

  // এখন allProducts একটি অ্যারে, তাই .slice() কাজ করবে
  const featuredProducts = allProducts.slice(0, 4);

  return (
    <div>
      <Banner />
      <main className="container mx-auto px-6 py-12">
        <section>
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            পণ্যের ক্যাটাগরি
          </h2>
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
              {categories.map(category => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">ক্যাটাগরি পাওয়া যায়নি।</p>
          )}
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            আমাদের বাছাই করা পণ্য
          </h2>
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">কোনো পণ্য পাওয়া যায়নি।</p>
          )}
        </section>
      </main>
    </div>
  );
}