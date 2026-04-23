// client/src/App.jsx
import { useState, useEffect } from "react";
import CurrencyConverter from "./components/CurrencyConverter";
import TimeConverter from "./components/TimeConverter";
import TimeZoneFinder from "./components/TimeZoneFinder.jsx";
import Pins from "./components/Pins";

export default function App() {
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState("time");
  const [pins, setPins] = useState(() => {
    try { return JSON.parse(localStorage.getItem("pins") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const addPin = (item) => {
    setPins(prev => {
      if (prev.includes(item)) return prev;
      const next = [...prev, item];
      localStorage.setItem("pins", JSON.stringify(next));
      return next;
    });
  };

  const removePin = (item) => {
    setPins(prev => {
      const next = prev.filter(p => p !== item);
      localStorage.setItem("pins", JSON.stringify(next));
      return next;
    });
  };

  const tabs = [
    { id: "time", label: "Time Converter", icon: "⏰" },
    { id: "currency", label: "Currency", icon: "💱" },
    { id: "zones", label: "Zone Finder", icon: "🌍" },
    { id: "pins", label: "Favourites", icon: "📌" },
  ];

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">✈</span>
            <div>
              <h1 className="brand-title">Wayfarer</h1>
              <p className="brand-sub">Time & Currency for Travellers</p>
            </div>
          </div>
          <button className="theme-toggle" onClick={() => setDark(d => !d)} title="Toggle theme">
            {dark ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <nav className="tab-nav">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${activeTab === t.id ? "active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            <span className="tab-icon">{t.icon}</span>
            <span className="tab-label">{t.label}</span>
          </button>
        ))}
      </nav>

      <main className="app-main">
        {activeTab === "time" && <TimeConverter onPin={addPin} />}
        {activeTab === "currency" && <CurrencyConverter onPin={addPin} />}
        {activeTab === "zones" && <TimeZoneFinder />}
        {activeTab === "pins" && <Pins pins={pins} onRemove={removePin} onTabChange={setActiveTab} />}
      </main>
    </div>
  );
}