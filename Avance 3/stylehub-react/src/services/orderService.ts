// Servicio con AXIOS (pedidos y stock)
import type { Order } from '../types';
import { http } from './http';

export async function createOrder(order: Order): Promise<Order> {
  const { data } = await http.post<Order>('/orders', order);
  return data;
}

export async function getOrdersByUser(userId: number): Promise<Order[]> {
  const { data } = await http.get<Order[]>('/orders', { params: { userId, _sort: 'id', _order: 'desc' } });
  return data;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data } = await http.get<Order[]>('/orders', { params: { _sort: 'id', _order: 'desc' } });
  return data;
}

export async function updateStock(productId: number, stock: number): Promise<void> {
  await http.patch(`/products/${productId}`, { stock });
}
