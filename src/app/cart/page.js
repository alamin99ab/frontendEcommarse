"use client";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import {
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiArrowRight,
} from "react-icons/fi";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const tax = subtotal * 0.08; // Example: 8% tax
  const total = subtotal + tax;

  const EmptyCart = () => (
    <div className="text-center bg-white p-12 rounded-lg shadow-md">
      <FiShoppingCart className="mx-auto h-16 w-16 text-gray-400" />
      <h2 className="mt-4 text-2xl font-bold text-gray-800">
        আপনার শপিং কার্ট খালি
      </h2>
      <p className="mt-2 text-gray-600">এখনো কোনো প্রোডাক্ট যোগ করা হয়নি।</p>
      <div className="mt-6">
        <Link href="/products">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-transform duration-300 hover:scale-105">
            কেনাকাটা শুরু করুন
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Full page white background */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          🛒 Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-4">
                Cart Items ({cartItems.length})
              </h2>
              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between border-b pb-4"
                  >
                    {/* Image + Details */}
                    <div className="flex items-center space-x-4">
                      <Image
                        src={item.imageUrl || "https://via.placeholder.com/100"}
                        alt={item.name}
                        width={100}
                        height={100}
                        className="rounded-lg border"
                      />
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Color: {item.color || "N/A"} | Size:{" "}
                          {item.size || "N/A"}
                        </p>
                        <p className="font-semibold text-blue-600 text-lg">
                          ৳ {item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.qty - 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-l-md transition-colors"
                        >
                          <FiMinus className="h-4 w-4" />
                        </button>
                        <span className="px-4 font-semibold">{item.qty}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item._id, item.qty + 1)
                          }
                          className="p-2 hover:bg-gray-100 rounded-r-md transition-colors"
                        >
                          <FiPlus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                        title="Remove"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                <h2 className="text-2xl font-bold mb-4 border-b pb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">৳ {subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">৳ {tax.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between font-bold text-xl border-t pt-4">
                  <span>Total</span>
                  <span>৳ {total.toFixed(2)}</span>
                </div>
                <Link href="/checkout">
                  <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center">
                    <span>Proceed to Checkout</span>
                    <FiArrowRight className="ml-2" />
                  </button>
                </Link>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Free shipping on orders over ৳2000
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}