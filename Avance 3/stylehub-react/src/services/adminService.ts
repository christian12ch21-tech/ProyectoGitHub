// Servicio con AXIOS (CRUD de productos del panel admin)
import type { Product, ProductInput } from '../types';
import { http } from './http';

export async function createProduct(data: ProductInput): Promise<Product> {
  const res = await http.post<Product>('/products', data);
  return res.data;
}

export async function editProduct(id: number, data: ProductInput): Promise<Product> {
  const res = await http.put<Product>(`/products/${id}`, data);
  return res.data;
}

export async function removeProduct(id: number): Promise<void> {
  await http.delete(`/products/${id}`);
}
