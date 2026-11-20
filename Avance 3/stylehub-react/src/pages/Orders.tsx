import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Order } from '../types';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUser } from '../services/orderService';
import { errorMessage } from '../services/http';
import OrderCard from '../components/OrderCard';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    getOrdersByUser(user.id)
      .then(setOrders)
      .catch((e: unknown) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [user]);

  return (
    <>
      <h3 className="mb-3">📦 Historial de pedidos</h3>
      {loading && <div className="spinner-border" role="status" />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-5">
          <p>Todavía no has realizado pedidos.</p>
          <Link to="/" className="btn btn-dark">
            Comprar ahora
          </Link>
        </div>
      )}
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </>
  );
}
