import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, forkJoin, switchMap, throwError } from 'rxjs';
import { Auth } from '../servicios/auth';
import { CarritoServicio } from '../servicios/carrito';
import { mensajeHttp } from '../servicios/mensaje-http';
import { PedidosApi } from '../servicios/pedidos-api';
import { ProductosApi } from '../servicios/productos-api';
import { ToastServicio } from '../servicios/toast';

@Component({
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './checkout.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Checkout {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly productos = inject(ProductosApi);
  private readonly pedidos = inject(PedidosApi);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastServicio);
  protected readonly carrito = inject(CarritoServicio);

  readonly guardando = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    nombre: [this.auth.sesion()?.nombre ?? '', [Validators.required, Validators.minLength(3)]],
    direccion: ['', [Validators.required, Validators.minLength(8)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
    metodoPago: ['tarjeta' as 'tarjeta' | 'yape' | 'plin', [Validators.required]],
  });

  invalido(campo: 'nombre' | 'direccion' | 'telefono'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  confirmar(): void {
    const items = this.carrito.items();
    const sesion = this.auth.sesion();
    if (this.form.invalid || items.length === 0 || !sesion) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    const valores = this.form.getRawValue();

    forkJoin(items.map((i) => this.productos.obtener(i.id)))
      .pipe(
        switchMap((actuales) => {
          const falta = actuales.find((p, idx) => p.stock < items[idx].cantidad);
          if (falta) {
            return throwError(() => new Error(`Stock insuficiente de ${falta.nombre}`));
          }
          return forkJoin(
            actuales.map((p, idx) =>
              this.productos.actualizar(p.id, { stock: p.stock - items[idx].cantidad }),
            ),
          );
        }),
        switchMap(() =>
          this.pedidos.crear({
            usuarioEmail: sesion.email,
            fecha: new Date().toISOString(),
            items,
            cupon: this.carrito.cupon(),
            total: this.carrito.total(),
            nombre: valores.nombre.trim(),
            direccion: valores.direccion.trim(),
            telefono: valores.telefono,
            metodoPago: valores.metodoPago,
          }),
        ),
        finalize(() => this.guardando.set(false)),
      )
      .subscribe({
        next: () => {
          this.carrito.vaciar();
          this.toast.mostrar('¡Compra confirmada!');
          void this.router.navigate(['/perfil']);
        },
        error: (e) => this.error.set(e instanceof Error ? e.message : mensajeHttp(e)),
      });
  }
}
