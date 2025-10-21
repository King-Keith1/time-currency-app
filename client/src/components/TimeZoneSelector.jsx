import React, { useState, useMemo } from "react";
import { getTimeZoneOptions, convertToTimeZone } from "../utils/timeUtils";

const TimeZoneSelector = () => {
  const [search, setSearch] = useState("");
  const [selectedZone, setSelectedZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [currentTime, setCurrentTime] = useState("");
  
  const options = useMemo(() => getTimeZoneOptions(), []);

  // Filter the list dynamically based on the search text
  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options.slice(0, 20); // show first 20 by default
    const term = search.toLowerCase();
    return options.filter(opt =>
      opt.label.toLowerCase().includes(term) ||
      opt.value.toLowerCase().includes(term)
    );
  }, [search, options]);

  // Update displayed time when selectedZone changes
  React.useEffect(() => {
    const updateTime = () => {
      setCurrentTime(convertToTimeZone(new Date(), selectedZone));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, [selectedZone]);

  return (
    <div className="flex flex-col items-center gap-3 p-4">
      <h2 className="text-xl font-semibold mb-2">🌍 Time Zone Finder</h2>
      <p className="text-gray-600">
        Current time in <strong>{selectedZone}</strong>: {currentTime}
      </p>

      {/* Search box */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by city, country, or code..."
        className="border border-gray-400 rounded-lg px-3 py-2 w-80 focus:outline-none focus:ring focus:ring-blue-300"
      />

      {/* Scrollable dropdown */}
      <div className="border rounded-lg w-80 h-64 overflow-y-auto mt-2 bg-white shadow">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => (
            <button
              key={opt.value}
              className={`block text-left w-full px-3 py-2 hover:bg-blue-100 ${
                selectedZone === opt.value ? "bg-blue-50 font-medium" : ""
              }`}
              onClick={() => setSelectedZone(opt.value)}
            >
              {opt.label}
            </button>
          ))
        ) : (
          <p className="text-center text-gray-500 mt-3">No results found</p>
        )}
      </div>
    </div>
  );
};

export default TimeZoneSelector;
