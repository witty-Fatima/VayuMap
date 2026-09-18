import axios from 'axios';

const API_BASE_URL = 'http://localhost:2000';
const SENSOR_API_URL = 'http://localhost:3001';

export const apiService = {
  // Get AQI matrix with interpolated values
  getAQIMatrix: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/aqi_matrix`);
      return response.data;
    } catch (error) {
      console.error('Error fetching AQI matrix:', error);
      throw error;
    }
  },

  // Get population matrix
  getPopulationMatrix: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/population_matrix`);
      return response.data;
    } catch (error) {
      console.error('Error fetching population matrix:', error);
      throw error;
    }
  },

  // Get priority zones
  getPriorityZones: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/priority_zones`);
      return response.data;
    } catch (error) {
      console.error('Error fetching priority zones:', error);
      throw error;
    }
  },

  // Get sensor data
  getSensorData: async () => {
    try {
      const response = await axios.get(`${SENSOR_API_URL}/aqi`);
      return response.data;
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      throw error;
    }
  }
};
