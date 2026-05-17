import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Alerts() {
  const [filter, setFilter] = useState('all')

  const alerts = [
    { id: 1, type: 'storm', severity: 'critical', city: 'Mumbai', message: 'Severe storm surges up to 3m expected. Extreme rainfall active. Avoid coastal highways.', icon: '⛈️' },
    { id: 2, type: 'heatwave', severity: 'warning', city: 'Delhi', message: 'Heat dome active with temperature peaks up to 45°C. Remain indoors between 12:00 PM and 4:00 PM.', icon: '🌡️' },
    { id: 3, type: 'flood', severity: 'critical', city: 'Kolkata', message: 'Low lying urban areas reporting storm drain backup. Flood warnings extended for 12 hours.', icon: '🌊' },
    { id: 4, type: 'cyclone', severity: 'warning', city: 'Chennai', message: 'Offshore depression shifting northward. Wind gust velocities up to 60 km/h. Sea currents dangerous.', icon: '🌪️' }
  ]

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-rose/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-rose/10 flex items-center justify-center text-3xl">⚠️</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Emergency Alert Center</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Real-time severe storms, flood surges, heatwave, and meteorological warnings logs.</p>
          </div>
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div {...scaleIn} className="flex gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-2xl w-fit">
        <button 
          onClick={() => setFilter('all')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'all' ? 'bg-white/10 text-white font-extrabold shadow' : 'text-white/50 hover:text-white'
          }`}
        >
          All Warnings
        </button>
        <button 
          onClick={() => setFilter('critical')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'critical' ? 'bg-rose/15 text-rose font-extrabold shadow' : 'text-white/50 hover:text-rose/70'
          }`}
        >
          Critical Only
        </button>
        <button 
          onClick={() => setFilter('warning')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            filter === 'warning' ? 'bg-amber/15 text-amber font-extrabold shadow' : 'text-white/50 hover:text-amber/70'
          }`}
        >
          Cautionary Only
        </button>
      </motion.div>

      {/* Alerts Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((a) => (
            <motion.div
              layout
              key={a.id}
              variants={staggerItem}
              whileHover={{ y: -4 }}
              className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl flex items-start gap-4 relative overflow-hidden h-44 flex-col justify-between"
              style={{ borderLeft: `4px solid ${a.severity === 'critical' ? '#f87171' : '#fbbf24'}` }}
            >
              <div className="flex items-start gap-4 w-full">
                <span className="text-3xl select-none">{a.icon}</span>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-extrabold text-base text-white">{a.city} Station</h3>
                    <span className={`text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      a.severity === 'critical' ? 'bg-rose/25 text-rose animate-pulse' : 'bg-amber/25 text-amber'
                    }`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-white/70 text-xs font-medium leading-relaxed">{a.message}</p>
                </div>
              </div>
              
              <div className="w-full flex justify-between items-center border-t border-white/5 pt-3 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                <span>Threat Category: {a.type}</span>
                <span>Active Status</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

    </div>
  )
}