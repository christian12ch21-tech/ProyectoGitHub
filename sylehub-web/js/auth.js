import { validarEmail, validarPassword } from "./validaciones.js";

// ===== Credenciales fijas del administrador =====
const ADMIN_EMAIL = "admin@stylehub.com";
const ADMIN_PASSWORD = "admin123";

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem("usuariosStyleHub")) || [];
}

function guardarUsuarios(usuarios) {
    localStorage.setItem("usuariosStyleHub", JSON.stringify(usuarios));
}

// ===== Registro de usuario (siempre como cliente normal) =====
export function registrarUsuario(nombre, email, password) {
    try {
        if (!nombre.trim()) throw new Error("El nombre es obligatorio");
        if (!validarEmail(email)) throw new Error("Correo no válido");
        if (!validarPassword(password)) throw new Error("La contraseña debe tener al menos 6 caracteres");

        if (email.toLowerCase() === ADMIN_EMAIL) {
            throw new Error("Ese correo no está disponible");
        }

        const usuarios = obtenerUsuarios();
        const existe = usuarios.find((u) => u.email === email);
        if (existe) throw new Error("Ya existe una cuenta con ese correo");

        usuarios.push({ nombre, email, password });
        guardarUsuarios(usuarios);

        return { exito: true, mensaje: "Cuenta creada con éxito" };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}

// ===== Login (detecta si es admin o cliente) =====
export function iniciarSesion(email, password) {
    try {
        if (!validarEmail(email)) throw new Error("Correo no válido");

        // ¿Es el admin?
        if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
            localStorage.setItem("sesionStyleHub", JSON.stringify({
                nombre: "Administrador",
                email: ADMIN_EMAIL,
                rol: "admin"
            }));
            return { exito: true, mensaje: "Sesión de administrador iniciada" };
        }

        // Si no es admin, buscar entre los clientes registrados
        const usuarios = obtenerUsuarios();
        const usuario = usuarios.find((u) => u.email === email && u.password === password);

        if (!usuario) throw new Error("Correo o contraseña incorrectos");

        localStorage.setItem("sesionStyleHub", JSON.stringify({
            nombre: usuario.nombre,
            email: usuario.email,
            rol: "cliente"
        }));

        return { exito: true, mensaje: "Sesión iniciada" };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}

export function obtenerSesion() {
    return JSON.parse(localStorage.getItem("sesionStyleHub")) || null;
}

export function esAdmin() {
    const sesion = obtenerSesion();
    return sesion && sesion.rol === "admin";
}

export function cerrarSesion() {
    localStorage.removeItem("sesionStyleHub");
}

// ===== Conectar con el HTML de login.html =====
const formLogin = document.getElementById("formulario-login");
const formRegistro = document.getElementById("formulario-registro");

if (formLogin) {
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;
        const resultado = iniciarSesion(email, password);

        const errorEl = document.getElementById("error-login");
        if (resultado.exito) {
            window.location.href = "index.html";
        } else {
            errorEl.textContent = resultado.mensaje;
        }
    });
}

if (formRegistro) {
    formRegistro.addEventListener("submit", (e) => {
        e.preventDefault();
        const nombre = document.getElementById("reg-nombre").value;
        const email = document.getElementById("reg-email").value;
        const password = document.getElementById("reg-password").value;
        const resultado = registrarUsuario(nombre, email, password);

        const errorEl = document.getElementById("error-registro");
        if (resultado.exito) {
            alert("Cuenta creada, ahora inicia sesión");
            document.getElementById("form-registro").style.display = "none";
            document.getElementById("form-login").style.display = "block";
        } else {
            errorEl.textContent = resultado.mensaje;
        }
    });
}

const irRegistro = document.getElementById("ir-registro");
const irLogin = document.getElementById("ir-login");

if (irRegistro) {
    irRegistro.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("form-login").style.display = "none";
        document.getElementById("form-registro").style.display = "block";
    });
}

if (irLogin) {
    irLogin.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("form-registro").style.display = "none";
        document.getElementById("form-login").style.display = "block";
    });
}

import { inicializarTema } from "./tema.js";
inicializarTema();
