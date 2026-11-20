import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { Auth } from '../servicios/auth';
import { mensajeHttp } from '../servicios/mensaje-http';
import { ToastServicio } from '../servicios/toast';

function coinciden(grupo: AbstractControl): ValidationErrors | null {
  const p = grupo.get('password')?.value;
  const c = grupo.get('confirmar')?.value;
  return p === c ? null : { noCoinciden: true };
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastServicio);

  readonly enviando = signal(false);
  readonly error = signal('');
  readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', [Validators.required]],
    },
    { validators: coinciden },
  );

  invalido(campo: 'nombre' | 'email' | 'password' | 'confirmar'): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  crear(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.enviando.set(true);
    this.error.set('');
    const { nombre, email, password } = this.form.getRawValue();
    this.auth
      .registrar(nombre, email, password)
      .pipe(finalize(() => this.enviando.set(false)))
      .subscribe({
        next: () => {
          this.toast.mostrar('Cuenta creada con éxito. Ya puedes iniciar sesión.');
          void this.router.navigate(['/login']);
        },
        error: (e) => this.error.set(e instanceof Error ? e.message : mensajeHttp(e)),
      });
  }
}
