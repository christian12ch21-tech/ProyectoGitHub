import { effect, Injectable, signal } from '@angular/core';
import { leerLocal, guardarLocal } from './almacenamiento';

export type Tema = 'claro' | 'oscuro';

@Injectable({ providedIn: 'root' })
export class TemaServicio {
  readonly tema = signal<Tema>(leerLocal<Tema>('temaStyleHub', 'claro'));

  constructor() {
    effect(() => {
      const tema = this.tema();
      document.documentElement.setAttribute(
        'data-bs-theme',
        tema === 'oscuro' ? 'dark' : 'light',
      );
      guardarLocal('temaStyleHub', tema);
    });
  }

  alternar(): void {
    this.tema.update((t) => (t === 'claro' ? 'oscuro' : 'claro'));
  }
}
