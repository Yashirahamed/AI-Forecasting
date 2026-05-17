import { WeatherData, AQIData } from '@/types/weather.types'

/**
 * Convert Celsius to Fahrenheit
 */
export const celsiusToF = (c: number): number => Math.round((c * 9) / 5 + 32)

/**
 * Format temperature with unit symbol
 */
export const formatTemp = (celsius: number, unit: 'celsius' | 'fahrenheit'): string =>
  unit === 'celsius' ? `${Math.round(celsius)}°C` : `${celsiusToF(celsius)}°F`

/**
 * Get wind direction as compass bearing string
 */
export const windDirection = (deg: number): string => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(deg / 22.5) % 16]
}

/**
 * Format Unix timestamp to readable time
 */
export const formatTime = (unix: number, timezone: number): string => {
  const date = new Date((unix + timezone) * 1000)
  const hours = date.getUTCHours().toString().padStart(2, '0')
  const minutes = date.getUTCMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

/**
 * Format Unix timestamp to date string (e.g. "Mon, May 17")
 */
export const formatDate = (unix: number): string => {
  return new Date(unix * 1000).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Get OpenWeatherMap icon URL
 */
export const getWeatherIconUrl = (icon: string, size: '1x' | '2x' | '4x' = '2x'): string =>
  `https://openweathermap.org/img/wn/${icon}@${size}.png`

/**
 * Get background gradient based on weather condition
 */
export const getWeatherGradient = (icon: string): string => {
  const code = icon.replace('n', 'd')
  const gradients: Record<string, string> = {
    '01d': 'from-sky-400 via-blue-500 to-indigo-600',       // clear
    '02d': 'from-sky-300 via-blue-400 to-slate-500',        // few clouds
    '03d': 'from-slate-400 via-slate-500 to-slate-600',     // scattered clouds
    '04d': 'from-slate-500 via-gray-600 to-gray-700',       // broken clouds
    '09d': 'from-slate-600 via-blue-700 to-indigo-800',     // drizzle
    '10d': 'from-blue-600 via-indigo-700 to-slate-800',     // rain
    '11d': 'from-gray-700 via-slate-800 to-gray-900',       // thunderstorm
    '13d': 'from-sky-200 via-blue-200 to-indigo-300',       // snow
    '50d': 'from-gray-400 via-slate-500 to-gray-600',       // mist/fog
  }
  return gradients[code] ?? 'from-blue-600 via-indigo-700 to-purple-800'
}

/**
 * Map AQI index 1-5 to label and color
 */
export const getAQIInfo = (index: number): { label: string; color: string; bg: string } => {
  const map: Record<number, { label: string; color: string; bg: string }> = {
    1: { label: 'Good', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)' },
    2: { label: 'Fair', color: '#a3e635', bg: 'rgba(163, 230, 53, 0.15)' },
    3: { label: 'Moderate', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)' },
    4: { label: 'Poor', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' },
    5: { label: 'Very Poor', color: '#f87171', bg: 'rgba(248, 113, 113, 0.15)' },
  }
  return map[index] ?? map[3]
}

/**
 * Determine time of day greeting
 */
export const getGreeting = (): 'goodMorning' | 'goodAfternoon' | 'goodEvening' => {
  const h = new Date().getHours()
  if (h < 12) return 'goodMorning'
  if (h < 17) return 'goodAfternoon'
  return 'goodEvening'
}

/**
 * Format a weather summary into a short display string
 */
export const formatWeatherSummary = (w: WeatherData): string =>
  `${Math.round(w.temperature)}°C, ${w.description}, Humidity: ${w.humidity}%, Wind: ${w.windSpeed} m/s`

/**
 * Compute UV index risk level
 */
export const getUVRisk = (uvi: number): { level: string; color: string } => {
  if (uvi <= 2) return { level: 'Low', color: '#34d399' }
  if (uvi <= 5) return { level: 'Moderate', color: '#fbbf24' }
  if (uvi <= 7) return { level: 'High', color: '#f97316' }
  if (uvi <= 10) return { level: 'Very High', color: '#f87171' }
  return { level: 'Extreme', color: '#c084fc' }
}
