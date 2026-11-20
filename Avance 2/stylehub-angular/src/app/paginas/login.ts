import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../servicios/auth';
import { mensajeHttp } from '../servicios/mensaje-http';
import { ToastServicio } from '../servicios/toast';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastServicio);

  readonly enviando = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  invalido(campo: 'email' | 'password'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  entrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();
    this.auth
      .iniciarSesion(email, password)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: (s) => {
          this.toast.mostrar(`Bienvenido, ${s.nombre}`);
          void this.router.navigate([s.rol === 'admin' ? '/admin' : '/']);
        },
        error: (e) => this.error.set(e instanceof Error ? e.message : mensajeHttp(e)),
      });
  }
}
