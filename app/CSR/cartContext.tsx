// app/CSR/cartContext.tsx
'use client';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import type { ArticleType } from '../lib/types';

type CartContextType = {
  cart: ArticleType[];
  addItem: (item: ArticleType) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;

  // shipping modal controls
  shippingOpen: boolean;
  openShipping: () => void;
  closeShipping: () => void;
  toggleShipping: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ArticleType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // shipping modal state
  const [shippingOpen, setShippingOpen] = useState(false);

  // load cart from localStorage (client only) - deterministic initial render
  useEffect(() => {
    try {
      const raw = localStorage.getItem('cart');
      if (raw) setCart(JSON.parse(raw));
    } catch (err) {
      console.warn('Failed to load cart from localStorage', err);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch {}
  }, [cart]);

  const addItem = useCallback((item: ArticleType) => setCart((prev) => [...prev, item]), []);
  const removeItem = useCallback((id: string) => setCart((prev) => prev.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setCart([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  const openShipping = useCallback(() => setShippingOpen(true), []);
  const closeShipping = useCallback(() => setShippingOpen(false), []);
  const toggleShipping = useCallback(() => setShippingOpen((v) => !v), []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        clear,
        isOpen,
        open,
        close,
        toggle,
        shippingOpen,
        openShipping,
        closeShipping,
        toggleShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
