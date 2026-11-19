import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { BorradorUsuario, Usuario } from '../modelos/usuario';
import { API } from './api';

@Injectable({ providedIn: 'root' })
export class UsuariosApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API}/usuarios`;

  buscarPorEmail(email: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.url, { params: { email } });
  }
  crear(datos: BorradorUsuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.url, datos);
  }
}
