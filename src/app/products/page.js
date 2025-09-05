import ProductList from "@/components/ProductList";

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        আমাদের সকল পণ্য
      </h1>
      <ProductList />
    </div>
  );
}