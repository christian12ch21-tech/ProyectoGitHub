import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1">404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-dark">
        Volver al inicio
      </Link>
    </div>
  );
}
