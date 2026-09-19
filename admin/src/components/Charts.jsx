/**
 * Hisobot grafiklari — bitta seriyali, sodda va o'qishga oson.
 *
 * Har bir grafikda bitta o'lchov bor, shuning uchun rang bilan ajratish
 * kerak emas: ma'noni yorliq beradi, rang faqat "bu — ma'lumot" deydi.
 * Raqam har bir ustunga yozilmaydi — faqat eng kattasiga va oxirgisiga.
 */
import { useState } from 'react';

/**
 * Ustun balandligi foizda.
 * Eng balandi 88% — tepada raqam uchun joy qoladi, ustun kesilmaydi.
 * Nol qiymat umuman chizilmaydi, aks holda bo'sh soat ham chiziqcha
 * bo'lib ko'rinadi.
 */
const pct = (value, max) => {
  if (!max || value <= 0) return 0;
  return Math.max(3, Math.round((value / max) * 88));
};

/** Gorizontal qatorlar uchun — bu yerda kesilish muammosi yo'q */
const width = (value, max) => {
  if (!max || value <= 0) return 0;
  return Math.max(2, Math.round((value / max) * 100));
};

/* ----------------------- Vertikal ustunlar (vaqt bo'yicha) ----------------------- */

export function ColumnChart({ data, labelOf, valueOf, formatValue, tooltipOf, height = 150 }) {
  const [hover, setHover] = useState(null);

  if (!data.length) return <div className="chart-empty">Ma'lumot yo'q</div>;

  const values = data.map(valueOf);
  const max = Math.max(...values);
  const maxIndex = values.indexOf(max);

  return (
    <div className="chart" style={{ '--chart-h': `${height}px` }}>
      <div className="chart__plot">
        {data.map((row, i) => {
          const value = values[i];
          const isMax = i === maxIndex;

          return (
            <div
              className="col"
              key={i}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {/* Faqat eng katta ustun belgilanadi — qolganlari sichqoncha ostida */}
              {isMax && value > 0 && <div className="col__tag">{formatValue(value)}</div>}

              <div
                className={`col__bar ${hover === i ? 'is-hover' : ''}`}
                style={{ height: `${pct(value, max)}%` }}
              />

              {hover === i && <div className="tip">{tooltipOf(row)}</div>}
            </div>
          );
        })}
      </div>

      <div className="chart__axis">
        <span>{labelOf(data[0])}</span>
        {data.length > 2 && <span>{labelOf(data[Math.floor(data.length / 2)])}</span>}
        <span>{labelOf(data[data.length - 1])}</span>
      </div>
    </div>
  );
}

/* ----------------------- Gorizontal qatorlar (reyting) ----------------------- */

export function RankedBars({ rows }) {
  if (!rows.length) return <div className="chart-empty">Ma'lumot yo'q</div>;

  const max = Math.max(...rows.map((r) => r.value));

  return (
    <div className="ranked">
      {rows.map((row, i) => (
        <div className="ranked__row" key={i}>
          <div className="ranked__head">
            <span className="ranked__name" title={row.label}>
              {row.label}
            </span>
            <span className="ranked__value">{row.display}</span>
          </div>
          <div className="ranked__track">
            <div className="ranked__fill" style={{ width: `${width(row.value, max)}%` }} />
          </div>
          {row.sub && <div className="ranked__sub">{row.sub}</div>}
        </div>
      ))}
    </div>
  );
}

/* ----------------------- Ulush (masalan naqd / karta) ----------------------- */

export function ShareRows({ rows, total }) {
  const max = Math.max(1, ...rows.map((r) => r.value));

  return (
    <div className="share">
      {rows.map((row, i) => {
        const share = total > 0 ? Math.round((row.value / total) * 100) : 0;
        return (
          <div className="share__row" key={i}>
            <div className="share__head">
              <span className="share__name">{row.label}</span>
              <span className="share__pct">{share}%</span>
            </div>
            <div className="ranked__track">
              <div className="ranked__fill" style={{ width: `${width(row.value, max)}%` }} />
            </div>
            <div className="share__sub">{row.sub}</div>
          </div>
        );
      })}
    </div>
  );
}

export default { ColumnChart, RankedBars, ShareRows };
