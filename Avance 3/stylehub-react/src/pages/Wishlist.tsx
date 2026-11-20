import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';

export default function Wishlist() {
  const { products, loading, error } = useProducts();
  const { ids } = useWishlist();
  const favorites = products.filter((p) => ids.includes(p.id));

  return (
    <>
      <h3 className="mb-3">❤️ Mis favoritos</h3>
      {loading && <div className="spinner-border" role="status" />}
      {error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && favorites.length === 0 && (
        <div className="text-center py-5">
          <p>Aún no tienes productos favoritos.</p>
          <Link to="/" className="btn btn-dark">
            Explorar catálogo
          </Link>
        </div>
      )}
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
        {favorites.map((p) => (
          <div className="col" key={p.id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </>
  );
}
