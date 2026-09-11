// ===== Validaciones reutilizables con expresiones regulares y try-catch =====

export function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export function validarPassword(password) {
    return password.length >= 6;
}

export function validarTelefono(telefono) {
    const regex = /^[0-9]{9}$/;
    return regex.test(telefono);
}

export function validarNoVacio(texto) {
    return texto.trim().length > 0;
}

export function validarNumeroPositivo(numero) {
    return !isNaN(numero) && numero > 0;
}
