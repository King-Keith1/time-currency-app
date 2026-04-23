// client/src/components/Pins.jsx

export default function Pins({ pins, onRemove, onTabChange }) {
  if (pins.length === 0) {
    return (
      <div className="card">
        <div className="card-title">📌 Favourites</div>
        <div className="empty-state">
          <div className="empty-icon">📌</div>
          <p className="empty-text">No pins yet.</p>
          <p className="empty-text" style={{ marginTop: "0.4rem", fontSize: "0.8rem" }}>
            Convert a currency or time pair and tap "Pin this pair" to save it here.
          </p>
          <div style={{ display: "flex", gap: "0.6rem", justifyContent: "center", marginTop: "1.25rem" }}>
            <button className="btn-ghost" onClick={() => onTabChange("time")}>⏰ Time Converter</button>
            <button className="btn-ghost" onClick={() => onTabChange("currency")}>💱 Currency</button>
          </div>
        </div>
      </div>
    );
  }

  const timePins = pins.filter(p => p.startsWith("⏰"));
  const currencyPins = pins.filter(p => p.startsWith("💱"));

  return (
    <div>
      <div className="card">
        <div className="section-header">
          <div className="card-title" style={{ margin: 0 }}>📌 Favourites</div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            {pins.length} saved
          </span>
        </div>

        {timePins.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Time pairs
            </p>
            <div className="pin-list">
              {timePins.map(pin => (
                <div className="pin-item" key={pin}>
                  <div>
                    <div className="pin-text">{pin.replace("⏰ ", "")}</div>
                  </div>
                  <button className="btn-unpin" onClick={() => onRemove(pin)} title="Remove">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {currencyPins.length > 0 && (
          <div>
            <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--text-muted)", marginBottom: "0.5rem" }}>
              Currency pairs
            </p>
            <div className="pin-list">
              {currencyPins.map(pin => (
                <div className="pin-item" key={pin}>
                  <div>
                    <div className="pin-text">{pin.replace("💱 ", "")}</div>
                  </div>
                  <button className="btn-unpin" onClick={() => onRemove(pin)} title="Remove">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}