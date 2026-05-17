export interface WeatherData {
  city: string
  country: string
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  pressure: number
  visibility: number
  uvIndex?: number
  description: string
  icon: string
  lat: number
  lon: number
  sunrise: number
  sunset: number
  timezone: number
  dt: number
}

export interface ForecastItem {
  dt: number
  temp: {
    min: number
    max: number
    day: number
    night: number
  }
  feels_like: {
    day: number
    night: number
  }
  humidity: number
  windSpeed: number
  windDeg: number
  description: string
  icon: string
  pop: number  // probability of precipitation
  rain?: number
  uvi?: number
}

export interface AQIData {
  aqi: number          // 1-5 (Good → Hazardous)
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  nh3: number
  label: 'Good' | 'Fair' | 'Moderate' | 'Poor' | 'Very Poor'
  color: string
}

export interface HistoricalWeather {
  date: string
  temp: number
  humidity: number
  windSpeed: number
  rain?: number
}

export type TemperatureUnit = 'celsius' | 'fahrenheit'

export interface WeatherContextType {
  currentWeather: WeatherData | null
  forecast: ForecastItem[]
  aqi: AQIData | null
  city: string
  unit: TemperatureUnit
  loading: boolean
  error: string | null
  setCity: (city: string) => void
  setUnit: (unit: TemperatureUnit) => void
  refreshWeather: () => void
  convertTemp: (celsius: number) => number
}
