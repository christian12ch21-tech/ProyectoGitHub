import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { validateCoupon } from '../services/couponService';
import { money } from '../utils';

const couponSchema = z.object({
  code: z.string().trim().min(3, 'Ingresa un código de al menos 3 caracteres'),
});
type CouponData = z.infer<typeof couponSchema>;

export default function Cart() {
  const { items, subtotal, discount, total, coupon, remove, setQuantity, applyCoupon } = useCart();
  const { showToast } = useToast();
  const [checking, setChecking] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CouponData>({ resolver: zodResolver(couponSchema) });

  const onApplyCoupon = async (data: CouponData) => {
    setChecking(true);
    try {
      const found = await validateCoupon(data.code); // servicio con Alova
      if (!found) {
        setError('code', { message: 'Cupón no válido' });
        return;
      }
      applyCoupon(found);
      showToast(`Cupón ${found.code} aplicado: ${found.percent}% de descuento`, 'success');
      reset();
    } catch {
      setError('code', { message: 'No se pudo validar el cupón (¿API encendida?)' });
    } finally {
      setChecking(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-5">
        <h3>Tu carrito está vacío 🛒</h3>
        <Link to="/" className="btn btn-dark mt-3">
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-lg-8">
        <h3 className="mb-3">Carrito de compras</h3>
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Talla</th>
                <th>Precio</th>
                <th style={{ width: 150 }}>Cantidad</th>
                <th>Subtotal</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.key}>
                  <td>
                    {i.emoji} {i.name}
                  </td>
                  <td>{i.size}</td>
                  <td>{money(i.unitPrice)}</td>
                  <td>
                    <div className="input-group input-group-sm">
                      <button className="btn btn-outline-secondary" onClick={() => setQuantity(i.key, i.quantity - 1)}>
                        −
                      </button>
                      <span className="form-control text-center">{i.quantity}</span>
                      <button className="btn btn-outline-secondary" onClick={() => setQuantity(i.key, i.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>{money(i.unitPrice * i.quantity)}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => remove(i.key)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card">
          <div className="card-body">
            <h5 className="card-title">Resumen</h5>

            <form onSubmit={handleSubmit(onApplyCoupon)} noValidate className="mb-3">
              <label className="form-label small" htmlFor="code">
                Cupón de descuento (prueba STYLE10, UTP20 o BLACK30)
              </label>
              <div className="input-group">
                <input id="code" className={`form-control${errors.code ? ' is-invalid' : ''}`} {...register('code')} />
                <button className="btn btn-outline-dark" disabled={checking}>
                  {checking ? '...' : 'Aplicar'}
                </button>
                {errors.code && <div className="invalid-feedback">{errors.code.message}</div>}
              </div>
            </form>

            <div className="d-flex justify-content-between">
              <span>Subtotal</span>
              <span>{money(subtotal)}</span>
            </div>
            {coupon && (
              <div className="d-flex justify-content-between text-success">
                <span>
                  Cupón {coupon.code} (-{coupon.percent}%){' '}
                  <button className="btn btn-link btn-sm p-0 text-danger" onClick={() => applyCoupon(null)}>
                    quitar
                  </button>
                </span>
                <span>-{money(discount)}</span>
              </div>
            )}
            <hr />
            <div className="d-flex justify-content-between fw-bold fs-5">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
            <Link to="/checkout" className="btn btn-dark w-100 mt-3">
              Ir a pagar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
