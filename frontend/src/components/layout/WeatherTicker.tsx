import { useWeather } from '@/context/WeatherContext'

export default function WeatherTicker() {
  const { tickerWeather } = useWeather()

  // Fallback data if API hasn't loaded yet
  const fallbackCities = [
    { city: 'Chennai', temp: 31, condition: 'Clouds', emoji: '☁️' },
    { city: 'Mumbai', temp: 28, condition: 'Rain', emoji: '🌧️' },
    { city: 'Delhi', temp: 34, condition: 'Clear', emoji: '☀️' },
    { city: 'Bangalore', temp: 25, condition: 'Clear', emoji: '☀️' },
    { city: 'Kolkata', temp: 30, condition: 'Clouds', emoji: '☁️' },
    { city: 'Hyderabad', temp: 32, condition: 'Clear', emoji: '☀️' },
    { city: 'Pune', temp: 27, condition: 'Clouds', emoji: '☁️' },
    { city: 'Ahmedabad', temp: 35, condition: 'Clear', emoji: '☀️' },
    { city: 'Jaipur', temp: 33, condition: 'Clear', emoji: '☀️' },
    { city: 'Kochi', temp: 29, condition: 'Rain', emoji: '🌧️' }
  ]

  const list = tickerWeather && tickerWeather.length > 0 ? tickerWeather : fallbackCities

  return (
    <div className="fixed top-16 left-0 right-0 z-40 h-8 glass-dark border-b border-white/5 flex items-center overflow-hidden select-none">
      <div className="w-full relative flex items-center">
        {/* Repeating the list to ensure gap-less scrolling */}
        <div className="animate-ticker whitespace-nowrap flex gap-12 text-xs font-semibold text-white/60">
          {Array.from({ length: 3 }).flatMap(() => list).map((item, idx) => (
            <span key={idx} className="flex items-center gap-2">
              <span>{item.emoji}</span>
              <span className="text-white/80 font-black">{item.city}</span>
              <span className="gradient-text">{item.temp}°C</span>
              <span className="text-white/40 font-medium lowercase">({item.condition})</span>
              <span className="text-white/10 ml-4">•</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
