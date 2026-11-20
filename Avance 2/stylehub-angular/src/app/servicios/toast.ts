import { Injectable, signal } from '@angular/core';

export type TipoToast = 'success' | 'danger' | 'info';

export interface Toast {
  id: number;
  texto: string;
  tipo: TipoToast;
}

@Injectable({ providedIn: 'root' })
export class ToastServicio {
  private contador = 0;
  readonly toasts = signal<Toast[]>([]);

  mostrar(texto: string, tipo: TipoToast = 'success'): void {
    const id = ++this.contador;
    this.toasts.update((lista) => [...lista, { id, texto, tipo }]);
    setTimeout(() => this.cerrar(id), 3000);
  }

  cerrar(id: number): void {
    this.toasts.update((lista) => lista.filter((t) => t.id !== id));
  }
}
