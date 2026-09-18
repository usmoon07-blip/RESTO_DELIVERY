import { useState } from 'react';
import Login from './pages/Login.jsx';
import Orders from './pages/Orders.jsx';
import Products from './pages/Products.jsx';
import Kitchen from './pages/Kitchen.jsx';
import { clearPassword, getPassword } from './api.js';

export default function App() {
  const [authed, setAuthed] = useState(() => Boolean(getPassword()));
  const [page, setPage] = useState('kitchen');

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
            className={`tab ${page === 'kitchen' ? 'tab--active' : ''}`}
            onClick={() => setPage('kitchen')}
          >
            👨‍🍳 Oshxona ekrani
          </button>
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

      {page === 'kitchen' && <Kitchen onAuthError={logout} />}
      {page === 'orders' && <Orders onAuthError={logout} />}
      {page === 'products' && <Products onAuthError={logout} />}
    </div>
  );
}
