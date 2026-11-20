import { useState } from 'react';
import { SIZES, type Product } from '../types';
import { finalPrice, money } from '../utils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function ProductCard({ product }: { product: Product }) {
  const [size, setSize] = useState<string>('M');
  const { add } = useCart();
  const { has, toggle } = useWishlist();
  const liked = has(product.id);
  const soldOut = product.stock <= 0;

  return (
    <div className="card h-100 product-card">
      <div className="product-emoji">
        {product.discount > 0 && <span className="badge text-bg-danger discount-badge">-{product.discount}%</span>}
        <button
          className="wish-btn"
          onClick={() => toggle(product.id, product.name)}
          aria-label="Favorito"
          title="Agregar a favoritos"
        >
          {liked ? '❤️' : '🤍'}
        </button>
        {product.emoji}
      </div>
      <div className="card-body d-flex flex-column">
        <small className="text-body-secondary">{product.category}</small>
        <h6 className="card-title">{product.name}</h6>
        <div className="mb-2">
          <span className="fw-bold">{money(finalPrice(product))}</span>
          {product.discount > 0 && <small className="text-decoration-line-through text-body-secondary ms-2">{money(product.price)}</small>}
        </div>
        <small className={soldOut ? 'text-danger' : 'text-body-secondary'}>{soldOut ? 'Agotado' : `Stock: ${product.stock}`}</small>
        <div className="mt-auto pt-2 d-flex gap-2">
          <select
            className="form-select form-select-sm w-auto"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            aria-label="Talla"
          >
            {SIZES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button className="btn btn-dark btn-sm flex-grow-1" disabled={soldOut} onClick={() => add(product, size)}>
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
