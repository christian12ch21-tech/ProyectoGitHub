import { obtenerSesion, cerrarSesion } from "./auth.js";
import { obtenerPedidosPorUsuario } from "./pedidos.js";

const sesion = obtenerSesion();

// Si no hay sesión, no debería estar aquí
if (!sesion) {
    alert("Debes iniciar sesión primero");
    window.location.href = "login.html";
}

// Mostrar datos del usuario
document.getElementById("perfil-nombre").textContent = sesion.nombre;
document.getElementById("perfil-email").textContent = sesion.email;

// Mostrar historial de pedidos
const cuerpoTabla = document.getElementById("cuerpo-mis-pedidos");
const misPedidos = obtenerPedidosPorUsuario(sesion.email);

if (misPedidos.length === 0) {
    cuerpoTabla.innerHTML = "<tr><td colspan='4'>Aún no tienes pedidos.</td></tr>";
} else {
    misPedidos.forEach((pedido) => {
        const nombresProductos = pedido.items.map((item) => `${item.nombre} x${item.cantidad}`).join(", ");
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${pedido.fecha}</td>
            <td>${nombresProductos}</td>
            <td>S/ ${pedido.total.toFixed(2)}</td>
            <td>${pedido.estado}</td>
        `;
        cuerpoTabla.appendChild(fila);
    });
}

// Cerrar sesión
document.getElementById("btn-cerrar-sesion").addEventListener("click", (e) => {
    e.preventDefault();
    cerrarSesion();
    window.location.href = "index.html";
});
import { inicializarTema } from "./tema.js";
inicializarTema();