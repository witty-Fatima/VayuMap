import { useEffect, useRef } from 'react';

const PopulationHeatmap = ({ populationMatrix }) => {
  const canvasRef = useRef(null);

  // Color mapping based on population density
  const getColor = (value) => {
    if (!value) return 'rgb(255, 255, 255)';
    
    // Normalize to 0-1 range for color mapping
    const normalized = Math.min(1, value / 1000); // Adjust 1000 based on your data
    
    if (normalized === 0) return `rgb(255, 255, 255)`; // White - No population
    if (normalized <= 0.2) return `rgb(200, 220, 255)`; // Light blue - Low
    if (normalized <= 0.4) return `rgb(100, 180, 255)`; // Medium blue - Low-medium
    if (normalized <= 0.6) return `rgb(50, 100, 255)`; // Darker blue - Medium
    if (normalized <= 0.8) return `rgb(0, 50, 200)`; // Deep blue - High
    return `rgb(0, 20, 100)`; // Very deep blue - Very high
  };

  useEffect(() => {
    if (!canvasRef.current || !populationMatrix) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const gridSize = populationMatrix.length;
    const cellSize = canvas.width / gridSize;

    // Clear canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw population heatmap
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const value = populationMatrix[i][j];
        ctx.fillStyle = getColor(value);
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }

    // Draw grid lines (optional - every 10 cells)
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.3)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= gridSize; i += 10) {
      const pos = (i / gridSize) * canvas.width;
      ctx.beginPath();
      ctx.moveTo(pos, 0);
      ctx.lineTo(pos, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, pos);
      ctx.lineTo(canvas.width, pos);
      ctx.stroke();
    }
  }, [populationMatrix]);

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Population Density Heatmap</h2>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="border-2 border-gray-300 rounded"
      />
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(255, 255, 255)' }}></div>
          <span>None (0)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(200, 220, 255)' }}></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(100, 180, 255)' }}></div>
          <span>Low-Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(50, 100, 255)' }}></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(0, 50, 200)' }}></div>
          <span>High</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'rgb(0, 20, 100)' }}></div>
          <span>Very High</span>
        </div>
      </div>
    </div>
  );
};

export default PopulationHeatmap;
