const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

// 5 fixed AQI sensors
let sensors = [
  { x: 0.0, y: 0.0, aqi: 300 },
  { x: 1.0, y: 0.0, aqi: 100 },
  { x: 0.0, y: 1.0, aqi: 50 },
  { x: 1.0, y: 1.0, aqi: 250 },
  { x: 0.5, y: 0.5, aqi: 120 }
];

// Small realistic AQI drift
function updateAQI() {
  sensors = sensors.map(s => {
    const delta = Math.floor(Math.random() * 5 - 2); // -2 → +2
    return {
      ...s,
      aqi: Math.max(30, Math.min(300, s.aqi + delta))
    };
  });
}

// Update every 3 seconds
setInterval(updateAQI, 3000);

// Expose sensor data
app.get("/aqi", (req, res) => {
  res.json({ sensors });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`AQI Sensor Server running on http://localhost:${PORT}`);
});