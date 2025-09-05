"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast'; // নতুন ইমপোর্ট

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cartItems');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateLocalStorage = (items) => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item._id === product._id);
      let newItems;
      if (exist) {
        newItems = prevItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...product, qty: 1 }];
      }
      updateLocalStorage(newItems);
      return newItems;
    });
    // alert এর পরিবর্তে toast.success ব্যবহার করা হয়েছে
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item._id !== productId);
      updateLocalStorage(newItems);
      toast.error('পণ্যটি কার্ট থেকে সরানো হয়েছে।'); // এখানেও toast ব্যবহার করা হলো
      return newItems;
    });
  };

  const updateQuantity = (productId, qty) => {
    setCartItems(prevItems => {
      let newItems;
      if (qty < 1) {
        newItems = prevItems.filter(item => item._id !== productId);
      } else {
        newItems = prevItems.map(item =>
          item._id === productId ? { ...item, qty } : item
        );
      }
      updateLocalStorage(newItems);
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}