import axiosInstance from './axiosInstance'
import axios from 'axios'

const OW_KEY = import.meta.env.VITE_OPENWEATHER_KEY
const OW_BASE = 'https://api.openweathermap.org/data/2.5'

// ─── Internal direct OpenWeatherMap calls (no backend) ────────
const owClient = axios.create({ baseURL: OW_BASE })

/**
 * Get current weather for a city via our backend (cached)
 */
export const getCurrentWeather = (city: string) =>
  axiosInstance.get(`/weather/${encodeURIComponent(city)}`)

/**
 * Get 7-day forecast for a city via our backend (cached)
 */
export const get7DayForecast = (city: string) =>
  axiosInstance.get(`/forecast/${encodeURIComponent(city)}`)

/**
 * Get AQI data for a city via our backend
 */
export const getAQI = (city: string) =>
  axiosInstance.get(`/aqi/${encodeURIComponent(city)}`)

/**
 * Get current weather directly from OpenWeatherMap (fallback)
 */
export const getWeatherDirect = (city: string) =>
  owClient.get('/weather', {
    params: { q: city, appid: OW_KEY, units: 'metric' },
  })

/**
 * Get 5-day/3-hour forecast directly from OpenWeatherMap
 */
export const getForecastDirect = (city: string) =>
  owClient.get('/forecast', {
    params: { q: city, appid: OW_KEY, units: 'metric', cnt: 40 },
  })

/**
 * Get AQI directly from OpenWeatherMap using lat/lon
 */
export const getAQIDirect = (lat: number, lon: number) =>
  owClient.get('/air_pollution', {
    params: { lat, lon, appid: OW_KEY },
  })
