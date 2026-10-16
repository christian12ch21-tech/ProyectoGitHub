import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TarjetaProducto } from '../componentes/tarjeta-producto';
import { precioFinal, type Producto } from '../modelos/producto';
import { CarritoServicio } from '../servicios/carrito';
import { mensajeHttp } from '../servicios/mensaje-http';
import { ProductosApi } from '../servicios/productos-api';
import { ToastServicio } from '../servicios/toast';
import { WishlistServicio } from '../servicios/wishlist';

@Component({
  standalone: true,
  imports: [FormsModule, TarjetaProducto],
  templateUrl: './catalogo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Catalogo implements OnInit {
  private readonly api = inject(ProductosApi);
  private readonly carrito = inject(CarritoServicio);
  private readonly toast = inject(ToastServicio);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly wishlist = inject(WishlistServicio);

  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(true);
  readonly error = signal('');
  readonly buscar = signal('');
  readonly categoria = signal('todos');
  readonly orden = signal('');

  readonly categorias = computed(() => [
    ...new Set(this.productos().map((p) => p.categoria)),
  ]);

  readonly filtrados = computed(() => {
    const texto = this.buscar().trim().toLowerCase();
    const cat = this.categoria();
    let lista = this.productos().filter(
      (p) =>
        (cat === 'todos' || p.categoria === cat) &&
        p.nombre.toLowerCase().includes(texto),
    );
    switch (this.orden()) {
      case 'precio-asc':
        lista = [...lista].sort((a, b) => precioFinal(a) - precioFinal(b));
        break;
      case 'precio-desc':
        lista = [...lista].sort((a, b) => precioFinal(b) - precioFinal(a));
        break;
      case 'nombre':
        lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
    }
    return lista;
  });

  readonly ofertas = computed(() => this.productos().filter((p) => p.descuento > 0));
  readonly favoritos = computed(() =>
    this.productos().filter((p) => this.wishlist.ids().includes(p.id)),
  );

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.error.set('');
    this.api
      .listar()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (lista) => {
          this.productos.set(lista);
          this.cargando.set(false);
        },
        error: (e) => {
          this.error.set(mensajeHttp(e));
          this.cargando.set(false);
        },
      });
  }

  agregar(producto: Producto): void {
    const r = this.carrito.agregar(producto);
    this.toast.mostrar(r.mensaje, r.exito ? 'success' : 'danger');
  }

  alternarFavorito(producto: Producto): void {
    const agregado = this.wishlist.alternar(producto.id);
    this.toast.mostrar(
      agregado ? 'Agregado a favoritos' : 'Quitado de favoritos',
      'info',
    );
  }
}
