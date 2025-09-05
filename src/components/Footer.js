// src/components/Footer.js

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-6 py-4 text-center text-gray-600">
        <p>&copy; {new Date().getFullYear()} GramRoot Foods. সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
}