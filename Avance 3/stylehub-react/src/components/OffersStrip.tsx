import { use } from 'react';
import type { Product } from '../types';
import { finalPrice, money } from '../utils';
import { useTheme } from '../context/ThemeContext';

// RESOURCE HOOK: use(promesa) suspende el componente hasta que llegan los datos
export default function OffersStrip({ resource }: { resource: Promise<Product[]> }) {
  const offers = use(resource).slice(0, 6);
  const { theme } = useTheme();

  if (offers.length === 0) return null;

  return (
    <section className={`rounded p-3 mb-4 ${theme === 'dark' ? 'bg-danger-subtle' : 'bg-warning-subtle'}`}>
      <h5 className="mb-3">🔥 Ofertas de la semana</h5>
      <div className="d-flex flex-wrap gap-2">
        {offers.map((p) => (
          <span key={p.id} className="badge text-bg-light border fs-6 fw-normal">
            {p.emoji} {p.name} · <b>{money(finalPrice(p))}</b> <span className="text-danger">-{p.discount}%</span>
          </span>
        ))}
      </div>
    </section>
  );
}
