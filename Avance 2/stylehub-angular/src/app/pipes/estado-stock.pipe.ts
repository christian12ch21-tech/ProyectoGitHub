import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'estadoStock', standalone: true })
export class EstadoStockPipe implements PipeTransform {
  transform(stock: number): string {
    if (stock <= 0) return 'Agotado';
    if (stock <= 5) return `¡Solo quedan ${stock}!`;
    return 'Disponible';
  }
}
