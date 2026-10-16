import { Pipe, PipeTransform } from '@angular/core';
import { precioConIgv } from '../modelos/producto';

@Pipe({ name: 'precioConIgv', standalone: true })
export class PrecioConIgvPipe implements PipeTransform {
  transform(precio: number): number {
    return precioConIgv(precio);
  }
}
