export interface ItemCarrito {
  id: string;
  nombre: string;
  talla: string;
  imagen: string;
  precioUnitario: number;
  cantidad: number;
  stock: number;
}

export interface Cupon {
  codigo: string;
  descuento: number;
}

export interface Pedido {
  id: string;
  usuarioEmail: string;
  fecha: string;
  items: ItemCarrito[];
  cupon: Cupon | null;
  total: number;
  nombre: string;
  direccion: string;
  telefono: string;
  metodoPago: 'tarjeta' | 'yape' | 'plin';
}

export type BorradorPedido = Omit<Pedido, 'id'>;
