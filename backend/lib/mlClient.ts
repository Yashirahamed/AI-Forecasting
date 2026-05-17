import axios from 'axios'

const ML_BASE = process.env.ML_SERVICE_URL ?? 'http://localhost:8000'

const mlClient = axios.create({
  baseURL: ML_BASE,
  timeout: 30000,
})

/**
 * Get LSTM temperature forecast from ML service
 */
export const getLSTMForecast = (city: string, days = 7) =>
  mlClient.get('/forecast', { params: { city, days } })

/**
 * Get anomaly detection results from ML service
 */
export const detectAnomalies = (city: string) =>
  mlClient.get('/anomaly', { params: { city } })
