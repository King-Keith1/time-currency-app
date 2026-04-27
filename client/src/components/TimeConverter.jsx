// client/src/components/TimeConverter.jsx
import { useState, useEffect } from "react";
import timezones from "../data/timezones.json";

function buildOptions() {
  return timezones.flatMap(tz =>
    tz.utc.map(iana => ({
      label: `${tz.text} (${iana})`,
      value: iana,
      offset: tz.offset,
      abbr: tz.abbr,
    }))
  );
}

const OPTIONS = buildOptions();

function formatInZone(date, zone) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--:--";
  }
}

function formatDateInZone(date, zone) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return "";
  }
}

function getOffsetLabel(zone) {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: zone,
      timeZoneName: "shortOffset",
    }).formatToParts(now);
    return parts.find(p => p.type === "timeZoneName")?.value || "";
  } catch {
    return "";
  }
}

export default function TimeConverter({ onPin }) {
  const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [from, setFrom] = useState(userZone);
  const [to, setTo] = useState("America/New_York");
  const [now, setNow] = useState(new Date());
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { setPinned(false); }, [from, to]);

  const fromTime = formatInZone(now, from);
  const toTime = formatInZone(now, to);
  const fromDate = formatDateInZone(now, from);
  const toDate = formatDateInZone(now, to);
  const fromOffset = getOffsetLabel(from);
  const toOffset = getOffsetLabel(to);

  const swap = () => { setFrom(to); setTo(from); };

  const handlePin = () => {
    const item = `${from} → ${to}`;
    onPin(item);
    setPinned(true);
  };

  return (
    <div>
      <div className="card">
        <div className="card-title">Time Converter</div>

        {/* FROM clock */}
        <div className="field">
          <label>From</label>
          <select value={from} onChange={e => setFrom(e.target.value)}>
            {OPTIONS.map((o, i) => (
              <option key={`${o.value}-${i}`} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="clock-display">
          <div className="clock-time">{fromTime}</div>
          <div className="clock-date">{fromDate}</div>
          <div className="clock-zone">{from} · {fromOffset}</div>
        </div>

        {/* SWAP */}
        <div className="swap-wrap">
          <button className="btn-swap" onClick={swap} title="Swap zones">⇅</button>
        </div>

        {/* TO clock */}
        <div className="field">
          <label>To</label>
          <select value={to} onChange={e => setTo(e.target.value)}>
            {OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className="clock-display">
          <div className="clock-time">{toTime}</div>
          <div className="clock-date">{toDate}</div>
          <div className="clock-zone">{to} · {toOffset}</div>
        </div>

        <div className="btn-row">
          <button className="btn-ghost" onClick={handlePin} disabled={pinned}>
            {pinned ? "Saved" : "Save this pair"}
          </button>
        </div>
      </div>
    </div>
  );
}