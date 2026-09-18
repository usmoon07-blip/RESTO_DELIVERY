import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { getGeolocation, haptic } from '../telegram.js';
import { IconCheck, IconPin, IconScooter, IconStore } from './Icons.jsx';

export const PICKUP_ADDRESS = "Toshkent sh., Amir Temur ko'chasi 1-uy";

export default function AddressSheet({ onClose }) {
  const { address, setAddress, showToast, t } = useApp();

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
      setError(t('errAddress'));
      return haptic('error');
    }

    setAddress({
      mode,
      text: mode === 'PICKUP' ? PICKUP_ADDRESS : text.trim(),
      latitude: coords?.latitude ?? null,
      longitude: coords?.longitude ?? null,
    });

    haptic('success');
    showToast(t('addressSaved'));
    onClose();
  };

  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="sheet">
        <div className="sheet__grip" />

        <div className="sheet__scroll">
          <div className="sheet__body">
            <h2 className="sheet__title">{t('addressTitle')}</h2>
            <p className="sheet__sub" style={{ color: 'var(--ink-3)', fontWeight: 400 }}>
              {t('addressSub')}
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
                <div className="seg__title">{t('delivery')}</div>
                <div className="seg__sub">{t('min45')}</div>
              </button>
              <button
                className={`seg ${mode === 'PICKUP' ? 'seg--on' : ''}`}
                onClick={() => setMode('PICKUP')}
              >
                <IconStore />
                <div className="seg__title">{t('pickup')}</div>
                <div className="seg__sub">{t('min15')}</div>
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
                      ? t('detecting')
                      : coords
                        ? `${t('locationFound')} (${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)})`
                        : t('detectLocation')}
                  </span>
                </button>

                <div className="field" style={{ marginTop: 14 }}>
                  <label className="field__label">{t('address')}</label>
                  <textarea
                    className="input"
                    placeholder={t('addressPlaceholder')}
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
            {t('save')}
          </button>
        </div>
      </div>
    </>
  );
}
