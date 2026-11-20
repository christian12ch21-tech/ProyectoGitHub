import axios from 'axios';

export const API_URL = 'http://localhost:3001';

// Cliente Axios compartido (se usa en usuarios, pedidos y CRUD del admin)
export const http = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export function errorMessage(e: unknown): string {
  if (axios.isAxiosError(e)) {
    return e.code === 'ERR_NETWORK'
      ? 'No se pudo conectar con la API. ¿Ejecutaste "npm run start"?'
      : e.message;
  }
  return e instanceof Error ? e.message : 'Error inesperado';
}
