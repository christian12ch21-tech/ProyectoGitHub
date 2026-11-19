# StyleHub — Angular + API REST (Segundo avance)

Migración del primer avance (JavaScript vanilla) a **Angular 22** con **Bootstrap 5**, **TypeScript** y un back-end **JSON** (`json-server`).

## Cómo ejecutarlo

Necesitas Node.js 22.22.3 o superior (el mismo del Laboratorio 9).

```bash
npm install
npm run api      # Terminal 1: API REST en http://127.0.0.1:3000
npm start        # Terminal 2: app en http://localhost:4200
```

Para restaurar los datos iniciales (25 productos y el admin): `npm run api:reset`

## Cuentas de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | admin@stylehub.com | admin123 |
| Cliente | se crea desde **Crear cuenta** | mín. 6 caracteres |

Cupones: `STYLE10` (10 %), `STYLE20` (20 %), `BIENVENIDO` (15 %).

## Temas del segundo avance y dónde se aplican

| Tema | Dónde |
|---|---|
| Node.js / consola / TypeScript | Scripts `npm`, modelos tipados en `src/app/modelos/` |
| Directivas de atributos | `ngClass` y `ngStyle` en `tarjeta-producto.html`; directiva propia `appStockBajo` (`directivas/`) |
| Directivas estructurales | `@if`, `@for`, `@else` (control flow de Angular) en todas las plantillas |
| Bootstrap | `src/styles.css` (grid, navbar, tablas, formularios, toasts) |
| Componentes | `App` (navbar), `TarjetaProducto`, `Toasts` y una página por ruta |
| Navegación | `app.routes.ts` (rutas lazy, `routerLink`, guards `authGuard` y `adminGuard`, ruta 404) |
| Pipes | `currency`, `date`, `titlecase` + propios: `precioFinal`, `precioConIgv`, `estadoStock` |
| Formularios | Reactivos: login, registro (contraseñas iguales), checkout (teléfono 9 dígitos), admin. Template-driven (`ngModel`): buscador, filtros y cupón |
| Back-end JSON | `api/db.json` con `productos`, `usuarios` y `pedidos` |
| Métodos REST | GET, POST, PUT, PATCH y DELETE en `servicios/*-api.ts` |
| Servicios | `ProductosApi`, `UsuariosApi`, `PedidosApi` (HttpClient) y `Auth`, `CarritoServicio`, `WishlistServicio`, `TemaServicio`, `ToastServicio` |
| Integración | Checkout: valida stock (GET), descuenta stock (PATCH) y registra el pedido (POST); el panel admin hace el CRUD de productos |

## Rutas

`/` catálogo · `/carrito` · `/login` · `/registro` · `/checkout` (requiere sesión) · `/perfil` (requiere sesión) · `/admin` (solo admin)

## Probar la API con Thunder Client / Postman

```
GET    http://127.0.0.1:3000/productos
GET    http://127.0.0.1:3000/productos?categoria=jeans
POST   http://127.0.0.1:3000/productos
PUT    http://127.0.0.1:3000/productos/1
PATCH  http://127.0.0.1:3000/productos/1     { "stock": 20 }
DELETE http://127.0.0.1:3000/productos/1
```
