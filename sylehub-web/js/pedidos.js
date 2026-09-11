import { validarTelefono } from "./validaciones.js";

import { descontarStock } from "./productos.js";

function obtenerPedidos() {
    return JSON.parse(localStorage.getItem("pedidosStyleHub")) || [];
}

function guardarPedidos(pedidos) {
    localStorage.setItem("pedidosStyleHub", JSON.stringify(pedidos));
}

// ===== Crear un nuevo pedido =====
export function crearPedido(email, items, total, direccion, telefono, metodoPago) {
    try {
        if (!direccion.trim()) throw new Error("La dirección es obligatoria");

       if (!validarTelefono(telefono)) throw new Error("El teléfono debe tener 9 dígitos");

        const pedidos = obtenerPedidos();

        const nuevoPedido = {
            id: Date.now(),
            email,
            items,
            total,
            direccion,
            telefono,
            metodoPago,
            fecha: new Date().toLocaleString("es-PE"),
            estado: "Pendiente"
        };

        pedidos.push(nuevoPedido);
        guardarPedidos(pedidos);

        items.forEach((item) => {
    descontarStock(item.id, item.cantidad);
});

        return { exito: true, mensaje: "Pedido confirmado", pedido: nuevoPedido };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}

// ===== Obtener pedidos de un usuario específico =====
export function obtenerPedidosPorUsuario(email) {
    return obtenerPedidos().filter((p) => p.email === email);
}

// ===== Obtener TODOS los pedidos (para el admin) =====
export function obtenerTodosLosPedidos() {
    return obtenerPedidos();
}
