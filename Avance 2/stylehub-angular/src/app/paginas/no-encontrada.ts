import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="h3">Página no encontrada</h1>
    <p>La dirección que buscas no existe.</p>
    <a routerLink="/" class="btn btn-sh">Volver al catálogo</a>
  `,
})
export class NoEncontrada {}
