"use strict";

const REGLAS = Object.freeze({
  igv: 18,
  minimoFrecuente: 5,
  maxDescuento: 50,
  envioExpress: 1500
});

const form = document.querySelector("#cotizador");
const productoInput = document.querySelector("#producto");
const precioInput = document.querySelector("#precio");
const cantidadInput = document.querySelector("#cantidad");
const descuentoInput = document.querySelector("#descuento");
const frecuenteInput = document.querySelector("#clienteFrecuente");
const expressInput = document.querySelector("#envioExpress");
const errorBox = document.querySelector("#error");
const resultadoBox = document.querySelector("#resultado");

const salida = {
  operacion: document.querySelector("#operacion"),
  producto: document.querySelector("#productoResultado"),
  subtotal: document.querySelector("#subtotal"),
  descuento: document.querySelector("#descuentoResultado"),
  base: document.querySelector("#base"),
  igv: document.querySelector("#igv"),
  envio: document.querySelector("#envio"),
  total: document.querySelector("#total"),
  banderas: document.querySelector("#banderas")
};

const moneda = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2
});

let consecutivo = 0n;

function crearId() {
  consecutivo += 1n;
  return BigInt(Date.now()) * 1000n + consecutivo;
}

function precioACentimos(texto) {
  const valor = texto.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(valor)) {
    throw new TypeError("El precio debe ser positivo y tener como máximo dos decimales.");
  }

  const partes = valor.split(".");
  const enteros = Number(partes[0]);
  const decimales = Number((partes[1] ?? "").padEnd(2, "0") || "0");
  const centimos = enteros * 100 + decimales;

  if (!Number.isSafeInteger(centimos) || centimos <= 0 || centimos > 100000000) {
    throw new RangeError("El precio está fuera del rango permitido.");
  }

  return centimos;
}

function enteroValido(input, nombre, minimo, maximo) {
  const numero = Number(input.value);

  if (!Number.isInteger(numero) || numero < minimo || numero > maximo) {
    throw new RangeError(`${nombre} debe ser un entero entre ${minimo} y ${maximo}.`);
  }

  return numero;
}

function calcularBanderas() {
  let banderas = 0;

  if (frecuenteInput.checked) banderas |= 1;
  if (expressInput.checked) banderas |= 2;

  return banderas;
}

function tieneBandera(banderas, bandera) {
  return (banderas & bandera) !== 0;
}

function sumar(...valores) {
  return valores.reduce((total, valor) => total + valor, 0);
}

function calcular(datos, banderas) {
  const descuentoMinimo = tieneBandera(banderas, 1) ? REGLAS.minimoFrecuente : 0;
  const descuentoAplicado = Math.min(
    Math.max(datos.descuento, descuentoMinimo),
    REGLAS.maxDescuento
  );

  const subtotal = datos.precioCentimos * datos.cantidad;
  const descuento = Math.round(subtotal * descuentoAplicado / 100);
  const base = subtotal - descuento;
  const igv = Math.round(base * REGLAS.igv / 100);
  const envio = tieneBandera(banderas, 2) ? REGLAS.envioExpress : 0;
  const total = sumar(base, igv, envio);

  if (!Number.isSafeInteger(total)) {
    throw new RangeError("El resultado supera el rango seguro de Number.");
  }

  return {
    ...datos,
    banderas,
    descuentoAplicado,
    subtotal,
    descuento,
    base,
    igv,
    envio,
    total
  };
}

function mostrarError(mensaje) {
  errorBox.textContent = mensaje;
  errorBox.hidden = false;
  resultadoBox.hidden = true;
}

function limpiarError() {
  errorBox.textContent = "";
  errorBox.hidden = true;
}

function mostrar(resultado) {
  salida.operacion.textContent = `Operación: ${crearId().toString()}`;
  salida.producto.textContent = `${resultado.producto} × ${resultado.cantidad}`;
  salida.subtotal.textContent = moneda.format(resultado.subtotal / 100);
  salida.descuento.textContent =
    `-${moneda.format(resultado.descuento / 100)} (${resultado.descuentoAplicado} %)`;
  salida.base.textContent = moneda.format(resultado.base / 100);
  salida.igv.textContent = moneda.format(resultado.igv / 100);
  salida.envio.textContent = moneda.format(resultado.envio / 100);
  salida.total.textContent = moneda.format(resultado.total / 100);

  const frecuente = tieneBandera(resultado.banderas, 1);
  const express = tieneBandera(resultado.banderas, 2);

  salida.banderas.textContent =
    `Opciones: cliente frecuente ${frecuente ? "sí" : "no"}; ` +
    `envío express ${express ? "sí" : "no"}.`;

  resultadoBox.hidden = false;
}

form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  limpiarError();

  try {
    const producto = productoInput.value.trim();
    if (!producto) throw new TypeError("Escribe un producto o servicio.");

    const precioCentimos = precioACentimos(precioInput.value);
    const cantidad = enteroValido(cantidadInput, "La cantidad", 1, 10000);
    const descuento = enteroValido(descuentoInput, "El descuento", 0, 50);
    const banderas = calcularBanderas();

    mostrar(calcular({
      producto,
      precioCentimos,
      cantidad,
      descuento
    }, banderas));
  } catch (error) {
    mostrarError(error instanceof Error ? error.message : "Ocurrió un error.");
  }
});

form.addEventListener("reset", () => {
  limpiarError();
  resultadoBox.hidden = true;
  queueMicrotask(() => productoInput.focus());
});

productoInput.focus();
