import { computed, effect, Injectable, signal } from '@angular/core';
import type { Cupon, ItemCarrito } from '../modelos/pedido';
import { precioFinal, type Producto } from '../modelos/producto';
import { guardarLocal, leerLocal } from './almacenamiento';

const CUPONES: Record<string, number> = {
  STYLE10: 10,
  STYLE20: 20,
  BIENVENIDO: 15,
};

export interface Resultado {
  exito: boolean;
  mensaje: string;
}

@Injectable({ providedIn: 'root' })
export class CarritoServicio {
  readonly items = signal<ItemCarrito[]>(
    leerLocal<ItemCarrito[]>('carritoStyleHub', []),
  );
  readonly cupon = signal<Cupon | null>(leerLocal<Cupon | null>('cuponStyleHub', null));

  readonly cantidad = computed(() =>
    this.items().reduce((acc, i) => acc + i.cantidad, 0),
  );
  readonly subtotal = computed(() =>
    this.items().reduce((acc, i) => acc + i.precioUnitario * i.cantidad, 0),
  );
  readonly descuentoCupon = computed(() => {
    const cupon = this.cupon();
    return cupon ? this.subtotal() * (cupon.descuento / 100) : 0;
  });
  readonly total = computed(() => this.subtotal() - this.descuentoCupon());

  constructor() {
    effect(() => guardarLocal('carritoStyleHub', this.items()));
    effect(() => guardarLocal('cuponStyleHub', this.cupon()));
  }

  agregar(producto: Producto): Resultado {
    if (producto.stock <= 0) {
      return { exito: false, mensaje: `${producto.nombre} está agotado` };
    }
    const existente = this.items().find((i) => i.id === producto.id);
    if (existente) {
      if (existente.cantidad >= producto.stock) {
        return { exito: false, mensaje: `No hay más stock de ${producto.nombre}` };
      }
      this.cambiarCantidad(producto.id, 1);
    } else {
      this.items.update((lista) => [
        ...lista,
        {
          id: producto.id,
          nombre: producto.nombre,
          talla: producto.talla,
          imagen: producto.imagen,
          precioUnitario: precioFinal(producto),
          cantidad: 1,
          stock: producto.stock,
        },
      ]);
    }
    return { exito: true, mensaje: `${producto.nombre} agregado al carrito` };
  }

  cambiarCantidad(id: string, delta: number): void {
    this.items.update((lista) =>
      lista
        .map((i) =>
          i.id === id
            ? { ...i, cantidad: Math.min(i.cantidad + delta, i.stock) }
            : i,
        )
        .filter((i) => i.cantidad > 0),
    );
  }

  eliminar(id: string): void {
    this.items.update((lista) => lista.filter((i) => i.id !== id));
  }

  vaciar(): void {
    this.items.set([]);
    this.cupon.set(null);
  }

  aplicarCupon(codigo: string): Resultado {
    const limpio = codigo.trim().toUpperCase();
    if (!limpio) return { exito: false, mensaje: 'Ingresa un código de cupón' };
    if (!(limpio in CUPONES)) return { exito: false, mensaje: 'Cupón no válido' };
    const descuento = CUPONES[limpio];
    this.cupon.set({ codigo: limpio, descuento });
    return { exito: true, mensaje: `Cupón aplicado: -${descuento}% adicional` };
  }

  quitarCupon(): void {
    this.cupon.set(null);
  }
}
