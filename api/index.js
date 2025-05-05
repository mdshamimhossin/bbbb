import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const response = await fetch("https://hgzy.cc/api/game/result?page=1&limit=4");
    const data = await response.json();
    const list = data?.data?.list;

    if (!list || list.length < 4) {
      return res.status(500).json({ error: "Not enough game data." });
    }

    const numbers = list.map(item => parseInt(item.number));
    const colors = list.map(item => item.color);

    // Big/Small Prediction
    const avg = numbers.reduce((a, b) => a + b, 0) / numbers.length;
    const predictionBS = avg >= 14 ? "Big" : "Small";

    // Color Prediction Logic
    const count = { red: 0, green: 0, violet: 0 };
    colors.forEach(color => count[color]++);
    let predictionColor = Object.entries(count).sort((a, b) => b[1] - a[1])[0][0];

    res.status(200).json({
      lastResults: numbers,
      prediction: {
        bigSmall: predictionBS,
        color: predictionColor
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data", details: error.message });
  }
}
