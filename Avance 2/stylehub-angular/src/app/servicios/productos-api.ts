import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { BorradorProducto, Producto } from '../modelos/producto';
import { API } from './api';

@Injectable({ providedIn: 'root' })
export class ProductosApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API}/productos`;

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }
  obtener(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${encodeURIComponent(id)}`);
  }
  crear(datos: BorradorProducto): Observable<Producto> {
    return this.http.post<Producto>(this.url, datos);
  }
  actualizar(id: string, cambios: Partial<BorradorProducto>): Observable<Producto> {
    return this.http.patch<Producto>(`${this.url}/${encodeURIComponent(id)}`, cambios);
  }
  reemplazar(id: string, datos: BorradorProducto): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}/${encodeURIComponent(id)}`, datos);
  }
  eliminar(id: string): Observable<unknown> {
    return this.http.delete<unknown>(`${this.url}/${encodeURIComponent(id)}`);
  }
}
