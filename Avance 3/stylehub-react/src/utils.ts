import type { Product } from './types';

export const money = (n: number): string => `S/ ${n.toFixed(2)}`;

export const finalPrice = (p: Pick<Product, 'price' | 'discount'>): number =>
  Math.round(p.price * (1 - p.discount / 100) * 100) / 100;
