import ProductList from "@/components/ProductList";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
          Premium Audio Collection
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Discover our curated selection of professional-grade audio equipment,
          designed for audiophiles and professionals alike.
        </p>

        {/* 🔽 এখানে ProductList আসবে */}
        <ProductList />
      </div>
    </div>
  );
}
