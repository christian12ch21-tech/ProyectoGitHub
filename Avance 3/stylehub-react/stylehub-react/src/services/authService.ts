// Servicio con AXIOS (usuarios)
import type { Session, User } from '../types';
import { http } from './http';

function toSession(u: User): Session {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

export async function loginRequest(email: string, password: string): Promise<Session | null> {
  const { data } = await http.get<User[]>('/users', { params: { email, password } });
  return data.length ? toSession(data[0]) : null;
}

export async function registerRequest(name: string, email: string, password: string): Promise<Session> {
  const { data: existing } = await http.get<User[]>('/users', { params: { email } });
  if (existing.length) throw new Error('Ese correo ya está registrado');
  const { data } = await http.post<User>('/users', { name, email, password, role: 'cliente' });
  return toSession(data);
}
