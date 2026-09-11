// ===== Aplicar el tema guardado al cargar la página =====
function aplicarTemaGuardado() {
    const temaGuardado = localStorage.getItem("temaStyleHub") || "claro";
    document.body.classList.toggle("modo-oscuro", temaGuardado === "oscuro");
    actualizarIconoBoton(temaGuardado);
}

// ===== Alternar entre claro y oscuro =====
function alternarTema() {
    const esOscuro = document.body.classList.toggle("modo-oscuro");
    const nuevoTema = esOscuro ? "oscuro" : "claro";
    localStorage.setItem("temaStyleHub", nuevoTema);
    actualizarIconoBoton(nuevoTema);
}

function actualizarIconoBoton(tema) {
    const btn = document.getElementById("btn-tema");
    if (btn) {
        btn.textContent = tema === "oscuro" ? "☀️" : "🌙";
    }
}

// ===== Inicializar =====
export function inicializarTema() {
    aplicarTemaGuardado();

    const btn = document.getElementById("btn-tema");
    if (btn) {
        btn.addEventListener("click", alternarTema);
    }
}