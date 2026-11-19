import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { Toasts } from './componentes/toasts';
import { Auth } from './servicios/auth';
import { CarritoServicio } from './servicios/carrito';
import { TemaServicio } from './servicios/tema';

@Component({
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, Toasts],
  selector: 'app-root',
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly auth = inject(Auth);
  protected readonly carrito = inject(CarritoServicio);
  protected readonly tema = inject(TemaServicio);
  private readonly router = inject(Router);

  salir(): void {
    this.auth.cerrarSesion();
    void this.router.navigate(['/']);
  }
}
