import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Compare() {
  const [city1, setCity1] = useState('Chennai')
  const [city2, setCity2] = useState('Mumbai')

  const cityData: Record<string, { temp: number; humidity: number; wind: number; pressure: number; aqi: number }> = {
    Chennai: { temp: 31, humidity: 82, wind: 4.8, pressure: 1008, aqi: 36 },
    Mumbai: { temp: 28, humidity: 85, wind: 5.2, pressure: 1006, aqi: 48 },
    Delhi: { temp: 34, humidity: 55, wind: 3.1, pressure: 1004, aqi: 124 },
    Bangalore: { temp: 25, humidity: 62, wind: 4.0, pressure: 1010, aqi: 28 },
  }

  const c1 = cityData[city1] || cityData['Chennai']
  const c2 = cityData[city2] || cityData['Mumbai']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Page Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-3xl">🔄</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Compare Stations</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Analyze live metrics between meteorological stations side-by-side.</p>
          </div>
        </div>
      </motion.div>

      {/* Select Controls */}
      <motion.div {...scaleIn} className="grid grid-cols-1 md:grid-cols-2 gap-6 glass p-6 bg-white/[0.02] border border-white/10 rounded-2xl">
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-white/50 uppercase tracking-widest">Primary meteorological Station</label>
          <select 
            value={city1} 
            onChange={(e) => setCity1(e.target.value)}
            className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
          >
            <option value="Chennai">Chennai Station</option>
            <option value="Mumbai">Mumbai Station</option>
            <option value="Delhi">Delhi Station</option>
            <option value="Bangalore">Bangalore Station</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-white/50 uppercase tracking-widest">Comparison target Station</label>
          <select 
            value={city2} 
            onChange={(e) => setCity2(e.target.value)}
            className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
          >
            <option value="Chennai">Chennai Station</option>
            <option value="Mumbai">Mumbai Station</option>
            <option value="Delhi">Delhi Station</option>
            <option value="Bangalore">Bangalore Station</option>
          </select>
        </div>
      </motion.div>

      {/* Comparison Parameters Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* City 1 Info */}
        <motion.div variants={staggerItem} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <h3 className="text-xl font-black text-sky-400">{city1} Meteorology</h3>
          
          <div className="space-y-4">
            {/* Temp Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Temperature</span>
                <span>{c1.temp}°C</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-purple rounded-full" style={{ width: `${(c1.temp / 45) * 100}%` }} />
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Air Saturation (Humidity)</span>
                <span>{c1.humidity}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${c1.humidity}%` }} />
              </div>
            </div>

            {/* Wind */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Wind Velocity</span>
                <span>{c1.wind} m/s</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple rounded-full" style={{ width: `${(c1.wind / 15) * 100}%` }} />
              </div>
            </div>

            {/* AQI */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Air Quality Index</span>
                <span>{c1.aqi} AQI</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(c1.aqi / 150) * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* City 2 Info */}
        <motion.div variants={staggerItem} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <h3 className="text-xl font-black text-purple">{city2} Meteorology</h3>
          
          <div className="space-y-4">
            {/* Temp Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Temperature</span>
                <span>{c2.temp}°C</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple to-sky-400 rounded-full" style={{ width: `${(c2.temp / 45) * 100}%` }} />
              </div>
            </div>

            {/* Humidity */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Air Saturation (Humidity)</span>
                <span>{c2.humidity}%</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-purple rounded-full" style={{ width: `${c2.humidity}%` }} />
              </div>
            </div>

            {/* Wind */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Wind Velocity</span>
                <span>{c2.wind} m/s</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-sky-400 rounded-full" style={{ width: `${(c2.wind / 15) * 100}%` }} />
              </div>
            </div>

            {/* AQI */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-white/70">
                <span>Air Quality Index</span>
                <span>{c2.aqi} AQI</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${(c2.aqi / 150) * 100}%` }} />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}