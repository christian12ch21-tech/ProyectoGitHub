import { createContext, useContext, type ReactNode } from 'react';
import type { CartItem, Coupon, Product } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { finalPrice } from '../utils';
import { useToast } from './ToastContext';

interface CartCtx {
  items: CartItem[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: Coupon | null;
  add: (product: Product, size: string) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  applyCoupon: (coupon: Coupon | null) => void;
  clear: () => void;
}

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorage<CartItem[]>('stylehub-cart', []);
  const [coupon, setCoupon] = useLocalStorage<Coupon | null>('stylehub-coupon', null);
  const { showToast } = useToast();

  const add = (product: Product, size: string) => {
    const inCart = items.filter((i) => i.productId === product.id).reduce((s, i) => s + i.quantity, 0);
    if (inCart + 1 > product.stock) {
      showToast(`Solo hay ${product.stock} unidades de ${product.name}`, 'danger');
      return;
    }
    const key = `${product.id}-${size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      // Si ya existe la misma combinación producto + talla, solo suma la cantidad
      if (existing) return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + 1, stock: product.stock } : i));
      return [
        ...prev,
        {
          key,
          productId: product.id,
          name: product.name,
          emoji: product.emoji,
          size,
          unitPrice: finalPrice(product),
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
    showToast(`${product.name} (${size}) agregado al carrito`, 'success');
  };

  const remove = (key: string) => setItems((prev) => prev.filter((i) => i.key !== key));

  const setQuantity = (key: string, quantity: number) => {
    if (quantity < 1) return remove(key);
    setItems((prev) =>
      prev.map((i) => {
        if (i.key !== key) return i;
        if (quantity > i.stock) {
          showToast(`Máximo ${i.stock} unidades`, 'danger');
          return i;
        }
        return { ...i, quantity };
      }),
    );
  };

  const clear = () => {
    setItems([]);
    setCoupon(null);
  };

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = Math.round(items.reduce((s, i) => s + i.unitPrice * i.quantity, 0) * 100) / 100;
  const discount = coupon ? Math.round(subtotal * (coupon.percent / 100) * 100) / 100 : 0;
  const total = Math.round((subtotal - discount) * 100) / 100;

  return (
    <CartContext.Provider
      value={{ items, count, subtotal, discount, total, coupon, add, remove, setQuantity, applyCoupon: setCoupon, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartCtx {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
}
