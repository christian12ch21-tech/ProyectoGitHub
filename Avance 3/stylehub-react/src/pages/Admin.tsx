import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CATEGORIES, type Order, type Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useToast } from '../context/ToastContext';
import { createProduct, editProduct, removeProduct } from '../services/adminService';
import { getAllOrders } from '../services/orderService';
import { resetOffersResource } from '../services/productService';
import { errorMessage } from '../services/http';
import { finalPrice, money } from '../utils';
import OrderCard from '../components/OrderCard';

const productSchema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres'),
  category: z.enum(CATEGORIES, { error: 'Selecciona una categoría' }),
  emoji: z.string().trim().min(1, 'Ingresa un emoji'),
  price: z.number({ error: 'Ingresa un precio' }).positive('Debe ser mayor a 0'),
  discount: z.number({ error: 'Ingresa un descuento' }).int('Debe ser entero').min(0, 'Mínimo 0').max(90, 'Máximo 90'),
  stock: z.number({ error: 'Ingresa el stock' }).int('Debe ser entero').min(0, 'No puede ser negativo'),
});
type ProductFormData = z.infer<typeof productSchema>;

const EMPTY_FORM = {
  name: '',
  category: '' as ProductFormData['category'],
  emoji: '👕',
  price: 0,
  discount: 0,
  stock: 30,
};

export default function Admin() {
  const [tab, setTab] = useState<'productos' | 'pedidos'>('productos');
  const { products, loading, error, reload } = useProducts();
  const { showToast } = useToast();
  const [editing, setEditing] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({ resolver: zodResolver(productSchema), defaultValues: EMPTY_FORM });

  useEffect(() => {
    if (tab === 'pedidos') {
      getAllOrders()
        .then(setOrders)
        .catch((e: unknown) => showToast(errorMessage(e), 'danger'));
    }
  }, [tab, showToast]);

  const startEdit = (p: Product) => {
    setEditing(p);
    reset({ name: p.name, category: p.category as ProductFormData['category'], emoji: p.emoji, price: p.price, discount: p.discount, stock: p.stock });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditing(null);
    reset(EMPTY_FORM);
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      if (editing) {
        await editProduct(editing.id, data);
        showToast('Producto actualizado', 'success');
      } else {
        await createProduct(data);
        showToast('Producto creado', 'success');
      }
      resetOffersResource();
      cancelEdit();
      await reload();
    } catch (e) {
      showToast(errorMessage(e), 'danger');
    }
  };

  const onDelete = async (p: Product) => {
    if (!window.confirm(`¿Eliminar "${p.name}"?`)) return;
    try {
      await removeProduct(p.id);
      showToast('Producto eliminado', 'info');
      resetOffersResource();
      await reload();
    } catch (e) {
      showToast(errorMessage(e), 'danger');
    }
  };

  return (
    <>
      <h3 className="mb-3">⚙️ Panel de administración</h3>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link${tab === 'productos' ? ' active' : ''}`} onClick={() => setTab('productos')}>
            Productos
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link${tab === 'pedidos' ? ' active' : ''}`} onClick={() => setTab('pedidos')}>
            Pedidos
          </button>
        </li>
      </ul>

      {tab === 'pedidos' && (
        <>
          {orders.length === 0 && <div className="alert alert-info">No hay pedidos registrados.</div>}
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} showUser />
          ))}
        </>
      )}

      {tab === 'productos' && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">{editing ? `Editando: ${editing.name}` : 'Nuevo producto'}</h5>
              <form onSubmit={handleSubmit(onSubmit)} noValidate className="row g-3">
                <div className="col-md-4">
                  <label className="form-label" htmlFor="name">
                    Nombre
                  </label>
                  <input id="name" className={`form-control${errors.name ? ' is-invalid' : ''}`} {...register('name')} />
                  <div className="invalid-feedback">{errors.name?.message}</div>
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="category">
                    Categoría
                  </label>
                  <select id="category" className={`form-select${errors.category ? ' is-invalid' : ''}`} {...register('category')}>
                    <option value="">Selecciona...</option>
                    {CATEGORIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                  <div className="invalid-feedback">{errors.category?.message}</div>
                </div>
                <div className="col-md-2">
                  <label className="form-label" htmlFor="emoji">
                    Emoji
                  </label>
                  <input id="emoji" className={`form-control${errors.emoji ? ' is-invalid' : ''}`} {...register('emoji')} />
                  <div className="invalid-feedback">{errors.emoji?.message}</div>
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="price">
                    Precio (S/)
                  </label>
                  <input
                    id="price"
                    type="number"
                    step="0.01"
                    className={`form-control${errors.price ? ' is-invalid' : ''}`}
                    {...register('price', { valueAsNumber: true })}
                  />
                  <div className="invalid-feedback">{errors.price?.message}</div>
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="discount">
                    Descuento (%)
                  </label>
                  <input
                    id="discount"
                    type="number"
                    className={`form-control${errors.discount ? ' is-invalid' : ''}`}
                    {...register('discount', { valueAsNumber: true })}
                  />
                  <div className="invalid-feedback">{errors.discount?.message}</div>
                </div>
                <div className="col-md-3">
                  <label className="form-label" htmlFor="stock">
                    Stock
                  </label>
                  <input
                    id="stock"
                    type="number"
                    className={`form-control${errors.stock ? ' is-invalid' : ''}`}
                    {...register('stock', { valueAsNumber: true })}
                  />
                  <div className="invalid-feedback">{errors.stock?.message}</div>
                </div>
                <div className="col-md-6 d-flex align-items-end gap-2">
                  <button className="btn btn-dark" disabled={isSubmitting}>
                    {editing ? 'Guardar cambios' : 'Crear producto'}
                  </button>
                  {editing && (
                    <button type="button" className="btn btn-outline-secondary" onClick={cancelEdit}>
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {loading && <div className="spinner-border" role="status" />}
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-sm align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Precio final</th>
                  <th>Dscto.</th>
                  <th>Stock</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>
                      {p.emoji} {p.name}
                    </td>
                    <td>{p.category}</td>
                    <td>{money(finalPrice(p))}</td>
                    <td>{p.discount}%</td>
                    <td>{p.stock}</td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => startEdit(p)}>
                        Editar
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => void onDelete(p)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
