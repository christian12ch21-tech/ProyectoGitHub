export const CATEGORIES = ['Hombre', 'Mujer', 'Calzado', 'Accesorios'] as const;
export const SIZES = ['S', 'M', 'L', 'XL'] as const;

export interface Product {
  id: number;
  name: string;
  category: string;
  emoji: string;
  price: number;
  discount: number; // porcentaje 0-90
  stock: number;
}

export type ProductInput = Omit<Product, 'id'>;

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'cliente';
}

export type Session = Omit<User, 'password'>;

export interface Coupon {
  id: number;
  code: string;
  percent: number;
}

export interface CartItem {
  key: string; // productId-talla
  productId: number;
  name: string;
  emoji: string;
  size: string;
  unitPrice: number;
  quantity: number;
  stock: number;
}

export interface Order {
  id?: number;
  userId: number;
  userName: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  shipping: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
    payment: string;
  };
}
