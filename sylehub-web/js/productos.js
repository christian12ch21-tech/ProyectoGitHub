// ===== CLASE PRODUCTO =====
export class Producto {
    constructor(id, nombre, precio, talla, imagen, stock, categoria, descuento = 0) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.talla = talla;
        this.imagen = imagen;
        this.stock = stock;
        this.categoria = categoria;
        this.descuento = descuento; // porcentaje, 0 = sin oferta
    }

    aplicarIGV() {
        const IGV = 0.18;
        return this.precio + this.precio * IGV;
    }

    tieneDescuento() {
        return this.descuento > 0;
    }

    precioFinal() {
        const conIGV = this.aplicarIGV();
        if (this.tieneDescuento()) {
            return conIGV - conIGV * (this.descuento / 100);
        }
        return conIGV;
    }
}

// ===== ARREGLO DE PRODUCTOS (25 productos, algunos con descuento) =====
export let productos = [
    new Producto(1,  "Polo Básico Blanco",       39.90,  "S",  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", 30, "polos"),
    new Producto(2,  "Polo Básico Negro",        39.90,  "M",  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop", 30, "polos", 15),
    new Producto(3,  "Polo Estampado",           45.90,  "L",  "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop", 30, "polos"),
    new Producto(4,  "Polo Rayas",                42.90, "XL", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&h=400&fit=crop", 30, "polos"),
    new Producto(5,  "Jean Slim Fit Azul",        89.90, "30", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop", 30, "jeans", 20),
    new Producto(6,  "Jean Slim Fit Negro",       89.90, "32", "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop", 30, "jeans"),
    new Producto(7,  "Jean Recto Clásico",        79.90, "34", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", 30, "jeans"),
    new Producto(8,  "Jean Ancho Baggy",          94.90, "36", "https://images.unsplash.com/photo-1475178626620-a4d074967452?w=400&h=400&fit=crop", 30, "jeans"),
    new Producto(9,  "Casaca Denim Azul",        129.90,  "M", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", 30, "casacas", 25),
    new Producto(10, "Casaca Bomber Negra",      139.90,  "L", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", 30, "casacas"),
    new Producto(11, "Casaca Impermeable",       119.90, "XL", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop", 30, "casacas"),
    new Producto(12, "Zapatillas Urbanas Blancas",149.90, "40", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=400&fit=crop", 30, "calzado"),
    new Producto(13, "Zapatillas Deportivas",     169.90, "42", "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop", 30, "calzado", 10),
    new Producto(14, "Botines Casuales",          189.90, "43", "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&h=400&fit=crop", 30, "calzado"),
    new Producto(15, "Sandalias Urbanas",          69.90, "41", "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=400&h=400&fit=crop", 30, "calzado"),
    new Producto(16, "Polera con Capucha Gris",    99.90,  "M", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", 30, "poleras"),
    new Producto(17, "Polera Oversize Negra",      95.90,  "L", "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", 30, "poleras", 30),
    new Producto(18, "Buzo Conjunto Deportivo",   254.90,  "M", "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400&h=400&fit=crop", 30, "poleras"),
    new Producto(19, "Short Deportivo",            49.90,  "S", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop", 30, "shorts"),
    new Producto(20, "Short Cargo",                54.90,  "M", "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400&h=400&fit=crop", 30, "shorts"),
    new Producto(21, "Camisa Manga Larga",         79.90,  "L", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop", 30, "camisas"),
    new Producto(22, "Camisa Cuadros",             74.90,  "M", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop", 30, "camisas"),
    new Producto(23, "Camisa Formal Blanca",       84.90, "XL", "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=400&fit=crop", 30, "camisas"),
    new Producto(24, "Gorra Snapback",              39.90, "Única", "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop", 30, "accesorios"),
    new Producto(25, "Correa de Cuero",             59.90, "Única", "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=400&fit=crop", 30, "accesorios")
];

// ===== BUSCAR PRODUCTO POR ID (con try-catch) =====
export function obtenerProductoPorId(id) {
    try {
        const producto = productos.find((p) => p.id === id);
        if (!producto) throw new Error(`Producto ${id} no encontrado`);
        return producto;
    } catch (error) {
        console.error(error.message);
        return null;
    }
}

// ===== BUSCADOR POR NOMBRE (regex) =====
export function buscarProductoPorNombre(texto) {
    const regex = new RegExp(texto, "i");
    return productos.filter((p) => regex.test(p.nombre));
}

// ===== FILTRAR POR CATEGORÍA =====
export function filtrarPorCategoria(categoria) {
    if (categoria === "todos") return productos;
    return productos.filter((p) => p.categoria === categoria);
}

// ===== FILTRAR POR RANGO DE PRECIO =====
export function filtrarPorPrecio(min, max) {
    return productos.filter((p) => p.precio >= min && p.precio <= max);
}

// ===== OBTENER PRODUCTOS EN OFERTA =====
export function obtenerProductosEnOferta() {
    return productos.filter((p) => p.tieneDescuento());
}

// ===== ORDENAR PRODUCTOS =====
export function ordenarPorPrecio(lista, ascendente = true) {
    return [...lista].sort((a, b) =>
        ascendente ? a.precio - b.precio : b.precio - a.precio
    );
}

export function ordenarPorNombre(lista) {
    return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
}

// ===== OBTENER LISTA DE CATEGORÍAS ÚNICAS =====
export function obtenerCategorias() {
    const categorias = new Set(productos.map((p) => p.categoria));
    return ["todos", ...categorias];
}

// ===== CRUD para el panel admin =====
function guardarProductosEnStorage() {
    localStorage.setItem("productosStyleHub", JSON.stringify(productos));
}

const guardados = JSON.parse(localStorage.getItem("productosStyleHub"));
if (guardados && guardados.length > 0) {
    productos.length = 0;
    guardados.forEach((p) => {
        const nuevo = new Producto(p.id, p.nombre, p.precio, p.talla, p.imagen, p.stock, p.categoria, p.descuento || 0);
        productos.push(nuevo);
    });
}

export function agregarProducto(nombre, precio, talla, categoria, stock, imagen, descuento = 0) {
    try {
        if (!nombre.trim()) throw new Error("El nombre es obligatorio");
        if (precio <= 0) throw new Error("El precio debe ser mayor a 0");
        if (stock < 0) throw new Error("El stock no puede ser negativo");

        const nuevoId = productos.length > 0 ? Math.max(...productos.map((p) => p.id)) + 1 : 1;
        const nuevoProducto = new Producto(nuevoId, nombre, precio, talla, imagen, stock, categoria, descuento);
        productos.push(nuevoProducto);
        guardarProductosEnStorage();

        return { exito: true, mensaje: "Producto agregado" };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}

export function editarProducto(id, nombre, precio, talla, categoria, stock, imagen, descuento = 0) {
    try {
        const producto = productos.find((p) => p.id === id);
        if (!producto) throw new Error("Producto no encontrado");

        producto.nombre = nombre;
        producto.precio = precio;
        producto.talla = talla;
        producto.categoria = categoria;
        producto.stock = stock;
        producto.imagen = imagen;
        producto.descuento = descuento;

        guardarProductosEnStorage();
        return { exito: true, mensaje: "Producto actualizado" };
    } catch (error) {
        return { exito: false, mensaje: error.message };
    }
}

export function eliminarProducto(id) {
    const index = productos.findIndex((p) => p.id === id);
    if (index === -1) return { exito: false, mensaje: "Producto no encontrado" };

    productos.splice(index, 1);
    guardarProductosEnStorage();
    return { exito: true, mensaje: "Producto eliminado" };
}

export function descontarStock(id, cantidad) {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
        producto.stock = Math.max(0, producto.stock - cantidad);
        guardarProductosEnStorage();
    }
}