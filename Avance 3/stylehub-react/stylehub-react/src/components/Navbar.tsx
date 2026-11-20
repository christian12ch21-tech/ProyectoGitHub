import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { ids } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const linkClass = ({ isActive }: { isActive: boolean }) => `nav-link${isActive ? ' active fw-semibold' : ''}`;
  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary border-bottom sticky-top">
      <div className="container">
        <Link className="navbar-brand brand" to="/" onClick={close}>
          👗 StyleHub
        </Link>
        <button className="navbar-toggler" type="button" aria-label="Menú" onClick={() => setOpen((o) => !o)}>
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${open ? ' show' : ''}`}>
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink className={linkClass} to="/" end onClick={close}>
                Catálogo
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className={linkClass} to="/favoritos" onClick={close}>
                Favoritos <span className="badge text-bg-danger">{ids.length}</span>
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/pedidos" onClick={close}>
                  Mis pedidos
                </NavLink>
              </li>
            )}
            {user?.role === 'admin' && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/admin" onClick={close}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-outline-secondary btn-sm" onClick={toggleTheme} title="Cambiar tema">
              {theme === 'light' ? '🌙 Oscuro' : '☀️ Claro'}
            </button>
            <NavLink className="btn btn-dark btn-sm" to="/carrito" onClick={close}>
              🛒 Carrito <span className="badge text-bg-light">{count}</span>
            </NavLink>
            {user ? (
              <>
                <span className="small">Hola, {user.name}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
                  Salir
                </button>
              </>
            ) : (
              <>
                <NavLink className="btn btn-outline-primary btn-sm" to="/login" onClick={close}>
                  Ingresar
                </NavLink>
                <NavLink className="btn btn-primary btn-sm" to="/registro" onClick={close}>
                  Registrarse
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
