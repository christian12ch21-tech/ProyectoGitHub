export type Rol = 'admin' | 'cliente';

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

export type BorradorUsuario = Omit<Usuario, 'id'>;

export interface Sesion {
  nombre: string;
  email: string;
  rol: Rol;
}
