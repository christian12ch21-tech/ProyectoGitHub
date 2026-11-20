import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="container py-4">
        <Outlet />
      </main>
      <footer className="text-center text-body-secondary py-4 border-top">
        <small>StyleHub · Proyecto de JavaScript Avanzado · Avance 3 (React)</small>
      </footer>
    </>
  );
}
