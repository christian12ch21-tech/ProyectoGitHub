import {
    productos,
    buscarProductoPorNombre,
    ordenarPorPrecio,
    ordenarPorNombre,
    obtenerCategorias,
    obtenerProductosEnOferta
} from "./productos.js";

import {
    carrito,
    agregarAlCarrito,
    aumentarCantidad,
    disminuirCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    aplicarCupon,
    cuponActivo,
    calcularTotal,
    contarItems
} from "./carrito.js";

import { alternarFavorito, esFavorito, obtenerWishlist } from "./wishlist.js";

const listaProductos = document.getElementById("lista-productos");
const listaOfertas = document.getElementById("lista-ofertas");
const listaFavoritos = document.getElementById("lista-favoritos");
const buscador = document.getElementById("buscador");
const filtroCategoria = document.getElementById("filtro-categoria");
const orden = document.getElementById("orden");

const listaCarrito = document.getElementById("lista-carrito");
const totalCarrito = document.getElementById("total-carrito");
const contadorCarrito = document.getElementById("contador-carrito");
const btnVaciar = document.getElementById("btn-vaciar");
const inputCupon = document.getElementById("input-cupon");
const btnAplicarCupon = document.getElementById("btn-aplicar-cupon");
const mensajeCupon = document.getElementById("mensaje-cupon");

function crearTarjetaHTML(producto) {
    const precioTachado = producto.tieneDescuento()
        ? `<p class="precio-original">S/ ${producto.aplicarIGV().toFixed(2)}</p>`
        : "";
    const badgeDescuento = producto.tieneDescuento()
        ? `<span class="badge-descuento">-${producto.descuento}%</span>`
        : "";

    return `
        ${badgeDescuento}
        <button class="btn-favorito" data-id="${producto.id}">
            ${esFavorito(producto.id) ? "❤️" : "🤍"}
        </button>
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <span class="categoria-tag">${producto.categoria}</span>
        <h3>${producto.nombre}</h3>
        <p>Talla: ${producto.talla}</p>
        ${precioTachado}
        <p class="precio">S/ ${producto.precioFinal().toFixed(2)}</p>
        <button class="btn-agregar" data-id="${producto.id}">Agregar al carrito</button>
    `;
}

function activarBotonesTarjeta(contenedor, listaOriginal) {
    contenedor.querySelectorAll(".btn-agregar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const resultado = agregarAlCarrito(Number(e.target.dataset.id));
            alert(resultado.mensaje);
            renderizarCarrito();
        });
    });

    contenedor.querySelectorAll(".btn-favorito").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            alternarFavorito(Number(e.target.dataset.id));
            renderizarProductos(listaOriginal);
            renderizarOfertas();
            renderizarFavoritos();
        });
    });
}

export function renderizarProductos(lista = productos) {
    listaProductos.innerHTML = "";

    if (lista.length === 0) {
        listaProductos.innerHTML = "<p>No se encontraron productos.</p>";
        return;
    }

    lista.forEach((producto) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");
        tarjeta.innerHTML = crearTarjetaHTML(producto);
        listaProductos.appendChild(tarjeta);
    });

    activarBotonesTarjeta(listaProductos, lista);
}

function llenarCategorias() {
    const categorias = obtenerCategorias();
    categorias.forEach((cat) => {
        if (cat === "todos") return;
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        filtroCategoria.appendChild(option);
    });
}

function aplicarControles() {
    let resultado = productos;

    if (buscador.value.trim() !== "") {
        resultado = buscarProductoPorNombre(buscador.value);
    }

    if (filtroCategoria.value !== "todos") {
        resultado = resultado.filter((p) => p.categoria === filtroCategoria.value);
    }

    if (orden.value === "precio-asc") resultado = ordenarPorPrecio(resultado, true);
    if (orden.value === "precio-desc") resultado = ordenarPorPrecio(resultado, false);
    if (orden.value === "nombre") resultado = ordenarPorNombre(resultado);

    renderizarProductos(resultado);
}

export function renderizarOfertas() {
    const ofertas = obtenerProductosEnOferta();
    listaOfertas.innerHTML = "";

    if (ofertas.length === 0) {
        listaOfertas.innerHTML = "<p>No hay ofertas por el momento.</p>";
        return;
    }

    ofertas.forEach((producto) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");
        tarjeta.innerHTML = crearTarjetaHTML(producto);
        listaOfertas.appendChild(tarjeta);
    });

    activarBotonesTarjeta(listaOfertas, ofertas);
}

export function renderizarFavoritos() {
    const favoritos = obtenerWishlist();
    listaFavoritos.innerHTML = "";

    if (favoritos.length === 0) {
        listaFavoritos.innerHTML = "<p>Aún no tienes productos favoritos. Haz clic en el corazón de un producto para guardarlo aquí.</p>";
        return;
    }

    favoritos.forEach((producto) => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-producto");
        tarjeta.innerHTML = crearTarjetaHTML(producto);
        listaFavoritos.appendChild(tarjeta);
    });

    activarBotonesTarjeta(listaFavoritos, favoritos);
}

export function inicializarCatalogo() {
    llenarCategorias();
    renderizarProductos();
    renderizarOfertas();
    renderizarFavoritos();

    buscador.addEventListener("input", aplicarControles);
    filtroCategoria.addEventListener("change", aplicarControles);
    orden.addEventListener("change", aplicarControles);
}

export function renderizarCarrito() {
    listaCarrito.innerHTML = carrito.length === 0 ? "<p>Tu carrito está vacío.</p>" : "";

    carrito.forEach((item) => {
        const subtotal = item.precioUnitario * item.cantidad;
        const div = document.createElement("div");
        div.classList.add("item-carrito");
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="img-carrito">
            <span class="nombre-carrito">${item.nombre} (Talla ${item.talla})</span>
            <div class="controles-cantidad">
                <button class="btn-menos" data-id="${item.id}">-</button>
                <span>${item.cantidad}</span>
                <button class="btn-mas" data-id="${item.id}">+</button>
            </div>
            <span>S/ ${subtotal.toFixed(2)}</span>
            <button class="btn-eliminar" data-id="${item.id}">🗑</button>
        `;
        listaCarrito.appendChild(div);
    });

    listaCarrito.querySelectorAll(".btn-mas").forEach((btn) =>
        btn.addEventListener("click", (e) => { aumentarCantidad(Number(e.target.dataset.id)); renderizarCarrito(); })
    );
    listaCarrito.querySelectorAll(".btn-menos").forEach((btn) =>
        btn.addEventListener("click", (e) => { disminuirCantidad(Number(e.target.dataset.id)); renderizarCarrito(); })
    );
    listaCarrito.querySelectorAll(".btn-eliminar").forEach((btn) =>
        btn.addEventListener("click", (e) => { eliminarDelCarrito(Number(e.target.dataset.id)); renderizarCarrito(); })
    );

    totalCarrito.textContent = calcularTotal().toFixed(2);
    contadorCarrito.textContent = contarItems();
    mensajeCupon.textContent = cuponActivo ? `Cupón "${cuponActivo.codigo}" aplicado (-${cuponActivo.descuento}% adicional)` : "";
}

export function inicializarCarrito() {
    renderizarCarrito();

    btnVaciar.addEventListener("click", () => {
        if (confirm("¿Vaciar todo el carrito?")) {
            vaciarCarrito();
            renderizarCarrito();
        }
    });

    btnAplicarCupon.addEventListener("click", () => {
        const resultado = aplicarCupon(inputCupon.value);
        mensajeCupon.textContent = resultado.mensaje;
        renderizarCarrito();
    });
}