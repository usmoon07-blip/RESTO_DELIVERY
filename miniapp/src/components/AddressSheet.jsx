import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { getGeolocation, haptic } from '../telegram.js';
import { IconCheck, IconPin, IconScooter, IconStore } from './Icons.jsx';

export const PICKUP_ADDRESS = "Toshkent sh., Amir Temur ko'chasi 1-uy";

export default function AddressSheet({ onClose }) {
  const { address, setAddress, showToast } = useApp();

  const [mode, setMode] = useState(address?.mode || 'DELIVERY');
  const [text, setText] = useState(address?.text || '');
  const [coords, setCoords] = useState(
    address?.latitude != null
      ? { latitude: address.latitude, longitude: address.longitude }
      : null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const detect = async () => {
    setBusy(true);
    setError('');
    try {
      const position = await getGeolocation();
      setCoords(position);
      haptic('success');
    } catch (e) {
      setError(e.message);
      haptic('error');
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    if (mode === 'DELIVERY' && !text.trim() && !coords) {
      setError('Manzilni kiriting yoki joylashuvni aniqlang');
      return haptic('error');
    }

    setAddress({
      mode,
      text: mode === 'PICKUP' ? PICKUP_ADDRESS : text.trim(),
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    });

    haptic('success');
    showToast('Manzil saqlandi');
    onClose();
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet__grip" />

        <div className="sheet__scroll">
          <div className="sheet__body">
            <h2 className="sheet__title">Manzil</h2>
            <p className="sheet__sub" style={{ color: 'var(--ink-3)', fontWeight: 400 }}>
              Buyurtmani qanday olishni tanlang
            </p>

            {error && (
              <div className="alert" style={{ marginTop: 16 }}>
                {error}
              </div>
            )}

            <div className="segment" style={{ marginTop: 18 }}>
              <button
                className={`seg ${mode === 'DELIVERY' ? 'seg--on' : ''}`}
                onClick={() => setMode('DELIVERY')}
              >
                <IconScooter />
                <div className="seg__title">Yetkazib berish</div>
                <div className="seg__sub">45 daqiqa</div>
              </button>
              <button
                className={`seg ${mode === 'PICKUP' ? 'seg--on' : ''}`}
                onClick={() => setMode('PICKUP')}
              >
                <IconStore />
                <div className="seg__title">Borib olish</div>
                <div className="seg__sub">15 daqiqa</div>
              </button>
            </div>

            {mode === 'DELIVERY' ? (
              <div style={{ marginTop: 18 }}>
                <button
                  className={`geo ${coords ? 'geo--ok' : ''}`}
                  onClick={detect}
                  disabled={busy}
                >
                  <IconPin />
                  <span>
                    {busy
                      ? 'Aniqlanmoqda...'
                      : coords
                        ? `Joylashuv aniqlandi (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
                        : 'Joriy joylashuvimni aniqlash'}
                  </span>
                </button>

                <div className="field" style={{ marginTop: 14 }}>
                  <label className="field__label">Manzil</label>
                  <textarea
                    className="input"
                    placeholder="Ko'cha, uy, xonadon, mo'ljal..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="geo geo--ok" style={{ marginTop: 18 }}>
                <IconStore />
                <span>{PICKUP_ADDRESS}</span>
              </div>
            )}
          </div>
        </div>

        <div className="sheet__cta">
          <button className="btn btn--brand" onClick={save}>
            <IconCheck />
            Saqlash
          </button>
        </div>
      </div>
    </>
  );
}
