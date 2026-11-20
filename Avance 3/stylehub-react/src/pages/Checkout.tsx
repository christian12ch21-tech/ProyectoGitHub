import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { getProducts, resetOffersResource } from '../services/productService';
import { createOrder, updateStock } from '../services/orderService';
import { errorMessage } from '../services/http';
import { money } from '../utils';

const checkoutSchema = z
  .object({
    fullName: z.string().trim().min(3, 'Ingresa tu nombre completo'),
    address: z.string().trim().min(5, 'Ingresa una dirección válida'),
    city: z.string().trim().min(2, 'Ingresa tu ciudad'),
    phone: z.string().regex(/^9\d{8}$/, 'Teléfono de 9 dígitos que empiece con 9'),
    payment: z.enum(['tarjeta', 'yape', 'contraentrega'], { error: 'Selecciona un método de pago' }),
    cardNumber: z.string().optional(),
    terms: z.boolean().refine((v) => v, 'Debes aceptar los términos y condiciones'),
  })
  .refine((d) => d.payment !== 'tarjeta' || /^\d{16}$/.test(d.cardNumber ?? ''), {
    message: 'La tarjeta debe tener 16 dígitos',
    path: ['cardNumber'],
  });
type CheckoutData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { user } = useAuth();
  const { items, subtotal, discount, total, coupon, clear } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fullName: user?.name ?? '', payment: 'yape', terms: false },
  });

  const payment = watch('payment');

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No tienes productos en el carrito</h4>
        <Link to="/" className="btn btn-dark mt-3">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutData) => {
    if (!user) return;
    setServerError(null);
    try {
      // 1) Validar stock actual
      const fresh = await getProducts();
      const needed = new Map<number, number>();
      items.forEach((i) => needed.set(i.productId, (needed.get(i.productId) ?? 0) + i.quantity));
      for (const [id, qty] of needed) {
        const p = fresh.find((x) => x.id === id);
        if (!p || p.stock < qty) throw new Error(`Stock insuficiente para ${p?.name ?? 'un producto'}`);
      }
      // 2) Descontar stock en la API (Axios)
      await Promise.all(
        [...needed].map(([id, qty]) => updateStock(id, (fresh.find((x) => x.id === id)?.stock ?? 0) - qty)),
      );
      // 3) Guardar el pedido
      await createOrder({
        userId: user.id,
        userName: user.name,
        date: new Date().toISOString(),
        items,
        subtotal,
        discount,
        total,
        couponCode: coupon?.code ?? null,
        shipping: {
          fullName: data.fullName,
          address: data.address,
          city: data.city,
          phone: data.phone,
          payment: data.payment,
        },
      });
      clear();
      resetOffersResource();
      showToast('¡Compra confirmada! Gracias por tu pedido', 'success');
      navigate('/pedidos');
    } catch (e) {
      setServerError(errorMessage(e));
    }
  };

  const input = (name: 'fullName' | 'address' | 'city' | 'phone', label: string, placeholder = '') => (
    <div className="mb-3">
      <label className="form-label" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        placeholder={placeholder}
        className={`form-control${errors[name] ? ' is-invalid' : ''}`}
        {...register(name)}
      />
      <div className="invalid-feedback">{errors[name]?.message}</div>
    </div>
  );

  return (
    <div className="row g-4">
      <div className="col-lg-7">
        <h3 className="mb-3">Datos de envío y pago</h3>
        {serverError && <div className="alert alert-danger">{serverError}</div>}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {input('fullName', 'Nombre completo')}
          {input('address', 'Dirección', 'Av. Los Olivos 123')}
          {input('city', 'Ciudad', 'Lima')}
          {input('phone', 'Teléfono', '987654321')}

          <div className="mb-3">
            <label className="form-label" htmlFor="payment">
              Método de pago
            </label>
            <select id="payment" className={`form-select${errors.payment ? ' is-invalid' : ''}`} {...register('payment')}>
              <option value="yape">Yape / Plin</option>
              <option value="tarjeta">Tarjeta</option>
              <option value="contraentrega">Contraentrega</option>
            </select>
            <div className="invalid-feedback">{errors.payment?.message}</div>
          </div>

          {payment === 'tarjeta' && (
            <div className="mb-3">
              <label className="form-label" htmlFor="cardNumber">
                Número de tarjeta
              </label>
              <input
                id="cardNumber"
                inputMode="numeric"
                maxLength={16}
                placeholder="16 dígitos"
                className={`form-control${errors.cardNumber ? ' is-invalid' : ''}`}
                {...register('cardNumber')}
              />
              <div className="invalid-feedback">{errors.cardNumber?.message}</div>
            </div>
          )}

          <div className="form-check mb-3">
            <input id="terms" type="checkbox" className={`form-check-input${errors.terms ? ' is-invalid' : ''}`} {...register('terms')} />
            <label className="form-check-label" htmlFor="terms">
              Acepto los términos y condiciones
            </label>
            <div className="invalid-feedback">{errors.terms?.message}</div>
          </div>

          <button className="btn btn-dark w-100" disabled={isSubmitting}>
            {isSubmitting ? 'Procesando...' : `Confirmar compra · ${money(total)}`}
          </button>
        </form>
      </div>

      <div className="col-lg-5">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Tu pedido</h5>
            <ul className="list-unstyled">
              {items.map((i) => (
                <li key={i.key} className="d-flex justify-content-between">
                  <span>
                    {i.emoji} {i.name} ({i.size}) × {i.quantity}
                  </span>
                  <span>{money(i.unitPrice * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <hr />
            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            {coupon && (
              <div className="d-flex justify-content-between text-success">
                <span>Cupón {coupon.code}</span>
                <span>-{money(discount)}</span>
              </div>
            )}
            <div className="d-flex justify-content-between fw-bold fs-5 mt-2">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
