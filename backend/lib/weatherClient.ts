import axios from 'axios'

const OW_BASE = 'https://api.openweathermap.org/data/2.5'
const OW_KEY = process.env.OPENWEATHER_API_KEY

const owClient = axios.create({
  baseURL: OW_BASE,
  timeout: 10000,
})

/**
 * Get current weather by city name
 */
export const getCurrentWeather = (city: string, units = 'metric') =>
  owClient.get('/weather', {
    params: { q: city, appid: OW_KEY, units },
  })

/**
 * Get 5-day/3-hour forecast by city name
 */
export const getWeatherForecast = (city: string, units = 'metric') =>
  owClient.get('/forecast', {
    params: { q: city, appid: OW_KEY, units, cnt: 40 },
  })

/**
 * Get Air Pollution data by lat/lon
 */
export const getAirPollution = (lat: number, lon: number) =>
  owClient.get('/air_pollution', {
    params: { lat, lon, appid: OW_KEY },
  })

/**
 * Geocode city → lat/lon
 */
export const geocodeCity = async (city: string): Promise<{ lat: number; lon: number }> => {
  const res = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
    params: { q: city, limit: 1, appid: OW_KEY },
  })
  if (!res.data[0]) throw new Error(`City not found: ${city}`)
  return { lat: res.data[0].lat, lon: res.data[0].lon }
}
