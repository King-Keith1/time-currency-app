import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example currency endpoint
app.get("/api/currency/:base", async (req, res) => {
  const { base } = req.params;
  try {
    // Example free API (ExchangeRate.host doesn’t need an API key)
    const response = await axios.get(`https://api.exchangerate.host/latest?base=${base}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch exchange rates" });
  }
});

// Example time endpoint
app.get("/api/time/:zone", async (req, res) => {
  const { zone } = req.params;
  try {
    const response = await axios.get(`http://worldtimeapi.org/api/timezone/${zone}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch time" });
  }
});

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
