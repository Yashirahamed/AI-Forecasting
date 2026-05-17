import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Agriculture() {
  const [cropType, setCropType] = useState('Rice')
  const [soilType, setSoilType] = useState('Clayey')
  const [simulationResult, setSimulationResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Floating Focus states
  const [irrigationFocused, setIrrigationFocused] = useState(false)
  const [irrigationRate, setIrrigationRate] = useState('')

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSimulationResult(null)
    setTimeout(() => {
      setLoading(false)
      setSimulationResult(
        cropType === 'Rice' && soilType === 'Clayey'
          ? 'Optimal Conditions: Clayey soil retains high moisture levels (82%), perfect for Rice cultivation. Expected yield optimization: +15%.'
          : 'Suboptimal Conditions: Sandy soil drainage rate is too high for Rice water logging requirements. Consider shifting to Maize or adding loam soil layers.'
      )
    }, 1200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-3xl">🌾</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Agricultural Advisor</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Optimize crop selection, manage soil moisture indices, and forecast agricultural yield based on rainfall vectors.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Simulation Settings Form (Span 2) */}
        <motion.div {...scaleIn} className="lg:col-span-2 glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <h3 className="text-lg font-black text-white">Yield Optimization Simulator</h3>
          
          <form onSubmit={handleSimulate} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Crop Select */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Select Crop Intent</label>
                <select 
                  value={cropType} 
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
                >
                  <option value="Rice">🌾 Rice (High Water saturation)</option>
                  <option value="Wheat">🌾 Wheat (Moderate moisture)</option>
                  <option value="Maize">🌽 Maize (Dry soil resistant)</option>
                </select>
              </div>

              {/* Soil Select */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Soil Profile Type</label>
                <select 
                  value={soilType} 
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
                >
                  <option value="Clayey">🟫 Clayey Soil</option>
                  <option value="Sandy">🟨 Sandy Soil</option>
                  <option value="Loamy">🟧 Loamy Soil</option>
                </select>
              </div>
            </div>

            {/* Custom Input with Floating Label */}
            <div className="relative">
              <input
                id="irrigation-rate"
                type="number"
                value={irrigationRate}
                onChange={(e) => setIrrigationRate(e.target.value)}
                onFocus={() => setIrrigationFocused(true)}
                onBlur={() => setIrrigationFocused(false)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm"
                placeholder="Irrigation rate"
                required
              />
              <label
                htmlFor="irrigation-rate"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xs font-semibold pointer-events-none transition-all duration-300 ${
                  irrigationFocused || irrigationRate ? '-translate-y-[28px] scale-90 text-sky-400 bg-[#090e1b] px-2 rounded' : ''
                }`}
              >
                Intended Irrigation Frequency (litres/sq.m per day)
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2 select-none"
              style={{ background: 'linear-gradient(135deg, #34d399 0%, #38bdf8 100%)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>Calculate Optimization parameters</span>
            </motion.button>
          </form>

          {/* Simulation Output Banner */}
          <AnimatePresence>
            {simulationResult && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-5 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald-400 font-semibold text-sm leading-relaxed"
              >
                ✅ {simulationResult}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Soil Moisture Index */}
        <motion.div
          {...fadeUp}
          className="glass p-6 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between min-h-[380px]"
        >
          <div className="space-y-0.5">
            <h3 className="text-white font-extrabold text-lg">Soil Moisture Index</h3>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Live sensor telemetry readings</p>
          </div>

          {/* Circle Gauge */}
          <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="80" cy="80" r="64" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <motion.circle 
                cx="80" 
                cy="80" 
                r="64" 
                fill="transparent" 
                stroke="#34d399" 
                strokeWidth="10" 
                strokeDasharray={2 * Math.PI * 64}
                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 64 * 0.82 }}
                transition={{ duration: 1.5 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">82%</span>
              <span className="text-[10px] text-emerald-400 font-extrabold uppercase mt-1">Clay loam saturation</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-bold text-white/50 uppercase">
            <div className="flex justify-between">
              <span>Evapotranspiration:</span>
              <span className="text-white">2.8 mm/day</span>
            </div>
            <div className="flex justify-between">
              <span>Sensor depth:</span>
              <span className="text-white">15 cm depth active</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}