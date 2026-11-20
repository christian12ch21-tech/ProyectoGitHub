import { Directive, input } from '@angular/core';

/** Directiva de atributo: resalta en rojo cuando el stock es bajo. */
@Directive({
  selector: '[appStockBajo]',
  standalone: true,
  host: {
    '[class.text-danger]': 'stock() <= 5',
    '[class.fw-bold]': 'stock() <= 5',
  },
})
export class StockBajoDirective {
  readonly stock = input.required<number>({ alias: 'appStockBajo' });
}
