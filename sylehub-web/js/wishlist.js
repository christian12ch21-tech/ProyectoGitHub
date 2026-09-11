import { obtenerProductoPorId, Producto } from "./productos.js";

// Cargar wishlist guardada y reconstruirla como objetos Producto reales
const wishlistGuardada = JSON.parse(localStorage.getItem("wishlistStyleHub")) || [];
export let wishlist = wishlistGuardada.map(
    (p) => new Producto(p.id, p.nombre, p.precio, p.talla, p.imagen, p.stock, p.categoria, p.descuento || 0)
);

function guardarWishlist() {
    localStorage.setItem("wishlistStyleHub", JSON.stringify(wishlist));
}

export function alternarFavorito(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return { exito: false, mensaje: "Producto no encontrado" };

    const yaExiste = wishlist.find((p) => p.id === id);

    if (yaExiste) {
        wishlist = wishlist.filter((p) => p.id !== id);
        guardarWishlist();
        return { exito: true, mensaje: `${producto.nombre} quitado de favoritos`, enWishlist: false };
    } else {
        wishlist.push(producto);
        guardarWishlist();
        return { exito: true, mensaje: `${producto.nombre} agregado a favoritos`, enWishlist: true };
    }
}

export function esFavorito(id) {
    return wishlist.some((p) => p.id === id);
}

export function obtenerWishlist() {
    return wishlist;
}