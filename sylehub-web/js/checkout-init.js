import { obtenerSesion } from "./auth.js";
import { carrito, calcularTotal, vaciarCarrito } from "./carrito.js";
import { crearPedido } from "./pedidos.js";

const sesion = obtenerSesion();

// Si no hay sesión, no debería estar aquí
if (!sesion) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
}

// Si el carrito está vacío, tampoco tiene sentido estar aquí
if (carrito.length === 0) {
    alert("Tu carrito está vacío");
    window.location.href = "index.html";
}

// Mostrar resumen del pedido
const resumenPedido = document.getElementById("resumen-pedido");
const totalCheckout = document.getElementById("total-checkout");

carrito.forEach((item) => {
    const p = document.createElement("p");
    p.textContent = `${item.nombre} x${item.cantidad}`;
    resumenPedido.appendChild(p);
});

totalCheckout.textContent = calcularTotal().toFixed(2);

// Manejar el envío del formulario
const formCheckout = document.getElementById("formulario-checkout");

formCheckout.addEventListener("submit", (e) => {
    e.preventDefault();

    const direccion = document.getElementById("direccion").value;
    const telefono = document.getElementById("telefono").value;
    const metodoPago = document.getElementById("metodo-pago").value;

    const resultado = crearPedido(
        sesion.email,
        carrito,
        calcularTotal(),
        direccion,
        telefono,
        metodoPago
    );

    const errorEl = document.getElementById("error-checkout");

    if (resultado.exito) {
        vaciarCarrito();
        alert("¡Pedido confirmado! Gracias por tu compra.");
        window.location.href = "index.html";
    } else {
        errorEl.textContent = resultado.mensaje;
    }
});
import { inicializarTema } from "./tema.js";
inicializarTema();