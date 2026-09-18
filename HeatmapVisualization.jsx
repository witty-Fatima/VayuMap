import { useEffect, useRef } from 'react';

const HeatmapVisualization = ({ aqiMatrix, sensors, priorityZones }) => {
  const canvasRef = useRef(null);

  // Color mapping based on AQI values
  const getColor = (value) => {
    // Normalize value to 0-300 AQI scale
    const aqi = Math.min(300, Math.max(0, value));
    
    if (aqi <= 50) return `rgb(0, 228, 0)`; // Green - Good
    if (aqi <= 100) return `rgb(255, 228, 0)`; // Yellow - Moderate
    if (aqi <= 150) return `rgb(255, 165, 0)`; // Orange - Unhealthy for Sensitive Groups
    if (aqi <= 200) return `rgb(255, 0, 0)`; // Red - Unhealthy
    if (aqi <= 300) return `rgb(139, 0, 0)`; // Dark Red - Very Unhealthy
    return `rgb(75, 0, 130)`; // Indigo - Hazardous
  };

  useEffect(() => {
    if (!canvasRef.current || !aqiMatrix) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = aqiMatrix.length;
    const cellSize = canvas.width / gridSize;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw heatmap
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const value = aqiMatrix[i][j];
        ctx.fillStyle = getColor(value);
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }

    // Draw sensor points
    if (sensors) {
      sensors.forEach(sensor => {
        const x = sensor.x * canvas.width;
        const y = sensor.y * canvas.height;
        
        ctx.fillStyle = 'blue';
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(sensor.aqi.toString(), x, y);
      });
    }

    // Draw priority zones
    if (priorityZones) {
      priorityZones.forEach((zone, index) => {
        const cellX = zone.y * cellSize;
        const cellY = zone.x * cellSize;
        
        ctx.strokeStyle = 'purple';
        ctx.lineWidth = 3;
        ctx.strokeRect(cellX, cellY, cellSize, cellSize);
        
        ctx.fillStyle = 'purple';
        ctx.font = 'bold 12px Arial';
        ctx.fillText(index + 1, cellX + cellSize / 2, cellY - 10);
      });
    }
  }, [aqiMatrix, sensors, priorityZones]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">AQI Heatmap</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border-2 border-gray-300 rounded"
      />
      <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(0, 228, 0)' }}></div>
          <span>Good (0-50)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(255, 228, 0)' }}></div>
          <span>Moderate (51-100)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(255, 165, 0)' }}></div>
          <span>Unhealthy SG (101-150)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(255, 0, 0)' }}></div>
          <span>Unhealthy (151-200)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(139, 0, 0)' }}></div>
          <span>Very Unhealthy (201-300)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(75, 0, 130)' }}></div>
          <span>Hazardous (300+)</span>
        </div>
      </div>
    </div>
  );
};

export default HeatmapVisualization;
