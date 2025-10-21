import React, { useState, useEffect } from "react";
import timezones from "../data/timezones.json";
import { getLocalTimeZone, convertToTimeZone } from "../utils/timeUtils";

const TimeConverter = () => {
  const [selectedZone, setSelectedZone] = useState(getLocalTimeZone());
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const options = getTimeZoneOptions();
    console.log("Dropdown options:", options.slice(0, 3));

    const now = new Date();
    console.log("Time in Tokyo:", convertToTimeZone(now, "Asia/Tokyo"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>🕒 Time Zone Converter</h2>
      <p>Current Time in {selectedZone}: <strong>{currentTime}</strong></p>

      <select onChange={(e) => setSelectedZone(e.target.value)} value={selectedZone}>
        {timezones.map((t, index) => (
          <option key={index} value={t.zone}>
            {t.city} ({t.country})
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeConverter;
