// client/src/components/TimeZoneFinder.jsx
import { useState, useEffect, useMemo } from "react";
import timezones from "../data/timezones.json";

const ALL_OPTIONS = timezones.flatMap(tz =>
  tz.utc.map(iana => ({
    label: `${tz.text}`,
    value: iana,
    offset: tz.offset,
    abbr: tz.abbr,
    searchText: `${tz.text} ${iana} ${tz.abbr}`.toLowerCase(),
  }))
);

function formatInZone(date, zone) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch { return "--:--:--"; }
}

function formatDateInZone(date, zone) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      weekday: "short",
      month: "short",
      day: "numeric",
    }).format(date);
  } catch { return ""; }
}

function getOffsetLabel(zone) {
  try {
    const parts = new Intl.DateTimeFormat("en", {
      timeZone: zone,
      timeZoneName: "shortOffset",
    }).formatToParts(new Date());
    return parts.find(p => p.type === "timeZoneName")?.value || "";
  } catch { return ""; }
}

export default function TimeZoneFinder() {
  const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(userZone);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_OPTIONS.slice(0, 30);
    const q = search.toLowerCase();
    return ALL_OPTIONS.filter(o => o.searchText.includes(q)).slice(0, 50);
  }, [search]);

  const selectedOption = ALL_OPTIONS.find(o => o.value === selected);
  const time = formatInZone(now, selected);
  const date = formatDateInZone(now, selected);
  const offset = getOffsetLabel(selected);

  return (
    <div>
      {/* Live clock for selected zone */}
      <div className="card">
        <div className="card-title">🌍 Zone Finder</div>

        <div className="clock-display">
          <div className="clock-time">{time}</div>
          <div className="clock-date">{date}</div>
          <div className="clock-zone">
            {selected} · {offset}
            {selectedOption && ` · ${selectedOption.abbr}`}
          </div>
        </div>

        {/* Search */}
        <div className="field" style={{ marginTop: "1rem" }}>
          <label>Search timezone</label>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="City, country, or code…"
          />
        </div>

        {/* Results list */}
        <div className="zone-list">
          {filtered.length > 0 ? filtered.map(opt => (
            <button
              key={opt.value}
              className={`zone-item ${selected === opt.value ? "selected" : ""}`}
              onClick={() => setSelected(opt.value)}
            >
              <span>{opt.label}<br/>
                <span style={{ fontSize: "0.74rem", opacity: 0.6 }}>{opt.value}</span>
              </span>
              <span className="zone-offset">{opt.offset >= 0 ? "+" : ""}{opt.offset}h</span>
            </button>
          )) : (
            <div style={{ padding: "1.5rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
              No results
            </div>
          )}
        </div>

        {!search && (
          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.5rem", textAlign: "center" }}>
            Showing first 30 zones · Search to filter
          </p>
        )}
      </div>
    </div>
  );
}