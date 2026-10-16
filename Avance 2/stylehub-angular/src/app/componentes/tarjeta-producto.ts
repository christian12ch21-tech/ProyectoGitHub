import { CurrencyPipe, NgClass, NgStyle, TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { StockBajoDirective } from '../directivas/stock-bajo.directive';
import type { Producto } from '../modelos/producto';
import { EstadoStockPipe } from '../pipes/estado-stock.pipe';
import { PrecioConIgvPipe } from '../pipes/precio-con-igv.pipe';
import { PrecioFinalPipe } from '../pipes/precio-final.pipe';

@Component({
  standalone: true,
  selector: 'app-tarjeta-producto',
  imports: [
    CurrencyPipe,
    NgClass,
    NgStyle,
    TitleCasePipe,
    StockBajoDirective,
    EstadoStockPipe,
    PrecioConIgvPipe,
    PrecioFinalPipe,
  ],
  templateUrl: './tarjeta-producto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TarjetaProducto {
  readonly producto = input.required<Producto>();
  readonly favorito = input(false);
  readonly agregar = output<Producto>();
  readonly alternarFavorito = output<Producto>();
}
