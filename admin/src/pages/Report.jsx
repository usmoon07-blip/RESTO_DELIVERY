import { useCallback, useEffect, useState } from 'react';
import api from '../api.js';
import { ColumnChart, RankedBars, ShareRows } from '../components/Charts.jsx';
import { DELIVERY_LABELS, PAYMENT_LABELS, formatSum } from '../utils.js';

const PERIODS = [
  { days: 1, label: 'Bugun' },
  { days: 7, label: '7 kun' },
  { days: 30, label: '30 kun' },
  { days: 90, label: '90 kun' },
  { days: 0, label: 'Hammasi' },
];

/** 2026-09-19 -> 19.09 */
const shortDate = (key) => {
  const [, m, d] = key.split('-');
  return `${d}.${m}`;
};

/** Katta summalarni qisqartirib ko'rsatamiz: 1 250 000 -> 1.25 mln */
const shortSum = (value) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)} mln`;
  if (value >= 1000) return `${Math.round(value / 1000)} ming`;
  return String(value);
};

function Tile({ label, value, sub, tone }) {
  return (
    <div className={`tile ${tone ? `tile--${tone}` : ''}`}>
      <div className="tile__label">{label}</div>
      <div className="tile__value">{value}</div>
      {sub && <div className="tile__sub">{sub}</div>}
    </div>
  );
}

function Panel({ title, sub, children }) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{title}</h2>
        {sub && <div className="panel__sub">{sub}</div>}
      </div>
      {children}
    </section>
  );
}

export default function Report({ onAuthError }) {
  const [days, setDays] = useState(30);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        setReport(await api.getReport(days));
        setError('');
      } catch (e) {
        if (e.message.includes('Parol')) return onAuthError();
        setError(e.message);
      } finally {
        setLoading(false);
      }
    },
    [days, onAuthError],
  );

  useEffect(() => {
    load();
  }, [load]);

  /* Kun davomida ochiq tursa ham raqamlar yangilanib tursin */
  useEffect(() => {
    const timer = setInterval(() => load(true), 60000);
    return () => clearInterval(timer);
  }, [load]);

  const periodLabel = PERIODS.find((p) => p.days === days)?.label || '';

  return (
    <div className="content">
      <div className="page-head">
        <div>
          <div className="page-title">Hisobot</div>
          <div className="page-sub">{periodLabel} — har daqiqada yangilanadi</div>
        </div>

        {/* Filtrlar — grafiklar ustida bitta qatorda */}
        <div className="toolbar">
          {PERIODS.map((p) => (
            <button
              key={p.days}
              className={`chip ${days === p.days ? 'chip--on' : ''}`}
              onClick={() => setDays(p.days)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {loading || !report ? (
        <div className="spinner" />
      ) : (
        <>
          <div className="tiles">
            <Tile
              label="Tushum"
              value={`${formatSum(report.totals.revenue)} so'm`}
              sub={`${report.totals.orders} ta buyurtma`}
            />
            <Tile
              label="Qo'lga tekkan pul"
              value={`${formatSum(report.totals.deliveredRevenue)} so'm`}
              sub={`${report.totals.deliveredOrders} ta yetkazilgan`}
            />
            <Tile
              label="O'rtacha chek"
              value={`${formatSum(report.totals.avgCheck)} so'm`}
              sub="Bitta buyurtmaga"
            />
            <Tile
              label="Bekor qilingan"
              value={`${report.totals.cancelled} ta`}
              sub={`Barcha buyurtmalarning ${report.totals.cancelRate}%`}
              tone={report.totals.cancelRate >= 15 ? 'warn' : null}
            />
          </div>

          <div className="tiles">
            <Tile
              label="Yangi mijozlar"
              value={report.totals.newCustomers}
              sub={`Jami bazada ${report.totals.totalCustomers} ta`}
            />
            <Tile
              label="Qayta kelganlar"
              value={report.totals.repeatCustomers}
              sub="Shu davrda 2+ marta buyurtma bergan"
            />
            <Tile
              label="Chegirmalar"
              value={`${formatSum(report.totals.discountTotal)} so'm`}
              sub="Promokodlar orqali berilgan"
            />
            <Tile
              label="Yetkazib berish"
              value={`${report.delivery.DELIVERY.count} ta`}
              sub={`Borib olish — ${report.delivery.PICKUP.count} ta`}
            />
          </div>

          <div className="grid-2">
            <Panel title="To'lov turi" sub="Mijozlar qanday to'laydi">
              <ShareRows
                total={report.totals.orders}
                rows={[
                  {
                    label: PAYMENT_LABELS.CASH,
                    value: report.payment.CASH.count,
                    sub: `${report.payment.CASH.count} ta — ${formatSum(report.payment.CASH.sum)} so'm`,
                  },
                  {
                    label: PAYMENT_LABELS.CARD,
                    value: report.payment.CARD.count,
                    sub: `${report.payment.CARD.count} ta — ${formatSum(report.payment.CARD.sum)} so'm`,
                  },
                ]}
              />
            </Panel>

            <Panel title="Yetkazish turi" sub="Buyurtma qayerda qabul qilinadi">
              <ShareRows
                total={report.totals.orders}
                rows={[
                  {
                    label: DELIVERY_LABELS.DELIVERY,
                    value: report.delivery.DELIVERY.count,
                    sub: `${formatSum(report.delivery.DELIVERY.sum)} so'm`,
                  },
                  {
                    label: DELIVERY_LABELS.PICKUP,
                    value: report.delivery.PICKUP.count,
                    sub: `${formatSum(report.delivery.PICKUP.sum)} so'm`,
                  },
                ]}
              />
            </Panel>
          </div>

          {/* Bitta kun uchun kunlik grafik ma'nosiz — soatlar grafigi yetarli */}
          {report.daily.length > 1 && (
          <Panel title="Kunlik tushum" sub="Ustun ustiga sichqonchani olib boring">
            <ColumnChart
              data={report.daily}
              labelOf={(d) => shortDate(d.date)}
              valueOf={(d) => d.revenue}
              formatValue={shortSum}
              tooltipOf={(d) =>
                `${shortDate(d.date)} — ${formatSum(d.revenue)} so'm · ${d.orders} ta`
              }
            />
          </Panel>
          )}

          <Panel title="Kun davomida" sub="Qaysi soatlarda ko'p buyurtma tushadi">
            <ColumnChart
              data={report.hourly.filter((h) => h.hour >= 8)}
              labelOf={(h) => `${h.hour}:00`}
              valueOf={(h) => h.count}
              formatValue={(v) => `${v} ta`}
              tooltipOf={(h) => `${h.hour}:00 — ${h.count} ta buyurtma`}
              height={110}
            />
          </Panel>

          <div className="grid-2">
            <Panel title="Eng ko'p sotilgan taomlar" sub="Menyu va xarid rejasi uchun">
              <RankedBars
                rows={report.topProducts.map((p) => ({
                  label: p.name,
                  value: p.qty,
                  display: `${p.qty} ta`,
                  sub: `${formatSum(p.sum)} so'm`,
                }))}
              />
            </Panel>

            <Panel title="Eng qadrli mijozlar" sub="Alohida e'tibor berishga arziydi">
              {report.topCustomers.length === 0 ? (
                <div className="chart-empty">Ma'lumot yo'q</div>
              ) : (
                <div className="table-wrap table-wrap--flat">
                  <table>
                    <thead>
                      <tr>
                        <th>Mijoz</th>
                        <th>Jami xarid</th>
                      </tr>
                    </thead>
                    <tbody>
                      {report.topCustomers.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <div className="cell-strong">{c.name}</div>
                            <div className="cell-muted">
                              {c.phone || (c.username ? `@${c.username}` : '—')}
                            </div>
                          </td>
                          <td>
                            <div className="cell-strong">{formatSum(c.sum)}</div>
                            <div className="cell-muted">{c.orders} ta buyurtma</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          </div>

          {report.truncated && (
            <div className="alert alert--soft">
              Juda ko'p buyurtma — hisobot oxirgi 20 000 tasi bo'yicha tuzildi.
            </div>
          )}
        </>
      )}
    </div>
  );
}
