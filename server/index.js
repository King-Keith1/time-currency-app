import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

/* ---------------- CURRENCY ---------------- */

// Currency rates
app.get("/api/currency/:base", async (req, res) => {
  const { base } = req.params;
  console.log(`Received /api/currency request for base: ${base}`);

  try {
    // Frankfurter API
    const url = `https://api.frankfurter.app/latest?from=${base}`;
    const response = await axios.get(url, { timeout: 5000 });

    res.json({
      provider: "frankfurter.app",
      base: response.data.base,
      rates: response.data.rates,
      date: response.data.date,
      raw: response.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

// Convert endpoint
app.get("/api/convert", async (req, res) => {
  const { from, to, amount } = req.query;

  if (!from || !to || !amount) {
    return res
      .status(400)
      .json({ error: "Missing required query params: from, to, amount" });
  }

  console.log(`Received /api/convert request: ${amount} ${from} -> ${to}`);

  try {
    const url = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;
    const response = await axios.get(url, { timeout: 5000 });

    res.json({
      provider: "frankfurter.app",
      query: { from, to, amount },
      result: response.data.rates[to],
      date: response.data.date,
      raw: response.data,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to convert currency" });
  }
});

/* ---------------- TIME ---------------- */

async function getTimeForZone(zone) {
  const providers = [
    {
  name: "timezonedb",
  url: `http://api.timezonedb.com/v2.1/get-time-zone?key=${process.env.TIMEZONEDB_KEY}&format=json&by=zone&zone=${zone}`,
  transform: (data) => ({
    datetime: data.formatted,
    timezone: data.zoneName,
    provider: "timezonedb",
  }),
}
  ];

  for (const provider of providers) {
    try {
      console.log(`🔗 Fetching from ${provider.name}: ${provider.url}`);
      const res = await axios.get(provider.url, { timeout: 5000 });
      console.log(`✅ Success from ${provider.name}`);
      return provider.transform(res.data);
    } catch (err) {
      console.log(`❌ Time provider ${provider.name} failed for ${zone}:`, err.message);
      continue;
    }
  }

  throw new Error("All time providers failed");
}


app.get('/api/time/Europe/London', (req, res) => {
  // Code to handle the request and send a response
  res.send('This is the time for Europe/London');
});

app.get('/api/time/:continent/:city', (req, res) => {
  const continent = req.params.continent;
  const city = req.params.city;
  // Code to handle the request and send a response
  res.send(`This is the time for ${continent}/${city}`);
});

// Single timezone
app.get("/api/time/:zone", async (req, res) => {
  const { zone } = req.params;
  console.log(`Received /api/time request for zone: ${zone}`);

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

  zones = zones.split(",");

  console.log(`Received /api/times request for zones: ${zones.join(", ")}`);

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

/* ---------------- SERVER ---------------- */

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
