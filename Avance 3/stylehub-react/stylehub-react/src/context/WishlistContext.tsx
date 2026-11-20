import { createContext, useContext, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from './ToastContext';

interface WishlistCtx {
  ids: number[];
  has: (id: number) => boolean;
  toggle: (id: number, name: string) => void;
}

const WishlistContext = createContext<WishlistCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useLocalStorage<number[]>('stylehub-wishlist', []);
  const { showToast } = useToast();

  const has = (id: number) => ids.includes(id);

  const toggle = (id: number, name: string) => {
    if (ids.includes(id)) {
      setIds((prev) => prev.filter((x) => x !== id));
      showToast(`${name} quitado de favoritos`, 'info');
    } else {
      setIds((prev) => [...prev, id]);
      showToast(`${name} agregado a favoritos`, 'success');
    }
  };

  return <WishlistContext.Provider value={{ ids, has, toggle }}>{children}</WishlistContext.Provider>;
}

export function useWishlist(): WishlistCtx {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist debe usarse dentro de WishlistProvider');
  return ctx;
}
