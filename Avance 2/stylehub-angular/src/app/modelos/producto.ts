export interface Producto {
  id: string;
  nombre: string;
  precio: number;
  talla: string;
  imagen: string;
  stock: number;
  categoria: string;
  descuento: number;
}

export type BorradorProducto = Omit<Producto, 'id'>;

export const IGV = 0.18;

export function precioConIgv(precio: number): number {
  return precio + precio * IGV;
}

export function precioFinal(p: Pick<Producto, 'precio' | 'descuento'>): number {
  const conIgv = precioConIgv(p.precio);
  return p.descuento > 0 ? conIgv - conIgv * (p.descuento / 100) : conIgv;
}
