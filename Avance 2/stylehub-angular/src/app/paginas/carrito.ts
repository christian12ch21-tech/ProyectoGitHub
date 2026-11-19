import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CarritoServicio } from '../servicios/carrito';
import { ToastServicio } from '../servicios/toast';

@Component({
  standalone: true,
  imports: [CurrencyPipe, FormsModule, RouterLink],
  templateUrl: './carrito.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Carrito {
  protected readonly carrito = inject(CarritoServicio);
  private readonly toast = inject(ToastServicio);
  private readonly router = inject(Router);
  readonly codigo = signal('');

  aplicarCupon(): void {
    const r = this.carrito.aplicarCupon(this.codigo());
    this.toast.mostrar(r.mensaje, r.exito ? 'success' : 'danger');
  }

  finalizar(): void {
    void this.router.navigate(['/checkout']);
  }
}
