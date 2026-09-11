import {
    productos,
    agregarProducto,
    editarProducto,
    eliminarProducto
} from "./productos.js";

import { obtenerTodosLosPedidos } from "./pedidos.js";
import { cerrarSesion } from "./auth.js";
import { inicializarTema } from "./tema.js";

const formulario = document.getElementById("formulario-producto");
const inputId = document.getElementById("producto-id");
const inputNombre = document.getElementById("p-nombre");
const inputPrecio = document.getElementById("p-precio");
const inputTalla = document.getElementById("p-talla");
const inputCategoria = document.getElementById("p-categoria");
const inputStock = document.getElementById("p-stock");
const inputImagen = document.getElementById("p-imagen");
const errorProducto = document.getElementById("error-producto");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");
const tituloForm = document.getElementById("titulo-form");
const cuerpoTabla = document.getElementById("cuerpo-tabla-productos");
const cuerpoPedidos = document.getElementById("cuerpo-tabla-pedidos");

let modoEdicion = false;

// ===== Pintar la tabla de productos =====
function renderizarTablaProductos() {
    cuerpoTabla.innerHTML = "";

    productos.forEach((p) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${p.nombre}</td>
            <td>S/ ${p.precio.toFixed(2)}</td>
            <td>${p.talla}</td>
            <td>${p.categoria}</td>
            <td>${p.stock}</td>
            <td>
                <button class="btn-editar" data-id="${p.id}">Editar</button>
                <button class="btn-eliminar-producto" data-id="${p.id}">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(fila);
    });

    cuerpoTabla.querySelectorAll(".btn-editar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            const producto = productos.find((p) => p.id === id);

            inputId.value = producto.id;
            inputNombre.value = producto.nombre;
            inputPrecio.value = producto.precio;
            inputTalla.value = producto.talla;
            inputCategoria.value = producto.categoria;
            inputStock.value = producto.stock;
            inputImagen.value = producto.imagen;

            modoEdicion = true;
            tituloForm.textContent = "Editar producto";
            btnGuardar.textContent = "Guardar cambios";
            btnCancelar.style.display = "inline-block";
        });
    });

    cuerpoTabla.querySelectorAll(".btn-eliminar-producto").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = Number(e.target.dataset.id);
            if (confirm("¿Eliminar este producto?")) {
                eliminarProducto(id);
                renderizarTablaProductos();
            }
        });
    });
}

// ===== Pintar la tabla de pedidos =====
function renderizarTablaPedidos() {
    const pedidos = obtenerTodosLosPedidos();
    cuerpoPedidos.innerHTML = "";

    if (pedidos.length === 0) {
        cuerpoPedidos.innerHTML = "<tr><td colspan='4'>No hay pedidos aún.</td></tr>";
        return;
    }

    pedidos.forEach((pedido) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${pedido.email}</td>
            <td>${pedido.fecha}</td>
            <td>S/ ${pedido.total.toFixed(2)}</td>
            <td>${pedido.estado}</td>
        `;
        cuerpoPedidos.appendChild(fila);
    });
}

// ===== Resetear el formulario a modo "Agregar" =====
function resetearFormulario() {
    formulario.reset();
    inputId.value = "";
    modoEdicion = false;
    tituloForm.textContent = "Agregar producto";
    btnGuardar.textContent = "Agregar producto";
    btnCancelar.style.display = "none";
    errorProducto.textContent = "";
}

// ===== Envío del formulario (agregar o editar según el modo) =====
formulario.addEventListener("submit", (e) => {
    e.preventDefault();

    const nombre = inputNombre.value;
    const precio = parseFloat(inputPrecio.value);
    const talla = inputTalla.value;
    const categoria = inputCategoria.value;
    const stock = parseInt(inputStock.value);
    const imagen = inputImagen.value;

    let resultado;

    if (modoEdicion) {
        const id = Number(inputId.value);
        resultado = editarProducto(id, nombre, precio, talla, categoria, stock, imagen);
    } else {
        resultado = agregarProducto(nombre, precio, talla, categoria, stock, imagen);
    }

    if (resultado.exito) {
        resetearFormulario();
        renderizarTablaProductos();
    } else {
        errorProducto.textContent = resultado.mensaje;
    }
});

btnCancelar.addEventListener("click", resetearFormulario);

// ===== Cerrar sesión =====
const btnCerrarSesionAdmin = document.getElementById("btn-cerrar-sesion-admin");
if (btnCerrarSesionAdmin) {
    btnCerrarSesionAdmin.addEventListener("click", (e) => {
        e.preventDefault();
        cerrarSesion();
        window.location.href = "index.html";
    });
}

// ===== Inicializar =====
renderizarTablaProductos();
renderizarTablaPedidos();
inicializarTema();