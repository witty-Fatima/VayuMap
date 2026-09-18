const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());

const GRID_SIZE = 100;
const POWER = 2;


const SENSOR_SERVER_URL = "http://localhost:3001/aqi";


const POPULATION_DIR = path.join(__dirname, "population_data");

function getRandomPopulationMatrix() {
  const files = fs
    .readdirSync(POPULATION_DIR)
    .filter(f => f.endsWith(".json"));

  if (files.length === 0) {
    throw new Error("No population files found");
  }

  const randomFile = files[Math.floor(Math.random() * files.length)];
  return JSON.parse(
    fs.readFileSync(path.join(POPULATION_DIR, randomFile), "utf-8")
  );
}

function idwInterpolation(sensorData) {
  const grid = Array.from({ length: GRID_SIZE }, () =>
    Array(GRID_SIZE).fill(0)
  );

  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = i / (GRID_SIZE - 1);
      const y = j / (GRID_SIZE - 1);

      let num = 0;
      let den = 0;

      for (const s of sensorData) {
        const dx = x - s.x;
        const dy = y - s.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        if (d === 0) {
          num = s.aqi;
          den = 1;
          break;
        }

        const w = 1 / Math.pow(d, POWER);
        num += w * s.aqi;
        den += w;
      }

      grid[i][j] = num / (den + 1e-9);
    }
  }

  return grid;
}

app.get("/aqi_matrix", async (req, res) => {
  try {
    const response = await axios.get(SENSOR_SERVER_URL);
    const sensors = response.data.sensors;

    const matrix = idwInterpolation(sensors);

    res.json({
      timestamp: Date.now(),
      sensors,
      matrix
    });
  } catch (err) {
    res.status(500).json({ error: "Sensor server unavailable" });
  }
});

app.get("/population_matrix", (req, res) => {
  try {
    const populationMatrix = getRandomPopulationMatrix();
    res.json({
      timestamp: Date.now(),
      matrix: populationMatrix
    });
  } catch (err) {
    res.status(500).json({ error: "No population data available" });
  }
});

app.get("/priority_zones", async (req, res) => {
  try {
    // 1. Sensors
    const sensorRes = await axios.get(SENSOR_SERVER_URL);
    const sensors = sensorRes.data.sensors;

    // 2. AQI matrix
    const aqiMatrix = idwInterpolation(sensors);

    // 3. Population matrix
    const populationMatrix = getRandomPopulationMatrix();

    // 4. Normalize
    let aqiMin = Infinity, aqiMax = -Infinity;
    let popMin = Infinity, popMax = -Infinity;

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        aqiMin = Math.min(aqiMin, aqiMatrix[i][j]);
        aqiMax = Math.max(aqiMax, aqiMatrix[i][j]);
        popMin = Math.min(popMin, populationMatrix[i][j]);
        popMax = Math.max(popMax, populationMatrix[i][j]);
      }
    }

    const priority = [];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        const aqiNorm =
          (aqiMatrix[i][j] - aqiMin) / (aqiMax - aqiMin + 1e-9);
        const popNorm =
          (populationMatrix[i][j] - popMin) / (popMax - popMin + 1e-9);

        priority.push({
          x: i,
          y: j,
          score: 0.6 * aqiNorm + 0.4 * popNorm
        });
      }
    }

    priority.sort((a, b) => b.score - a.score);

    res.json({
      timestamp: Date.now(),
      top_5: priority.slice(0, 5)
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to compute priority" });
  }
});

const PORT = 2000;
app.listen(PORT, () => {
  console.log(`Processing server running on http://localhost:${PORT}`);
});