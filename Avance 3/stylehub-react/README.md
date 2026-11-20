# StyleHub — Avance 3 (React)

Tienda de ropa en **React + TypeScript** para JavaScript Avanzado (Unidad 3, hasta *Servicios en React*).

## Cómo ejecutarlo

```bash
npm install
npm run start     # levanta la API JSON (puerto 3001) y la web (puerto 5173)
```

Abre http://localhost:5173

Cuentas de prueba: `admin@stylehub.com / admin123` · `cliente@stylehub.com / cliente123`
Cupones de prueba: `STYLE10`, `UTP20`, `BLACK30`

## Temario aplicado

| Tema de la unidad | Dónde está |
|---|---|
| Introducción: Vite, JSX, **TSX**, **Bootstrap** | Todo el proyecto (`.tsx`), `main.tsx` importa Bootstrap |
| **Navegación** (React Router) | `App.tsx`, `components/Navbar.tsx`, `ProtectedRoute.tsx` |
| **Componentes** | `components/` (Navbar, ProductCard, OrderCard, OffersStrip, Layout) |
| **Formularios** (React Hook Form + Zod) | `pages/Login`, `Register`, `Checkout`, `Cart` (cupón), `Admin` |
| **State Hooks** (`useState`, `useMemo`, `useEffect`) | `pages/Home.tsx`, `hooks/useProducts.ts`, `hooks/useLocalStorage.ts` |
| **Context Hooks** (`createContext`, `useContext`) | `context/` (Auth, Cart, Wishlist, Toast) |
| **Ref Hooks** (`useRef`) | `pages/Home.tsx` (enfoque del buscador) |
| **Resource Hooks** (`use`, Suspense) | `components/OffersStrip.tsx`, `context/ThemeContext.tsx` |
| **Fetch API** | `services/productService.ts` |
| **Axios** | `services/authService.ts`, `orderService.ts`, `adminService.ts` |
| **Alova** | `services/couponService.ts` |
| Servicios REST con back-end JSON | `db.json` + json-server |

## Funcionalidades

Catálogo con filtros, buscador y orden · ofertas · carrito (producto + talla) con stock · cupones · favoritos ·
login/registro · checkout con validaciones · historial de pedidos · panel admin (CRUD de productos y pedidos) ·
modo oscuro/claro · notificaciones toast.

## Subir a GitHub (dentro del repo compartido ProyectoGitHub)

Copia la carpeta `stylehub-react` dentro de `Avance 3/` del repo y, desde la raíz del repo:

```bash
git pull
git add "Avance 3"
git commit -m "Avance 3: StyleHub en React con hooks, servicios y formularios"
git push
```

> No borres `Avance 2/stylehub-angular`: el proyecto Angular se mantiene.
> `node_modules` y `dist` ya están ignorados por `.gitignore`.
