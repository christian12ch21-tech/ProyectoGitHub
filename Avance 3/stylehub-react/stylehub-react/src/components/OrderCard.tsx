import type { Order } from '../types';
import { money } from '../utils';

export default function OrderCard({ order, showUser = false }: { order: Order; showUser?: boolean }) {
  return (
    <div className="card mb-3">
      <div className="card-header d-flex justify-content-between">
        <span>
          Pedido #{order.id}
          {showUser && ` · ${order.userName}`}
        </span>
        <small className="text-body-secondary">{new Date(order.date).toLocaleString('es-PE')}</small>
      </div>
      <div className="card-body">
        <ul className="list-unstyled mb-2">
          {order.items.map((i) => (
            <li key={i.key} className="d-flex justify-content-between">
              <span>
                {i.emoji} {i.name} ({i.size}) × {i.quantity}
              </span>
              <span>{money(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>
        <small className="text-body-secondary d-block">
          Envío a {order.shipping.address}, {order.shipping.city} · Pago: {order.shipping.payment}
          {order.couponCode && ` · Cupón ${order.couponCode}`}
        </small>
        <div className="text-end fw-bold">Total: {money(order.total)}</div>
      </div>
    </div>
  );
}
