import { CurrencyPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { precioFinal, type Producto } from '../modelos/producto';
import { mensajeHttp } from '../servicios/mensaje-http';
import { ProductosApi } from '../servicios/productos-api';
import { ToastServicio } from '../servicios/toast';

@Component({
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule],
  templateUrl: './admin.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Admin implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ProductosApi);
  private readonly toast = inject(ToastServicio);
  private readonly destroyRef = inject(DestroyRef);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly guardando = signal(false);
  readonly error = signal('');
  readonly editandoId = signal<string | null>(null);
  readonly pendiente = signal<Producto | null>(null);
  protected readonly precioFinal = precioFinal;

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    talla: ['', [Validators.required]],
    imagen: ['', [Validators.required]],
    stock: [0, [Validators.required, Validators.min(0)]],
    categoria: ['', [Validators.required]],
    descuento: [0, [Validators.required, Validators.min(0), Validators.max(90)]],
  });

  ngOnInit(): void {
    this.cargar();
  }

  invalido(campo: keyof typeof this.form.controls): boolean {
    const c = this.form.controls[campo];
    return c.invalid && (c.touched || c.dirty);
  }

  cargar(): void {
    this.cargando.set(true);
    this.api
      .listar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (l) => {
          this.productos.set(l);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(mensajeHttp(e));
          this.cargando.set(false);
        },
      });
  }

  editar(p: Producto): void {
    this.editandoId.set(p.id);
    const { id: _id, ...datos } = p;
    this.form.reset(datos);
  }

  cancelar(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', precio: 0, talla: '', imagen: '', stock: 0, categoria: '', descuento: 0 });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set('');
    const datos = this.form.getRawValue();
    const id = this.editandoId();
    const peticion = id ? this.api.reemplazar(id, datos) : this.api.crear(datos);
    peticion.pipe(finalize(() => this.guardando.set(false))).subscribe({
      next: () => {
        this.toast.mostrar(id ? 'Producto actualizado' : 'Producto creado');
        this.cancelar();
        this.cargar();
      },
      error: (e) => this.error.set(mensajeHttp(e)),
    });
  }

  confirmarEliminar(): void {
    const p = this.pendiente();
    if (!p) return;
    this.api.eliminar(p.id).subscribe({
      next: () => {
        this.toast.mostrar(`Se eliminó ${p.nombre}`, 'info');
        this.pendiente.set(null);
        this.cargar();
      },
      error: (e) => {
        this.error.set(mensajeHttp(e));
        this.pendiente.set(null);
      },
    });
  }
}
