# **VayuMap**

**Air Quality Monitoring and Priority Mapping System**

VayuMap is an intelligent air quality monitoring system that integrates real-time AQI sensor data with population density analysis to identify and prioritize high-risk pollution zones.

---

## Overview

The system collects AQI data from distributed sensors, interpolates values across a 100×100 grid, and combines pollution intensity with population distribution to generate actionable priority zones for environmental intervention.

---

## Installation

```bash
git clone <repository-url>
cd VayuMap
```

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## Running the System

```bash
# Sensor server (Port 3001)
node backend/sensor_server.js

# Processing server (Port 2000)
node backend/server.js

# Frontend (Port 5173)
cd frontend
npm run dev
```

Open the application at:
**[http://localhost:5173](http://localhost:5173)**

---

## API Endpoints

### Sensor Server (3001)

* `GET /aqi` – Current sensor readings

### Processing Server (2000)

* `GET /aqi_matrix` – Interpolated AQI grid
* `GET /population_matrix` – Population density grid
* `GET /priority_zones` – Top priority zones

---

## Processing Logic

1. Collect real-time AQI values from sensors
2. Apply Inverse Distance Weighting (IDW) interpolation
3. Normalize AQI and population values
4. Compute priority score = 0.6 × AQI + 0.4 × Population
5. Rank and return highest priority zones

---
