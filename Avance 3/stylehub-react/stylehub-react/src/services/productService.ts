// Servicio con FETCH API (lectura de productos)
import type { Product } from '../types';
import { API_URL } from './http';

export async function getProducts(): Promise<Product[]> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}/products`);
  } catch {
    throw new Error('No se pudo conectar con la API. ¿Ejecutaste "npm run start"?');
  }
  if (!res.ok) throw new Error(`Error ${res.status} al cargar los productos`);
  return res.json() as Promise<Product[]>;
}

export async function getOffers(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products?discount_gte=1&_sort=discount&_order=desc`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar las ofertas`);
  return res.json() as Promise<Product[]>;
}

// "Resource" para el hook use() de React 19: la promesa se crea una sola vez
let offersPromise: Promise<Product[]> | null = null;

export function offersResource(): Promise<Product[]> {
  offersPromise ??= getOffers().catch(() => [] as Product[]);
  return offersPromise;
}

export function resetOffersResource(): void {
  offersPromise = null;
}
