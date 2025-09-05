import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from 'react-hot-toast'; // নতুন ইমপোর্ট

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GramRoot Foods",
  description: "গ্রামীণ সজীবতার ডিজিটাল বাজার",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Toaster position="top-center" /> {/* Toaster এখানে যোগ করা হয়েছে */}
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}