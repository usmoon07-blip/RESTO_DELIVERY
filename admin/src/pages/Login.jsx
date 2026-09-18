import { useState } from 'react';
import api, { setPassword } from '../api.js';
import Logo from '../components/Logo.jsx';

export default function Login({ onSuccess }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(value);
      setPassword(value);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <div className="login__logo">
          <Logo height={62} style={{ margin: '0 auto' }} />
        </div>
        <div className="login__title">Admin Panel</div>
        <div className="login__sub">Boshqaruv paneli</div>

        {error && <div className="alert">{error}</div>}

        <div className="field">
          <label className="field__label">Parol</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>

        <button className="btn btn--dark btn--block" disabled={loading || !value}>
          {loading ? 'Tekshirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
}
