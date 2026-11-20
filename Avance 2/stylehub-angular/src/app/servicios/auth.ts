import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, switchMap, throwError } from 'rxjs';
import type { Sesion, Usuario } from '../modelos/usuario';
import { guardarLocal, leerLocal } from './almacenamiento';
import { UsuariosApi } from './usuarios-api';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly api = inject(UsuariosApi);
  readonly sesion = signal<Sesion | null>(
    leerLocal<Sesion | null>('sesionStyleHub', null),
  );
  readonly esAdmin = computed(() => this.sesion()?.rol === 'admin');

  iniciarSesion(email: string, password: string): Observable<Sesion> {
    return this.api.buscarPorEmail(email.trim()).pipe(
      map((lista) => {
        const usuario = lista.find((u) => u.password === password);
        if (!usuario) throw new Error('Correo o contraseña incorrectos');
        const sesion: Sesion = {
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol,
        };
        this.sesion.set(sesion);
        guardarLocal('sesionStyleHub', sesion);
        return sesion;
      }),
    );
  }

  registrar(nombre: string, email: string, password: string): Observable<Usuario> {
    const correo = email.trim().toLowerCase();
    return this.api.buscarPorEmail(correo).pipe(
      switchMap((existentes) =>
        existentes.length > 0
          ? throwError(() => new Error('Ya existe una cuenta con ese correo'))
          : this.api.crear({ nombre: nombre.trim(), email: correo, password, rol: 'cliente' }),
      ),
    );
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    localStorage.removeItem('sesionStyleHub');
  }
}
