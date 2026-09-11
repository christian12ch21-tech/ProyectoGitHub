import { obtenerProductoPorId } from "./productos.js";

export let carrito = JSON.parse(localStorage.getItem("carritoStyleHub")) || [];
export let cuponActivo = JSON.parse(localStorage.getItem("cuponStyleHub")) || null;

const cuponesValidos = {
    "STYLE10": 10,
    "STYLE20": 20,
    "BIENVENIDO": 15
};


function guardarCarrito() {
    localStorage.setItem("carritoStyleHub", JSON.stringify(carrito));
}



function guardarCupon() {
    localStorage.setItem("cuponStyleHub", JSON.stringify(cuponActivo));
}




export function agregarAlCarrito(id) {
    const producto = obtenerProductoPorId(id);
    if (!producto) return { exito: false, mensaje: "Producto no encontrado" };

    const item = carrito.find((p) => p.id === id);

    if (item) {
        if (item.cantidad >= producto.stock) {
            return { exito: false, mensaje: `No hay más stock de ${producto.nombre}` };
        }
        item.cantidad++;
    } else {
        // Guardamos el precio final ya con IGV y descuento aplicado
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            talla: producto.talla,
            imagen: producto.imagen,
            precioUnitario: producto.precioFinal(),
            cantidad: 1
        });
    }

    guardarCarrito();
  
    return { exito: true, mensaje: `${producto.nombre} agregado al carrito` };
}

export function aumentarCantidad(id) {
    const item = carrito.find((p) => p.id === id);
    const producto = obtenerProductoPorId(id);
    if (item.cantidad < producto.stock) {
        item.cantidad++;
    } else {
        alert("No hay más stock disponible");
    }
    guardarCarrito();
}


export function disminuirCantidad(id) {
    const item = carrito.find((p) => p.id === id);
    item.cantidad--;
    if (item.cantidad <= 0) {
        carrito = carrito.filter((p) => p.id !== id);
    }
    guardarCarrito();
}


export function eliminarDelCarrito(id) {
    carrito = carrito.filter((item) => item.id !== id);
    guardarCarrito();
}


export function vaciarCarrito() {
    carrito.length = 0;
    cuponActivo = null;
    guardarCarrito();
    guardarCupon();
}


export function aplicarCupon(codigo) {
    try {
        const codigoLimpio = codigo.trim().toUpperCase();
        if (!codigoLimpio) throw new Error("Ingresa un código de cupón");
        if (!(codigoLimpio in cuponesValidos)) throw new Error("Cupón no válido");

        cuponActivo = { codigo: codigoLimpio, descuento: cuponesValidos[codigoLimpio] };
        guardarCupon();
        return { exito: true, mensaje: `Cupón aplicado: -${cuponActivo.descuento}% adicional` };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}

export function quitarCupon() {
    cuponActivo = null;
    guardarCupon();
}

export function calcularSubtotal() {
    return carrito.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
}

export function calcularTotal() {
    const subtotal = calcularSubtotal();
    if (!cuponActivo) return subtotal;
    return subtotal - subtotal * (cuponActivo.descuento / 100);
}

export function contarItems() {
    return carrito.reduce((acc, item) => acc + item.cantidad, 0);
}



