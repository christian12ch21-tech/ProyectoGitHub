import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import type { Pedido } from '../modelos/pedido';
import { Auth } from '../servicios/auth';
import { mensajeHttp } from '../servicios/mensaje-http';
import { PedidosApi } from '../servicios/pedidos-api';

@Component({
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './perfil.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Perfil implements OnInit {
  private readonly api = inject(PedidosApi);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly auth = inject(Auth);

  readonly pedidos = signal<Pedido[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');

  ngOnInit(): void {
    const email = this.auth.sesion()?.email;
    if (!email) return;
    this.api
      .listarPorUsuario(email)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (lista) => {
          this.pedidos.set([...lista].reverse());
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(mensajeHttp(e));
          this.cargando.set(false);
        },
      });
  }
}
