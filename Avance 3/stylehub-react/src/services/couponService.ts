// Servicio con ALOVA (validación de cupones de descuento)
import { createAlova } from 'alova';
import adapterFetch from 'alova/fetch';
import type { Coupon } from '../types';
import { API_URL } from './http';

const alovaInstance = createAlova({
  baseURL: API_URL,
  requestAdapter: adapterFetch(),
  cacheFor: null, // sin caché: siempre consulta la API
  responded: async (response) => {
    if (!response.ok) throw new Error(`Error ${response.status} al validar el cupón`);
    return response.json();
  },
});

export async function validateCoupon(code: string): Promise<Coupon | null> {
  const list = await alovaInstance.Get<Coupon[]>('/coupons', {
    params: { code: code.trim().toUpperCase() },
  });
  return list[0] ?? null;
}
