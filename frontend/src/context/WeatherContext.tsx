import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { WeatherContextType, WeatherData, ForecastItem, AQIData, TemperatureUnit } from '@/types/weather.types'
import { getWeatherDirect, getForecastDirect, getCurrentWeather } from '@/api/weatherApi'

const WeatherContext = createContext<WeatherContextType | null>(null)

export const useWeather = (): WeatherContextType => {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useWeather must be used within WeatherProvider')
  return ctx
}

const DEFAULT_CITY = 'Chennai'

export const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [city, setCity] = useState(
    localStorage.getItem('weathercast-city') || DEFAULT_CITY,
  )
  const [unit, setUnit] = useState<TemperatureUnit>(
    (localStorage.getItem('weathercast-unit') as TemperatureUnit) || 'celsius',
  )
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
  const [forecast, setForecast] = useState<ForecastItem[]>([])
  const [aqi, setAqi] = useState<AQIData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tickerWeather, setTickerWeather] = useState<any[]>([])

  const fetchTickerWeather = useCallback(async () => {
    const citiesList = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Kochi']
    try {
      const data: any[] = []
      for (const cityItem of citiesList) {
        try {
          const res = await getCurrentWeather(cityItem)
          const w = res.data?.data
          if (w && w.main && w.weather?.[0]) {
            data.push({
              city: w.name,
              temp: Math.round(w.main.temp),
              condition: w.weather[0].main,
              emoji: w.weather[0].main === 'Rain' ? '🌧️' : w.weather[0].main === 'Clouds' ? '☁️' : w.weather[0].main === 'Clear' ? '☀️' : '🌤️'
            })
          }
        } catch (e) {
          console.warn(`Failed to fetch weather for ticker city ${cityItem}`, e)
        }
      }
      if (data.length > 0) {
        setTickerWeather(data)
      }
    } catch (err) {
      console.error('Failed to fetch ticker weather', err)
    }
  }, [])

  const convertTemp = useCallback(
    (celsius: number): number =>
      unit === 'celsius' ? celsius : Math.round((celsius * 9) / 5 + 32),
    [unit],
  )

  const fetchWeather = useCallback(async () => {
    if (!city) return
    setLoading(true)
    setError(null)

    try {
      const [weatherRes, forecastRes] = await Promise.all([
        getWeatherDirect(city),
        getForecastDirect(city),
      ])

      const w = weatherRes.data
      const mapped: WeatherData = {
        city: w.name,
        country: w.sys.country,
        temperature: w.main.temp,
        feelsLike: w.main.feels_like,
        humidity: w.main.humidity,
        windSpeed: w.wind.speed,
        windDirection: w.wind.deg,
        pressure: w.main.pressure,
        visibility: w.visibility / 1000,
        description: w.weather[0].description,
        icon: w.weather[0].icon,
        lat: w.coord.lat,
        lon: w.coord.lon,
        sunrise: w.sys.sunrise,
        sunset: w.sys.sunset,
        timezone: w.timezone,
        dt: w.dt,
      }
      setCurrentWeather(mapped)

      // Map 5-day 3h forecast list to daily summaries
      const dailyMap: Record<string, ForecastItem> = {}
      for (const item of forecastRes.data.list) {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-CA')
        if (!dailyMap[date]) {
          dailyMap[date] = {
            dt: item.dt,
            temp: {
              min: item.main.temp_min,
              max: item.main.temp_max,
              day: item.main.temp,
              night: item.main.temp,
            },
            feels_like: { day: item.main.feels_like, night: item.main.feels_like },
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            windDeg: item.wind.deg,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            pop: item.pop ?? 0,
            rain: item.rain?.['3h'],
          }
        } else {
          // Update min/max
          dailyMap[date].temp.min = Math.min(dailyMap[date].temp.min, item.main.temp_min)
          dailyMap[date].temp.max = Math.max(dailyMap[date].temp.max, item.main.temp_max)
        }
      }
      setForecast(Object.values(dailyMap).slice(0, 7))
    } catch (err) {
      setError('Unable to fetch weather data. Please check the city name.')
    } finally {
      setLoading(false)
    }
  }, [city])

  useEffect(() => {
    void fetchWeather()
  }, [fetchWeather])

  useEffect(() => {
    void fetchTickerWeather()
    const timer = setInterval(() => {
      void fetchTickerWeather()
    }, 30 * 60 * 1000)
    return () => clearInterval(timer)
  }, [fetchTickerWeather])

  const handleSetCity = useCallback((newCity: string) => {
    localStorage.setItem('weathercast-city', newCity)
    setCity(newCity)
  }, [])

  const handleSetUnit = useCallback((newUnit: TemperatureUnit) => {
    localStorage.setItem('weathercast-unit', newUnit)
    setUnit(newUnit)
  }, [])

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        aqi,
        city,
        unit,
        loading,
        error,
        setCity: handleSetCity,
        setUnit: handleSetUnit,
        refreshWeather: fetchWeather,
        convertTemp,
        tickerWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  )
}
