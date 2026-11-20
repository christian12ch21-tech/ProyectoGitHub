import { createContext, useContext, type ReactNode } from 'react';
import type { Session } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { loginRequest, registerRequest } from '../services/authService';
import { useToast } from './ToastContext';

interface AuthCtx {
  user: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useLocalStorage<Session | null>('stylehub-session', null);
  const { showToast } = useToast();

  const login = async (email: string, password: string) => {
    const session = await loginRequest(email, password);
    if (!session) return false;
    setUser(session);
    showToast(`Bienvenido, ${session.name}`, 'success');
    return true;
  };

  const register = async (name: string, email: string, password: string) => {
    const session = await registerRequest(name, email, password);
    setUser(session);
    showToast('Cuenta creada correctamente', 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Sesión cerrada', 'info');
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
