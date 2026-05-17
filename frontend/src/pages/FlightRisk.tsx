import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function FlightRisk() {
  const [activeAirport, setActiveAirport] = useState('MAA')

  const airportsData: Record<string, { name: string; crosswind: number; risk: string; status: string; delay: string; visibility: string }> = {
    MAA: { name: 'Chennai International (MAA)', crosswind: 12, risk: 'Low', status: 'Optimal Landing Conditions', delay: 'No delays reporting', visibility: '10 km visibility active' },
    BOM: { name: 'Chhatrapati Shivaji Maharaj (BOM)', crosswind: 28, risk: 'High', status: 'Wind shear warnings active', delay: 'Average 20-min departure queue hold', visibility: '6 km rain drizzle haze' },
    DEL: { name: 'Indira Gandhi International (DEL)', crosswind: 8, risk: 'Low', status: 'Optimal Landing Conditions', delay: 'No delays reporting', visibility: '9 km visibility active' }
  }

  const ap = airportsData[activeAirport] || airportsData['MAA']

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center text-3xl">✈️</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Aviation Flight Risk</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Monitor crosswind components, low visibility wind shear parameters, and active meteorological delays.</p>
          </div>
        </div>
      </motion.div>

      {/* Select buttons */}
      <motion.div {...scaleIn} className="flex gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-2xl w-fit">
        {['MAA', 'BOM', 'DEL'].map((code) => (
          <button 
            key={code}
            onClick={() => setActiveAirport(code)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all uppercase ${
              activeAirport === code ? 'bg-white/10 text-white font-extrabold shadow' : 'text-white/50 hover:text-white'
            }`}
          >
            {code} Airport
          </button>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Risk details (Span 2) */}
        <motion.div {...scaleIn} className="lg:col-span-2 glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white">{ap.name}</h3>
            <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
              ap.risk === 'Low' ? 'bg-emerald/15 text-emerald-400' : 'bg-rose/15 text-rose animate-pulse'
            }`}>
              {ap.risk} Risk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/5">
            <div className="space-y-1">
              <p className="text-[10px] text-white/40 font-extrabold uppercase">Runway Status</p>
              <p className="text-sm font-bold text-white leading-relaxed">{ap.status}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/40 font-extrabold uppercase">Delay Index</p>
              <p className="text-sm font-bold text-white leading-relaxed">{ap.delay}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-white/40 font-extrabold uppercase">Visibility Parameters</p>
              <p className="text-sm font-bold text-white leading-relaxed">{ap.visibility}</p>
            </div>
          </div>
        </motion.div>

        {/* Crosswind speed dial */}
        <motion.div {...fadeUp} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-fit space-y-6 flex flex-col justify-between min-h-[300px]">
          <div className="space-y-0.5">
            <h3 className="text-white font-extrabold text-lg">Runway Crosswinds</h3>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Live anemometer readings</p>
          </div>

          {/* Dial indicator */}
          <div className="relative w-40 h-40 mx-auto my-6 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="80" cy="80" r="64" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
              <motion.circle 
                cx="80" 
                cy="80" 
                r="64" 
                fill="transparent" 
                stroke={ap.risk === 'Low' ? '#34d399' : '#f87171'}
                strokeWidth="10" 
                strokeDasharray={2 * Math.PI * 64}
                initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 64 * (1 - ap.crosswind / 45) }}
                transition={{ duration: 1.5 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-black text-white">{ap.crosswind}</span>
              <span className="text-[10px] text-white/40 font-extrabold uppercase mt-1">knots velocity</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}