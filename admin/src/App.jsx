import { useState } from 'react';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import { clearPassword, getPassword } from './api.js';

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(getPassword()));
  const [page, setPage] = useState('orders');

  const logout = () => {
    clearPassword();
    setAuthed(false);
  };

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div className="layout">
      <header className="topbar">
        <div className="topbar__logo">
          <span>🍕</span>
          <span>Premium Pizza</span>
        </div>

        <nav className="tabs">
          <button
            className={`tab ${page === 'orders' ? 'tab--active' : ''}`}
            onClick={() => setPage('orders')}
          >
            Buyurtmalar
          </button>
          <button
            className={`tab ${page === 'products' ? 'tab--active' : ''}`}
            onClick={() => setPage('products')}
          >
            Mahsulotlar
          </button>
        </nav>

        <button className="btn btn--light btn--sm" onClick={logout}>
          Chiqish
        </button>
      </header>

      {page === 'orders' ? (
        <Orders onAuthError={logout} />
      ) : (
        <Products onAuthError={logout} />
      )}
    </div>
  );
}
