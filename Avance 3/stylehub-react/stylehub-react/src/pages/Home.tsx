import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { CATEGORIES } from '../types';
import { finalPrice } from '../utils';
import { offersResource } from '../services/productService';
import ProductCard from '../components/ProductCard';
import OffersStrip from '../components/OffersStrip';

type SortKey = 'default' | 'asc' | 'desc' | 'name';

export default function Home() {
  const { products, loading, error, reload } = useProducts();

  // useState: estado de los filtros
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [onlyOffers, setOnlyOffers] = useState(false);
  const [sort, setSort] = useState<SortKey>('default');

  // useRef: referencia al input para enfocarlo
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = products.filter(
      (p) =>
        (category === 'Todas' || p.category === category) &&
        (!onlyOffers || p.discount > 0) &&
        p.name.toLowerCase().includes(term),
    );
    if (sort === 'asc') list.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === 'desc') list.sort((a, b) => finalPrice(b) - finalPrice(a));
    if (sort === 'name') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, search, category, onlyOffers, sort]);

  const clearFilters = () => {
    setSearch('');
    setCategory('Todas');
    setOnlyOffers(false);
    setSort('default');
    searchRef.current?.focus();
  };

  return (
    <>
      <Suspense fallback={<div className="placeholder-glow mb-4"><span className="placeholder col-12 py-4" /></div>}>
        <OffersStrip resource={offersResource()} />
      </Suspense>

      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <input
            ref={searchRef}
            className="form-control"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-6 col-md-2">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Todas</option>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select className="form-select" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="default">Ordenar por...</option>
            <option value="asc">Precio: menor a mayor</option>
            <option value="desc">Precio: mayor a menor</option>
            <option value="name">Nombre (A-Z)</option>
          </select>
        </div>
        <div className="col-6 col-md-2 d-flex align-items-center">
          <div className="form-check">
            <input
              id="offers"
              type="checkbox"
              className="form-check-input"
              checked={onlyOffers}
              onChange={(e) => setOnlyOffers(e.target.checked)}
            />
            <label htmlFor="offers" className="form-check-label">
              Solo ofertas
            </label>
          </div>
        </div>
        <div className="col-6 col-md-1">
          <button className="btn btn-outline-secondary w-100" onClick={clearFilters} title="Limpiar filtros">
            ✕
          </button>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center">
          <span>{error}</span>
          <button className="btn btn-sm btn-outline-danger" onClick={() => void reload()}>
            Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-body-secondary">{filtered.length} producto(s)</p>
          {filtered.length === 0 ? (
            <div className="alert alert-info">No hay productos que coincidan con tu búsqueda.</div>
          ) : (
            <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
              {filtered.map((p) => (
                <div className="col" key={p.id}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
