'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  //初回のレンダリング時にローカルストレージからカート情報を読み込む
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cartItems');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart items from localStorage", error);
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
          item._id === product._id ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      } else {
        newItems = [...prevItems, { ...product, qty: 1 }];
      }
      updateLocalStorage(newItems);
      return newItems;
    });
    toast.success(`${product.name} কার্টে যোগ করা হয়েছে!`);
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item._id !== productId);
      updateLocalStorage(newItems);
      toast.error('পণ্যটি কার্ট থেকে সরানো হয়েছে।');
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
    toast.success('কার্ট খালি করা হয়েছে।');
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}