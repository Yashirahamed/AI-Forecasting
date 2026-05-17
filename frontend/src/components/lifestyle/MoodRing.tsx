import { useState, useEffect } from 'react'
import { useWeather } from '@/context/WeatherContext'
import { motion } from 'framer-motion'

export default function MoodRing() {
  const { currentWeather } = useWeather()
  const [mood, setMood] = useState({ emoji: '🧘', label: 'Cozy', style: 'from-blue to-emerald' })

  // Tips based on current weather condition
  const tips = [
    { icon: '💧', text: 'Maintain hydration levels: drink 3L of water today.' },
    { icon: '🌿', text: 'Air Quality is healthy: ideal time for breathing exercises.' },
    { icon: '☀️', text: 'UV Index is low: standard moisturizers are sufficient.' },
    { icon: '🚶', text: 'Calm winds: perfect conditions for a brisk evening stroll.' },
    { icon: '🌙', text: 'Steady air pressure: expects a deep and restoring sleep cycle.' }
  ]

  useEffect(() => {
    if (!currentWeather) return
    const desc = currentWeather.description.toLowerCase()

    if (desc.includes('rain') || desc.includes('drizzle')) {
      setMood({ emoji: '🌧️', label: 'Gloomy', style: 'from-blue to-teal' })
    } else if (desc.includes('clear')) {
      setMood({ emoji: '☀️', label: 'Energetic', style: 'from-amber to-rose' })
    } else if (desc.includes('cloud')) {
      setMood({ emoji: '☁️', label: 'Cozy', style: 'from-purple to-pink' })
    } else if (desc.includes('storm') || desc.includes('thunder')) {
      setMood({ emoji: '⛈️', label: 'Stormy', style: 'from-red to-orange' })
    } else {
      setMood({ emoji: '🧘', label: 'Cozy', style: 'from-[#38bdf8] to-[#a78bfa]' })
    }
  }, [currentWeather])

  return (
    <div className="glass p-5 lg:p-6 bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col items-center select-none text-center">
      <div className="text-left w-full">
        <span className="badge badge-purple mb-4">Wellness Forecast</span>
        <h3 className="text-lg font-black text-white mb-6">Weather Mood Ring</h3>
      </div>

      {/* Animated Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center mb-8">
        <div className={`absolute inset-0 rounded-full bg-gradient-to-tr ${mood.style} opacity-20 filter blur-xl animate-pulse`} />
        
        {/* SVG Circle Ring */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            stroke="rgba(255,255,255,0.05)" 
            strokeWidth="5" 
            fill="transparent" 
          />
          <circle 
            cx="50" 
            cy="50" 
            r="44" 
            stroke="url(#moodGradient)" 
            strokeWidth="6" 
            strokeDasharray="276"
            strokeDashoffset="70"
            fill="transparent" 
            strokeLinecap="round"
            className="animate-spin-slow"
            style={{ transformOrigin: '50px 50px' }}
          />
          <defs>
            <linearGradient id="moodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>

        {/* Mood details inside the ring */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl animate-bounce">{mood.emoji}</span>
          <span className="text-white font-black mt-2 text-base tracking-wide uppercase">{mood.label}</span>
          <span className="text-white/40 text-[9px] font-bold mt-0.5">Atmosphere Score</span>
        </div>
      </div>

      {/* Health tips */}
      <div className="w-full space-y-2 mt-2">
        {tips.map((tip, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ x: 4 }}
            className="glass-sm p-3 flex items-center gap-3 text-left"
          >
            <span className="text-lg bg-white/5 w-8 h-8 rounded-full flex items-center justify-center">{tip.icon}</span>
            <span className="text-white/70 text-xs font-semibold leading-snug">{tip.text}</span>
          </motion.div>
        ))}
      </div>

    </div>
  )
}
