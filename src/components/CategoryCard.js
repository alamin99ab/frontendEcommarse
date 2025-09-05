// src/components/CategoryCard.js
import Link from 'next/link';

export default function CategoryCard({ category }) {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="bg-white rounded-lg shadow-md p-4 text-center hover:shadow-xl transition-shadow duration-300">
        <img 
          src={category.imageUrl} 
          alt={category.name} 
          className="w-24 h-24 mx-auto mb-4 rounded-full object-cover" 
        />
        <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
      </div>
    </Link>
  );
}