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

  console.log(
    `Received /api/convert request: ${amount} ${from} -> ${to}`
  );

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
      name: "timeapi.io",
      url: `https://timeapi.io/api/Time/current/zone?timeZone=${zone}`,
      transform: (data) => ({
        datetime: data.dateTime,
        timezone: data.timeZone,
        provider: "timeapi.io",
      }),
    },
    {
      name: "worldtimeapi",
      url: `http://worldtimeapi.org/api/timezone/${zone}`,
      transform: (data) => ({
        datetime: data.datetime,
        timezone: data.timezone,
        provider: "worldtimeapi",
      }),
    },
  ];

  for (const provider of providers) {
    try {
      const res = await axios.get(provider.url, { timeout: 5000 });
      return provider.transform(res.data);
    } catch (err) {
      console.log(`Time provider ${provider.name} failed:`, err.message);
      continue;
    }
  }

  throw new Error("All time providers failed");
}

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

/* ---------------- SERVER ---------------- */

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
