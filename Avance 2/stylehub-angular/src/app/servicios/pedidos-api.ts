import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { BorradorPedido, Pedido } from '../modelos/pedido';
import { API } from './api';

@Injectable({ providedIn: 'root' })
export class PedidosApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API}/pedidos`;

  listarPorUsuario(email: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url, { params: { usuarioEmail: email } });
  }
  listar(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url);
  }
  crear(datos: BorradorPedido): Observable<Pedido> {
    return this.http.post<Pedido>(this.url, datos);
  }
}
