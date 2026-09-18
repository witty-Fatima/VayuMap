const SensorsList = ({ sensors, loading }) => {
  const getAQIStatus = (aqi) => {
    if (aqi <= 50) return { status: 'Good', color: 'green' };
    if (aqi <= 100) return { status: 'Moderate', color: 'yellow' };
    if (aqi <= 150) return { status: 'Unhealthy for Sensitive Groups', color: 'orange' };
    if (aqi <= 200) return { status: 'Unhealthy', color: 'red' };
    if (aqi <= 300) return { status: 'Very Unhealthy', color: 'purple' };
    return { status: 'Hazardous', color: 'indigo' };
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Sensors</h2>
      {loading ? (
        <p className="text-gray-500">Loading sensors...</p>
      ) : sensors && sensors.length > 0 ? (
        <div className="space-y-3">
          {sensors.map((sensor, index) => {
            const { status, color } = getAQIStatus(sensor.aqi);
            const colorMap = {
              green: 'bg-green-100 border-green-300',
              yellow: 'bg-yellow-100 border-yellow-300',
              orange: 'bg-orange-100 border-orange-300',
              red: 'bg-red-100 border-red-300',
              purple: 'bg-purple-100 border-purple-300',
              indigo: 'bg-indigo-100 border-indigo-300'
            };

            return (
              <div
                key={index}
                className={`p-3 border-l-4 rounded ${colorMap[color]}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-700">
                      Sensor {index + 1}
                    </p>
                    <p className="text-sm text-gray-600">
                      Location: ({sensor.x.toFixed(2)}, {sensor.y.toFixed(2)})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-800">
                      {sensor.aqi}
                    </p>
                    <p className={`text-sm font-semibold text-${color}-700`}>
                      {status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No sensors available</p>
      )}
    </div>
  );
};

export default SensorsList;
