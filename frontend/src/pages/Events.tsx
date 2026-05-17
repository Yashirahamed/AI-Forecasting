import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Events() {
  const [eventType, setEventType] = useState('Festival')
  const [feasibility, setFeasibility] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAssess = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFeasibility(null)
    setTimeout(() => {
      setLoading(false)
      setFeasibility(
        eventType === 'Festival'
          ? 'Feasibility Index: 92% (Excellent). Clear skies and mild temperatures represent perfect outdoor concert and open-market operational climates.'
          : 'Feasibility Index: 45% (Suboptimal). Severe thunderstorm forecasts imply high winds risks. Consider indoor venues or rescheduling.'
      )
    }, 1200)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center text-3xl">🎉</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Outdoor Events Feasibility</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Optimize festival scheduling, wedding venue planning, and sports operations by evaluating climatic trends.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Assessment Form (Span 2) */}
        <motion.div {...scaleIn} className="lg:col-span-2 glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <h3 className="text-lg font-black text-white">Event feasibility Calculator</h3>
          
          <form onSubmit={handleAssess} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Select Event Category</label>
                <select 
                  value={eventType} 
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
                >
                  <option value="Festival">🎸 Outdoor Music Festival</option>
                  <option value="Wedding">💍 Open Lawn Wedding Ceremony</option>
                  <option value="Sports">⚽ Regional Sports Tournament</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Operational Month</label>
                <select 
                  className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
                >
                  <option>May (Spring weather)</option>
                  <option>December (Winter transitions)</option>
                </select>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold tracking-wide flex items-center justify-center gap-2 select-none"
              style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)' }}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              <span>Calculate Feasibility Indexes</span>
            </motion.button>
          </form>

          {/* Assessment Output Banner */}
          <AnimatePresence>
            {feasibility && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="p-5 rounded-2xl bg-sky-400/10 border border-sky-400/20 text-sky-400 font-semibold text-sm leading-relaxed"
              >
                ✅ {feasibility}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Live Cancel Risk indicators */}
        <motion.div
          {...fadeUp}
          className="glass p-6 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between min-h-[380px]"
        >
          <div className="space-y-0.5">
            <h3 className="text-white font-extrabold text-lg">General Disruption Index</h3>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Regional climate anomaly indicators</p>
          </div>

          {/* Radial meter */}
          <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="80" cy="80" r="64" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <motion.circle 
                cx="80" 
                cy="80" 
                r="64" 
                fill="transparent" 
                stroke="#a78bfa" 
                strokeWidth="10" 
                strokeDasharray={2 * Math.PI * 64}
                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 64 * 0.92 }}
                transition={{ duration: 1.5 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">8%</span>
              <span className="text-[10px] text-purple font-extrabold uppercase mt-1">Disruption Probability</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-white/5 pt-4 text-xs font-bold text-white/50 uppercase">
            <div className="flex justify-between">
              <span>Lightning Risk:</span>
              <span className="text-white">Negligible</span>
            </div>
            <div className="flex justify-between">
              <span>Precipitation risk:</span>
              <span className="text-white">8% probability</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}