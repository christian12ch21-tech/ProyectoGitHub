import { inicializarCatalogo, inicializarCarrito } from "./ui.js";
import { inicializarTema } from "./tema.js";
import { obtenerSesion } from "./auth.js";
import { carrito } from "./carrito.js";

document.addEventListener("DOMContentLoaded", () => {
    inicializarCatalogo();
    inicializarCarrito();
    inicializarTema();

    // ===== Mostrar links según el rol de la sesión =====
    const sesionActual = obtenerSesion();
    const linkLogin = document.getElementById("link-login");
    const linkPerfil = document.getElementById("link-perfil");
    const linkAdmin = document.getElementById("link-admin");

    if (sesionActual) {
        linkLogin.style.display = "none";

        if (sesionActual.rol === "admin") {
            linkPerfil.style.display = "none";
            linkAdmin.style.display = "inline";
        } else {
            linkPerfil.style.display = "inline";
            linkPerfil.textContent = `Hola, ${sesionActual.nombre}`;
            linkAdmin.style.display = "none";
        }
    } else {
        linkLogin.style.display = "inline";
        linkPerfil.style.display = "none";
        linkAdmin.style.display = "none";
    }

    // ===== Botón "Finalizar compra" =====
    const btnCheckout = document.getElementById("btn-checkout");
    btnCheckout.addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío. Agrega productos antes de continuar.");
            return;
        }

        if (!sesionActual) {
            alert("Debes iniciar sesión para continuar con tu compra");
            window.location.href = "login.html";
        } else {
            window.location.href = "checkout.html";
        }
    });
});