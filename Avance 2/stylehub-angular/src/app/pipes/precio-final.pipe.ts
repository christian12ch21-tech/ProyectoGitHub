import { Pipe, PipeTransform } from '@angular/core';
import { precioFinal, type Producto } from '../modelos/producto';

/** Precio con IGV (18%) y descuento ya aplicados. */
@Pipe({ name: 'precioFinal', standalone: true })
export class PrecioFinalPipe implements PipeTransform {
  transform(producto: Pick<Producto, 'precio' | 'descuento'>): number {
    return precioFinal(producto);
  }
}
