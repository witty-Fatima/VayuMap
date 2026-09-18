const PriorityZones = ({ zones, loading }) => {
  const getScoreColor = (score) => {
    if (score >= 0.8) return 'bg-red-100 border-red-300';
    if (score >= 0.6) return 'bg-orange-100 border-orange-300';
    if (score >= 0.4) return 'bg-yellow-100 border-yellow-300';
    return 'bg-green-100 border-green-300';
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">Priority Zones</h2>
      <p className="text-sm text-gray-600 mb-4">
        Top 5 zones (60% AQI, 40% Population)
      </p>
      {loading ? (
        <p className="text-gray-500">Loading priority zones...</p>
      ) : zones && zones.length > 0 ? (
        <div className="space-y-3">
          {zones.map((zone, index) => (
            <div
              key={index}
              className={`p-4 border-l-4 rounded ${getScoreColor(zone.score)}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-gray-800 text-lg">
                    Zone {index + 1}
                  </p>
                  <p className="text-sm text-gray-600">
                    Priority Score: {(zone.score * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Coordinates</p>
                  <p className="text-lg font-mono font-bold text-gray-800">
                    ({zone.x}, {zone.y})
                  </p>
                </div>
              </div>
              
              {/* Grid coordinates info */}
              <div className="mb-2 p-2 bg-gray-50 rounded text-xs text-gray-700 font-mono">
                <span className="text-gray-600">Grid Position: </span>
                <span className="font-bold">X: {zone.x} | Y: {zone.y}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-gray-300 rounded-full h-2">
                <div
                  className="bg-gray-700 h-2 rounded-full transition-all"
                  style={{ width: `${zone.score * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No priority zones available</p>
      )}
    </div>
  );
};

export default PriorityZones;
