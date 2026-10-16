import { effect, Injectable, signal } from '@angular/core';
import { guardarLocal, leerLocal } from './almacenamiento';

@Injectable({ providedIn: 'root' })
export class WishlistServicio {
  readonly ids = signal<string[]>(leerLocal<string[]>('wishlistStyleHub', []));

  constructor() {
    effect(() => guardarLocal('wishlistStyleHub', this.ids()));
  }

  esFavorito(id: string): boolean {
    return this.ids().includes(id);
  }

  alternar(id: string): boolean {
    const agregado = !this.esFavorito(id);
    this.ids.update((lista) =>
      agregado ? [...lista, id] : lista.filter((x) => x !== id),
    );
    return agregado;
  }
}
