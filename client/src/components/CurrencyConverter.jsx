// client/src/components/CurrencyConverter.jsx
import { useState, useCallback } from "react";

// ─── LOCAL FALLBACK RATES (USD base, approximate) ──────────────────────
// These are used only if the backend API fails.
const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.92, GBP: 0.79, JPY: 149.5, CHF: 0.89, CAD: 1.36,
  AUD: 1.52, NZD: 1.63, HKD: 7.82, SGD: 1.34, SEK: 10.42,
  NOK: 10.55, DKK: 6.88, PLN: 3.97, CZK: 23.1, HUF: 357,
  RON: 4.58, BGN: 1.79, HRK: 7.05, RUB: 90.5, TRY: 30.8,
  BRL: 4.92, MXN: 17.15, ARS: 820, CLP: 895, COP: 3920,
  PEN: 3.73, ZAR: 18.62, EGP: 30.9, NGN: 1580, KES: 154,
  GHS: 12.3, MAD: 10.08, TND: 3.11, INR: 83.1, PKR: 279,
  BDT: 110, LKR: 325, NPR: 133, MMK: 2100, THB: 35.1,
  VND: 24500, IDR: 15650, MYR: 4.65, PHP: 56.1, KRW: 1325,
  TWD: 31.7, CNY: 7.24, HKD: 7.82, AED: 3.67, SAR: 3.75,
  QAR: 3.64, KWD: 0.307, BHD: 0.377, OMR: 0.385, JOD: 0.71,
  ILS: 3.65, UAH: 37.8,
};

const CURRENCIES = Object.keys(FALLBACK_RATES).sort();

const API_BASE = "http://localhost:5001";

export default function CurrencyConverter({ onPin }) {
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("ZAR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // "live" | "fallback" | "error"
  const [date, setDate] = useState(null);
  const [pinned, setPinned] = useState(false);

  const convert = useCallback(async () => {
    const num = parseFloat(amount);
    if (!num || num <= 0) return;

    setLoading(true);
    setResult(null);
    setPinned(false);

    try {
      const res = await fetch(
        `${API_BASE}/api/convert?from=${from}&to=${to}&amount=${num}`,
        { signal: AbortSignal.timeout(5000) }
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data.result);
      setStatus("live");
      setDate(data.date);
    } catch {
      // Fallback: calculate locally using USD as pivot
      const fromRate = FALLBACK_RATES[from] ?? 1;
      const toRate = FALLBACK_RATES[to] ?? 1;
      const converted = (num / fromRate) * toRate;
      setResult(converted);
      setStatus("fallback");
      setDate(null);
    }

    setLoading(false);
  }, [amount, from, to]);

  const swap = () => {
    setFrom(to);
    setTo(from);
    setResult(null);
    setPinned(false);
  };

  const handlePin = () => {
    onPin(`💱 ${from} → ${to}`);
    setPinned(true);
  };

  const rate = result && parseFloat(amount) > 0
    ? (result / parseFloat(amount)).toFixed(4)
    : null;

  return (
    <div>
      <div className="card">
        <div className="section-header">
          <div className="card-title" style={{ margin: 0 }}>💱 Currency Converter</div>
          {status && (
            <span className={`badge badge-${status === "live" ? "live" : status === "fallback" ? "cached" : "offline"}`}>
              {status === "live" ? "Live rate" : status === "fallback" ? "Approx. rate" : "Error"}
            </span>
          )}
        </div>

        <div className="field">
          <label>Amount</label>
          <input
            type="number"
            min="0"
            step="any"
            value={amount}
            onChange={e => { setAmount(e.target.value); setResult(null); }}
            placeholder="Enter amount..."
          />
        </div>

        <div className="field-row">
          <div className="field">
            <label>From</label>
            <select value={from} onChange={e => { setFrom(e.target.value); setResult(null); }}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label>To</label>
            <select value={to} onChange={e => { setTo(e.target.value); setResult(null); }}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="swap-wrap" style={{ margin: "0.25rem 0 0.75rem" }}>
          <button className="btn-swap" onClick={swap} title="Swap currencies">⇄</button>
        </div>

        <div className="btn-row">
          <button className="btn-primary" onClick={convert} disabled={loading}>
            {loading
              ? <span className="loading-dots"><span/><span/><span/></span>
              : "Convert"
            }
          </button>
        </div>

        {result !== null && (
          <div className="result-box">
            <div className="result-label">Result</div>
            <div className="result-value">
              {parseFloat(amount).toLocaleString()} {from} = {result.toLocaleString("en", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {to}
            </div>
            {rate && (
              <div className="result-sub">
                1 {from} = {rate} {to}
                {date && ` · Rate date: ${date}`}
                {status === "fallback" && " · Approximate offline rate"}
              </div>
            )}
          </div>
        )}

        {result !== null && (
          <div className="btn-row" style={{ marginTop: "0.75rem" }}>
            <button className="btn-ghost" onClick={handlePin} disabled={pinned}>
              {pinned ? "✓ Pinned" : "Pin this pair"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}