const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors({
  origin: "https://app.strateco.ai",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.options("*", cors());

const fetchVolume = async (keyword) => {
  const credentials = Buffer.from("jacopo.matteuzzi@studiosamo.it:13a52e8ec2fb79cd").toString("base64");

  const response = await axios.post(
    "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live",
    [
      {
        keywords: [keyword],
        language_code: "it",
        location_code: 2380
      }
    ],
    {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

app.post("/api/volume", async (req, res) => {
  const { keyword } = req.body;
  console.log("POST ricevuto da StrateCo:", req.body);

  if (!keyword) {
    return res.status(400).json({ error: "Keyword mancante" });
  }

  try {
    const data = await fetchVolume(keyword);
    res.json(data);
  } catch (error) {
    console.error("Errore nella chiamata POST:", error.message);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.get("/api/volume", async (req, res) => {
  const keyword = req.query.keyword;
  console.log("GET ricevuto da StrateCo:", keyword);

  if (!keyword) {
    return res.status(400).json({ error: "Parametro 'keyword' mancante" });
  }

  try {
    const data = await fetchVolume(keyword);
    res.json(data);
  } catch (error) {
    console.error("Errore nella chiamata GET:", error.message);
    res.status(500).json({ error: "Errore interno del server" });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy DataForSEO attivo su http://localhost:${PORT}/api/volume`);
});