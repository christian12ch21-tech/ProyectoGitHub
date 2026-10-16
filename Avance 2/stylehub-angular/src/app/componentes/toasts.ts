import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ToastServicio } from '../servicios/toast';

@Component({
  standalone: true,
  selector: 'app-toasts',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3" aria-live="polite">
      @for (t of servicio.toasts(); track t.id) {
        <div
          class="toast show align-items-center text-white border-0 mb-2"
          [ngClass]="'bg-' + t.tipo"
          role="status"
        >
          <div class="d-flex">
            <div class="toast-body">{{ t.texto }}</div>
            <button
              type="button"
              class="btn-close btn-close-white me-2 m-auto"
              aria-label="Cerrar"
              (click)="servicio.cerrar(t.id)"
            ></button>
          </div>
        </div>
      }
    </div>
  `,
})
export class Toasts {
  protected readonly servicio = inject(ToastServicio);
}
