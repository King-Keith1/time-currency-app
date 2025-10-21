import timezones from "../data/timezones.json";

/* ------------------------
   TIME UTILITIES
   ------------------------
   Handles local time, time zone detection,
   conversions, and optional server comparison.
------------------------ */

// 🕒 Get user's current local time (HH:mm:ss)
export function getLocalTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour12: true });
}

// 📅 Get user's full local date/time (locale format)
export function getLocalDateTime() {
  const now = new Date();
  return now.toLocaleString();
}

// 🌍 Get user's IANA time zone (e.g., "Africa/Johannesburg")
export function getLocalTimeZone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/* ------------------------------------------------------------
   Convert a given date/time to another time zone.
   ------------------------------------------------------------
   Example:
   convertToTimeZone(new Date(), "Asia/Tokyo")
   => "02:45:10 AM"
------------------------------------------------------------ */
export function convertToTimeZone(date, timeZone, options = {}) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    timeStyle: options.timeStyle || "medium",
    dateStyle: options.dateStyle || undefined, // optional: add "medium" to include date
    hour12: options.hour12 !== undefined ? options.hour12 : true,
  });

  return formatter.format(date);
}

/* ------------------------------------------------------------
   Format full date/time for a target time zone
   ------------------------------------------------------------
   Example:
   formatFullDateTime("Europe/London")
   => "Tuesday, October 21, 2025, 6:30:10 PM"
------------------------------------------------------------ */
export function formatFullDateTime(timeZone) {
  const now = new Date();
  return new Intl.DateTimeFormat("en-US", {
    timeZone,
    dateStyle: "full",
    timeStyle: "long",
  }).format(now);
}

/* ------------------------------------------------------------
   Get offset (difference in hours) between local and another zone
   ------------------------------------------------------------
   Example:
   getTimeZoneOffset("Asia/Tokyo")
   => +7 (meaning Tokyo is 7 hours ahead)
------------------------------------------------------------ */
export function getTimeZoneOffset(targetZone) {
  const localZone = getLocalTimeZone();
  const now = new Date();

  const localTime = new Date(
    new Intl.DateTimeFormat("en-US", { timeZone: localZone }).format(now)
  );
  const targetTime = new Date(
    new Intl.DateTimeFormat("en-US", { timeZone: targetZone }).format(now)
  );

  const diffHours = (targetTime - localTime) / (1000 * 60 * 60);
  return Math.round(diffHours * 10) / 10; // round to 1 decimal
}

/* ------------------------------------------------------------
   Fetch server time (from your Node API)
   Requires your server to have `/api/server-time` endpoint.
------------------------------------------------------------ */
export async function getServerTime() {
  try {
    const response = await fetch("http://localhost:5001/api/server-time");
    if (!response.ok) throw new Error("Failed to fetch server time");
    const data = await response.json();
    return data; // { utc, localTime, serverTimeZone, provider }
  } catch (err) {
    console.error("❌ getServerTime error:", err.message);
    return null;
  }
}

/* ============================================================
   TIME ZONE JSON UTILITIES
   (Uses the large timezones.json file)
============================================================ */

/* ----------------------------
   Get simplified list for dropdowns
---------------------------- */
export function getAllZones() {
  return timezones.map((tz) => ({
    label: tz.text,       // e.g. "(UTC+02:00) Harare, Pretoria"
    value: tz.utc[0],     // first IANA zone, e.g. "Africa/Johannesburg"
    abbr: tz.abbr,
    offset: tz.offset,
  }));
}

/* ----------------------------
   Find a timezone by IANA name
---------------------------- */
export function findZoneByIANA(ianaZone) {
  return timezones.find((tz) => tz.utc.includes(ianaZone));
}

/* ----------------------------
   Find a timezone by label text
---------------------------- */
export function findZoneByLabel(label) {
  return timezones.find((tz) => tz.text === label);
}

/* ----------------------------
   Convert numeric offset to readable UTC format
   Example: formatOffset(5.5) => "UTC+05:30"
---------------------------- */
export function formatOffset(offset) {
  const sign = offset >= 0 ? "+" : "-";
  const abs = Math.abs(offset);
  const hours = Math.floor(abs);
  const minutes = (abs - hours) * 60;
  return `UTC${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

/* ----------------------------
   Create a full searchable list for UI dropdowns
   Example label: "(UTC+02:00) Harare, Pretoria (Africa/Johannesburg)"
---------------------------- */
export function getTimeZoneOptions() {
  return timezones.flatMap((tz) =>
    tz.utc.map((iana) => ({
      label: `${tz.text} (${iana})`,
      value: iana,
      abbr: tz.abbr,
      offset: tz.offset,
    }))
  );
}
