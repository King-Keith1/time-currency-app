import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

/* ------------------------  CURRENCY  ------------------------ */

// Get all rates for a base currency
app.get("/api/currency/:base", async (req, res) => {
  const { base } = req.params;
  console.log(`💱 Request: /api/currency/${base}`);

  try {
    const url = `https://api.frankfurter.app/latest?from=${base}`;
    const response = await axios.get(url, { timeout: 5000 });

    res.json({
      provider: "frankfurter.app",
      base: response.data.base,
      rates: response.data.rates,
      date: response.data.date,
    });
  } catch (error) {
    console.error("❌ Currency API error:", error.message);
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

// Convert specific amount
app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Missing required query params: from, to, amount" });
  }

  console.log(`💱 Converting: ${amount} ${from} -> ${to}`);

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const response = await axios.get(url, { timeout: 5000 });

    res.json({
      provider: "frankfurter.app",
      query: { from, to, amount },
      result: response.data.rates[to],
      date: response.data.date,
    });
  } catch (error) {
    console.error("❌ Conversion error:", error.message);
    res.status(500).json({ error: "Failed to convert currency" });
  }
});

/* ------------------------  TIME  ------------------------ */

// Helper: Try multiple providers (fallback strategy)
async function getTimeForZone(zone) {
  const providers = [
    {
      name: "worldtimeapi",
      url: `https://worldtimeapi.org/api/timezone/${zone}`,
      transform: (data) => ({
        datetime: data.datetime.slice(0, 19).replace("T", " "),
        timezone: data.timezone,
        abbreviation: data.abbreviation,
        provider: "worldtimeapi",
      }),
    },
    {
      name: "timeapi",
      url: `https://timeapi.io/api/Time/current/zone?timeZone=${zone}`,
      transform: (data) => ({
        datetime: `${data.year}-${String(data.month).padStart(2, "0")}-${String(
          data.day
        ).padStart(2, "0")} ${String(data.hour).padStart(2, "0")}:${String(
          data.minute
        ).padStart(2, "0")}:${String(data.seconds).padStart(2, "0")}`,
        timezone: data.timeZone,
        abbreviation: "",
        provider: "timeapi",
      }),
    },
  ];

  for (const provider of providers) {
    try {
      console.log(`⏱️ Fetching from ${provider.name}: ${provider.url}`);
      const res = await axios.get(provider.url, { timeout: 5000 });
      console.log(`✅ Success from ${provider.name}`);
      return provider.transform(res.data);
    } catch (err) {
      console.log(`❌ Provider ${provider.name} failed for ${zone}: ${err.message}`);
    }
  }

  throw new Error("All time providers failed");
}

// Single timezone
app.get("/api/time/*zone", async (req, res) => {
  const zoneSegments = req.params.zone;
  const zone = Array.isArray(zoneSegments) ? zoneSegments.join("/") : zoneSegments;
  console.log(`🕒 Request: /api/time/${zone}`);

  try {
    const data = await getTimeForZone(zone);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Multiple timezones
app.get("/api/times", async (req, res) => {
  let { zones } = req.query;

  if (!zones) {
    return res.status(400).json({ error: "Missing ?zones= param" });
  }

  zones = decodeURIComponent(zones).split(",");
  console.log(`🕒 Request: /api/times for ${zones.join(", ")}`);

  try {
    const results = await Promise.all(
      zones.map(async (zone) => {
        try {
          return await getTimeForZone(zone);
        } catch (err) {
          return { timezone: zone, error: err.message };
        }
      })
    );
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch times" });
  }
});

/* ------------------------  LOCAL SERVER TIME  ------------------------ */

// Get server's local time (offline, no API calls)
app.get("/api/server-time", (req, res) => {
  const now = new Date();

  res.json({
    utc: now.toISOString(),
    localTime: now.toLocaleString(),
    serverTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    provider: "local-system",
  });
});

/* ------------------------  START SERVER  ------------------------ */

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
