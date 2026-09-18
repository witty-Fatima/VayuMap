import { useState, useEffect } from 'react';
import HeatmapVisualization from './HeatmapVisualization';
import PopulationHeatmap from './PopulationHeatmap';
import SensorsList from './SensorsList';
import PriorityZones from './PriorityZones';
import { apiService } from '../services/api';

const Dashboard = () => {
  const [aqiData, setAqiData] = useState(null);
  const [populationData, setPopulationData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('aqi'); // Tab state: 'aqi' or 'population'

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [aqi, population, priority, sensors] = await Promise.all([
        apiService.getAQIMatrix(),
        apiService.getPopulationMatrix(),
        apiService.getPriorityZones(),
        apiService.getSensorData()
      ]);

      setAqiData(aqi);
      setPopulationData(population);
      setPriorityData(priority);
      setSensorData(sensors);
      setLastUpdate(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">VayuMap</h1>
          <p className="text-lg text-gray-600">Air Quality Monitoring & Prediction System</p>
          {lastUpdate && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdate}
              {!loading && <span className="ml-2 inline-block w-3 h-3 bg-green-500 rounded-full"></span>}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg">
            <p className="text-red-800 font-semibold">Error: {error}</p>
            <p className="text-red-700 text-sm mt-2">
              Make sure both backend servers (port 2000 and 3001) are running.
            </p>
          </div>
        )}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Heatmaps with Tabs */}
          <div className="lg:col-span-2">
            {/* Tab Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setActiveTab('aqi')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'aqi'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-indigo-400'
                }`}
              >
                AQI Heatmap
              </button>
              <button
                onClick={() => setActiveTab('population')}
                className={`px-6 py-2 rounded-lg font-semibold transition ${
                  activeTab === 'population'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'bg-white text-gray-800 border-2 border-gray-300 hover:border-indigo-400'
                }`}
              >
                Population Heatmap
              </button>
            </div>

            {/* AQI Heatmap Tab */}
            {activeTab === 'aqi' && (
              aqiData ? (
                <HeatmapVisualization
                  aqiMatrix={aqiData.matrix}
                  sensors={aqiData.sensors}
                  priorityZones={priorityData?.top_5}
                />
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500">Loading AQI heatmap...</p>
                </div>
              )
            )}

            {/* Population Heatmap Tab */}
            {activeTab === 'population' && (
              populationData ? (
                <PopulationHeatmap populationMatrix={populationData.matrix} />
              ) : (
                <div className="bg-white p-4 rounded-lg shadow-lg h-96 flex items-center justify-center">
                  <p className="text-gray-500">Loading population heatmap...</p>
                </div>
              )
            )}
          </div>

          {/* Right Column - Info Panels */}
          <div className="space-y-8">
            {/* Sensors Panel */}
            <SensorsList sensors={sensorData?.sensors} loading={loading} />

            {/* Priority Zones Panel */}
            <PriorityZones zones={priorityData?.top_5} loading={loading} />

            {/* Stats Panel */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4 text-gray-800">Stats</h2>
              <div className="space-y-3">
                {aqiData && (
                  <>
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-gray-600 text-sm">Grid Size</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {aqiData.matrix?.length || 0}x{aqiData.matrix?.[0]?.length || 0}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-gray-600 text-sm">Active Sensors</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {aqiData.sensors?.length || 0}
                      </p>
                    </div>
                  </>
                )}
                {priorityData && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-gray-600 text-sm">Top Priority Zones</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {priorityData.top_5?.length || 0}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={fetchData}
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
