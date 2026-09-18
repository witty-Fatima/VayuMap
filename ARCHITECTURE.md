# VayuMap Frontend - Architecture Overview

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           VAYUMAP SYSTEM                                     │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────┐      ┌─────────────────────────────┐  │
│  │   SENSOR SERVER (Port 3001)     │      │ PROCESSING SERVER (Port 2000)│  │
│  │                                 │      │                             │  │
│  │  sensor_server.js              │      │  server.js                 │  │
│  │                                 │      │                             │  │
│  │  ┌─────────────────────────┐    │      │  ┌──────────────────────┐  │  │
│  │  │ 5 AQI Sensors          │    │      │  │ IDW Interpolation  │  │  │
│  │  │ • (0.0, 0.0, 90)       │    │      │  │ • 100x100 Grid     │  │  │
│  │  │ • (1.0, 0.0, 130)      │    │      │  │ • Power = 2        │  │  │
│  │  │ • (0.0, 1.0, 100)      │    │      │  │                    │  │  │
│  │  │ • (1.0, 1.0, 150)      │    ┤──────┤─ │ Priority Calc      │  │  │
│  │  │ • (0.5, 0.5, 115)      │    │      │  │ • 60% AQI          │  │  │
│  │  │                         │    │      │  │ • 40% Population   │  │  │
│  │  │ Updates: Every 3s      │    │      │  │                    │  │  │
│  │  │ Drift: -2 to +2        │    │      │  │ Population Data    │  │  │
│  │  └─────────────────────────┘    │      │  │ • Random select    │  │  │
│  │                                 │      │  │                    │  │  │
│  │  GET /aqi                      │      │  │ GET /aqi_matrix    │  │  │
│  │  └─ Returns →                  │      │  │ └─ Returns →       │  │  │
│  │     { sensors: [...] }         │      │  │    {matrix, sensors}  │  │  │
│  │                                 │      │  │                    │  │  │
│  │                                 │      │  │ GET /priority_zones│  │  │
│  │                                 │      │  │ └─ Returns →       │  │  │
│  │                                 │      │  │    { top_5: [...] }  │  │  │
│  └─────────────────────────────────┘      │  └──────────────────────┘  │  │
│           ▲                               └─────────────────────────────┘  │
│           │  Fetches sensor data when called                              │
│           │                                                                │
│           └────────────────────────────────────────────────────────────────┘
│
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    FRONTEND (Vite + React)                           │  │
│  │                    Port 5173 (Dev) / 3000 (Prod)                    │  │
│  │                                                                      │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │                    App.jsx (Entry)                          │  │  │
│  │  │                  └─ <Dashboard />                           │  │  │
│  │  └─────────────────────────▲───────────────────────────────────┘  │  │
│  │                            │                                        │  │
│  │  ┌────────────────────────────────────────────────────────────┐   │  │
│  │  │  Dashboard.jsx (Orchestrator)                              │   │  │
│  │  │                                                            │   │  │
│  │  │  State:                                                  │   │  │
│  │  │  • aqiData (matrix + sensors)                           │   │  │
│  │  │  • priorityData (top 5 zones)                           │   │  │
│  │  │  • sensorData (sensor readings)                         │   │  │
│  │  │  • loading (boolean)                                    │   │  │
│  │  │  • error (error message)                                │   │  │
│  │  │  • lastUpdate (timestamp)                               │   │  │
│  │  │                                                            │   │  │
│  │  │  useEffect → fetchData() every 5 seconds                  │   │  │
│  │  │     ├─ apiService.getAQIMatrix()                          │   │  │
│  │  │     ├─ apiService.getPriorityZones()                      │   │  │
│  │  │     └─ apiService.getSensorData()                         │   │  │
│  │  │                                                            │   │  │
│  │  │  Renders:                                                 │   │  │
│  │  │  ┌────────────┬──────────────────────────────────────┐   │   │  │
│  │  │  │ Heatmap    │     Right Panel                     │   │   │  │
│  │  │  │            │  ┌─────────────────────────────┐   │   │   │  │
│  │  │  │ 600x600    │  │ SensorsList                 │   │   │   │  │
│  │  │  │ Canvas     │  │ • 5 Sensor Cards            │   │   │   │  │
│  │  │  │ • Grid     │  │ • Status badges             │   │   │   │  │
│  │  │  │ • Sensors  │  │ • AQI values                │   │   │   │  │
│  │  │  │ • Zones    │  ├─────────────────────────────┤   │   │   │  │
│  │  │  │ • Legend   │  │ PriorityZones               │   │   │   │  │
│  │  │  │            │  │ • Top 5 zones               │   │   │   │  │
│  │  │  │            │  │ • Priority scores           │   │   │   │  │
│  │  │  │            │  │ • Progress bars             │   │   │   │  │
│  │  │  │            │  ├─────────────────────────────┤   │   │   │  │
│  │  │  │            │  │ Stats                       │   │   │   │  │
│  │  │  │            │  │ • Grid size                 │   │   │   │  │
│  │  │  │            │  │ • Active sensors            │   │   │   │  │
│  │  │  │            │  │ • Priority zones            │   │   │   │  │
│  │  │  │            │  ├─────────────────────────────┤   │   │   │  │
│  │  │  │            │  │ Refresh Button              │   │   │   │  │
│  │  │  │            │  └─────────────────────────────┘   │   │   │  │
│  │  │  └────────────┴──────────────────────────────────┘   │   │   │  │
│  │  │                                                            │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  src/services/api.js (API Integration)                 │   │  │
│  │  │                                                        │   │  │
│  │  │  • getAQIMatrix()          → GET /aqi_matrix        │   │  │
│  │  │  • getPriorityZones()      → GET /priority_zones    │   │  │
│  │  │  • getSensorData()         → GET /aqi              │   │  │
│  │  │                                                        │   │  │
│  │  │  All using axios with error handling                 │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  Components                                            │   │  │
│  │  │                                                        │   │  │
│  │  │  HeatmapVisualization.jsx                             │   │  │
│  │  │  • Canvas rendering (600x600)                         │   │  │
│  │  │  • Color mapping (AQI → RGB)                          │   │  │
│  │  │  • Sensor overlay (blue circles)                      │   │  │
│  │  │  • Priority overlay (purple rectangles)               │   │  │
│  │  │  • Legend display                                      │   │  │
│  │  │                                                        │   │  │
│  │  │  SensorsList.jsx                                      │   │  │
│  │  │  • Sensor cards (1-5)                                 │   │  │
│  │  │  • Status colors                                      │   │  │
│  │  │  • Coordinates display                                │   │  │
│  │  │  • AQI values                                          │   │  │
│  │  │                                                        │   │  │
│  │  │  PriorityZones.jsx                                    │   │  │
│  │  │  • Zone cards (1-5)                                   │   │  │
│  │  │  • Priority scores                                    │   │  │
│  │  │  • Progress bars                                      │   │  │
│  │  │  • Color coding by priority                           │   │  │
│  │  │                                                        │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │  ┌────────────────────────────────────────────────────────┐   │  │
│  │  │  Styling                                               │   │  │
│  │  │                                                        │   │  │
│  │  │  • Tailwind CSS (utility-first)                       │   │  │
│  │  │  • Custom CSS (animations, canvas)                    │   │  │
│  │  │  • Responsive grid layout                             │   │  │
│  │  │  • Color palette (AQI based)                          │   │  │
│  │  │                                                        │   │  │
│  │  └────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
User Opens http://localhost:5173
         │
         ▼
    App.jsx
         │
         ▼
    <Dashboard />
         │
         ├──────────────────────────────────────────┐
         │                                          │
         ▼                                          │
    useEffect (mount)                              │
    fetchData() ─────────────┐                    │
         │                  │                      │
         │                  ├─ Promise.all() for   │
         │                  │  parallel requests   │
         │                  │                      │
    ┌────┴────┬──────────┬──────────┐             │
    │          │          │          │             │
    ▼          ▼          ▼          ▼             │
    │          │          │          │             │
    axios.get  axios.get  axios.get  Wait for all  │
    /aqi_m     /priority_z/aqi       responses    │
    atrix      ones                  │             │
    │          │          │          ▼             │
    │          │          │   Parse JSON           │
    ▼          ▼          ▼          │             │
setAqiData() setPrior setPSensor   ▼             │
    │              ityData()   Data()   Update State │
    │               │             │       │          │
    └───────────────┼─────────────┼───────┘         │
                    │             │                 │
                    ▼             ▼                 │
            Re-render Dashboard   │                 │
                    │             │                 │
    ┌───────────────┼─────────────┼────────────┐   │
    │               │             │            │    │
    ▼               ▼             ▼            ▼    │
Heatmap       Sensors List  Priority Zones  Stats  │
Canvas                                             │
│                                                  │
├─ Render AQI grid    Render 5 sensors  Render top Panel   │
├─ Overlay sensors    ├─ Cards          5 zones   │       │
├─ Overlay zones      ├─ Colors         ├─ Cards  │   ▼   │
└─ Color legend       ├─ Values         ├─ Scores setInterval
                      └─ Status         └─ Bars   (5000ms)
                                                 │
                                        setInterval runs
                                        again (loop)
```

---

## Component Hierarchy

```
App.jsx
│
└── Dashboard.jsx
    │
    ├── Error Boundary (conditional)
    │
    ├── Header Section
    │   ├── Title: "VayuMap"
    │   ├── Subtitle: "Air Quality Monitoring & Prediction System"
    │   └── Last Update Timestamp
    │
    ├── Main Grid (responsive)
    │   │
    │   ├── Left Column (2/3)
    │   │   │
    │   │   └── HeatmapVisualization.jsx
    │   │       │
    │   │       ├── Canvas Element (600x600)
    │   │       │   ├── Background (white)
    │   │       │   ├── Grid Cells (100x100)
    │   │       │   │   └── Color based on AQI
    │   │       │   ├── Sensor Overlay
    │   │       │   │   └── Blue circles with AQI labels
    │   │       │   └── Priority Zones Overlay
    │   │       │       └── Purple rectangles with numbers
    │   │       │
    │   │       └── Legend (color scale)
    │   │           ├── Green: Good (0-50)
    │   │           ├── Yellow: Moderate (51-100)
    │   │           ├── Orange: Unhealthy for SG (101-150)
    │   │           ├── Red: Unhealthy (151-200)
    │   │           ├── Dark Red: Very Unhealthy (201-300)
    │   │           └── Indigo: Hazardous (300+)
    │   │
    │   └── Right Column (1/3)
    │       │
    │       ├── SensorsList.jsx
    │       │   │
    │       │   └── For each sensor (1-5):
    │       │       ├── Card Container
    │       │       │   ├── Sensor number
    │       │       │       ├── Location (x, y)
    │       │       │       ├── AQI value (large)
    │       │       │       └── Status (colored)
    │       │       │
    │       │       └── Color classes (bg-green-100, etc)
    │       │
    │       ├── PriorityZones.jsx
    │       │   │
    │       │   └── For each zone (1-5):
    │       │       ├── Card Container
    │       │       │   ├── Zone number
    │       │       │   ├── Grid Position (x, y)
    │       │       │   ├── Priority Score (%)
    │       │       │   └── Progress Bar
    │       │       │
    │       │       └── Color by score
    │       │
    │       ├── Stats Panel
    │       │   ├── Grid Size: 100x100
    │       │   ├── Active Sensors: N
    │       │   └── Priority Zones: N
    │       │
    │       └── Refresh Button
    │           └── Manual data refresh
    │
    └── Footer (optional)
        └── Last update info
```

---

## Request-Response Flow

```
Dashboard Component
│
├─→ fetch 1: GET /aqi_matrix (port 2000)
│   ├─ Processing Server
│   │  ├─ Fetches from Sensor Server (/aqi, port 3001)
│   │  ├─ Performs IDW Interpolation
│   │  └─ Returns 100x100 grid
│   │
│   ←─ 200 OK
│   │  {
│   │    "timestamp": 1708420800000,
│   │    "sensors": [{x, y, aqi}, ...],
│   │    "matrix": [[...], [...], ...]
│   │  }
│   │
│   └─→ setAqiData()
│
├─→ fetch 2: GET /priority_zones (port 2000)
│   ├─ Processing Server
│   │  ├─ Fetches AQI matrix
│   │  ├─ Loads population data
│   │  ├─ Calculates priority scores
│   │  └─ Returns top 5 zones
│   │
│   ←─ 200 OK
│   │  {
│   │    "timestamp": 1708420800000,
│   │    "top_5": [{x, y, score}, ...]
│   │  }
│   │
│   └─→ setPriorityData()
│
└─→ fetch 3: GET /aqi (port 3001)
   ├─ Sensor Server
   │  └─ Returns current sensor readings
   │
   ←─ 200 OK
   │  {
   │    "sensors": [{x, y, aqi}, ...]
   │  }
   │
   └─→ setSensorData()

All 3 requests run in parallel → All state updated → Re-render
```

---

## Update Cycle

```
Time    Event
───────────────────────────────────────────────────────
0ms     Dashboard mounts
        └─ useEffect + fetchData()

50ms    Sensor Server (/aqi) responds
        └─ setSensorData()

100ms   Processing Server (/aqi_matrix, /priority_zones) respond
        ├─ setAqiData()
        └─ setPriorityData()

150ms   All state updated
        └─ Components re-render

200ms   HeatmapVisualization renders
        └─ Canvas drawn (600x600)

250ms   SensorsList renders
        └─ 5 sensor cards

300ms   PriorityZones renders
        └─ 5 zone cards

350ms   All rendering complete
        └─ UI fully updated

5000ms  setInterval triggers
        ├─ fetchData() called again
        └─ Repeat cycle from 50ms
```

---

## Error Handling Flow

```
fetchData()
│
├─ Promise.all([ ... ]) runs all requests
│
└─ try-catch block
   │
   ├─ success
   │  ├─ Parse responses
   │  ├─ Update state
   │  ├─ Clear error
   │  └─ setLastUpdate()
   │
   └─ error
      ├─ Catch error
      ├─ Log to console
      ├─ Set error message
      │  └─ "Failed to fetch data"
      ├─ Display error UI
      │  └─ "Make sure backend servers (port 2000, 3001) running"
      └─ Clear loading state
```

---

## State Management

```
Dashboard State
│
├─ aqiData
│  ├─ matrix: Array<Array<number>>     (100x100)
│  ├─ sensors: Array<{x, y, aqi}>     (5 sensors)
│  └─ timestamp: number
│
├─ priorityData
│  ├─ top_5: Array<{x, y, score}>     (5 zones)
│  └─ timestamp: number
│
├─ sensorData
│  ├─ sensors: Array<{x, y, aqi}>     (5 sensors)
│  └─ timestamp: number
│
├─ loading: boolean
│  └─ true while fetching, false after
│
├─ error: string | null
│  └─ Error message if any request fails
│
└─ lastUpdate: string | null
   └─ HH:MM:SS format
```

---

## UI Layout (Responsive)

### Desktop (1024px+)
```
┌─────────────────────────────────────┐
│ VayuMap | Last updated: HH:MM:SS   │
├─────────────────┬───────────────────┤
│                 │                   │
│   Heatmap       │  Sensors List    │
│   Canvas        │                   │
│   600x600       │  Priority Zones  │
│                 │                   │
│                 │  Stats           │
│                 │                   │
│                 │  Refresh Button  │
└─────────────────┴───────────────────┘
```

### Tablet (768px-1023px)
```
┌────────────────────────────────┐
│ VayuMap                        │
├────────────────────────────────┤
│   Heatmap Canvas               │
│   (responsive width)           │
├────────────────────────────────┤
│   Sensors List                 │
├────────────────────────────────┤
│   Priority Zones               │
├────────────────────────────────┤
│   Stats + Refresh              │
└────────────────────────────────┘
```

### Mobile (<768px)
```
┌──────────────────┐
│ VayuMap          │
├──────────────────┤
│   Heatmap        │
│   (full width)   │
├──────────────────┤
│   Sensors        │
├──────────────────┤
│   Zones          │
├──────────────────┤
│   Stats          │
├──────────────────┤
│   Refresh        │
└──────────────────┘
```

---

## Summary

This architecture ensures:
- ✅ Clean separation of concerns
- ✅ Efficient parallel data fetching
- ✅ Real-time UI updates
- ✅ Responsive design
- ✅ Error handling
- ✅ Scalability for future enhancements
