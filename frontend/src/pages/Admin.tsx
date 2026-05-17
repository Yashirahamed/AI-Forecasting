import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Admin() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)

  const handleTriggerSim = () => {
    setLoading(true)
    setSuccess(null)
    setTimeout(() => {
      setLoading(false)
      setSuccess('Simulated extreme weather event generated: Flood warnings issued for Kolkata Station.')
    }, 1500)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-rose/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-rose/10 flex items-center justify-center text-3xl">🛡️</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">System Control Center</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Admin oversight console: execute data simulations, monitor node telemetry, and handle credentials.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Simulations panel (Span 2) */}
        <motion.div {...scaleIn} className="lg:col-span-2 glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <h3 className="text-lg font-black text-white">Event Simulation Injector</h3>
          
          <p className="text-white/60 text-sm font-semibold leading-relaxed">
            Trigger custom system-wide simulations to test alerts broadcast networks, mobile drawer notifications, and automated emergency routing fallbacks.
          </p>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="p-4 rounded-xl text-xs font-semibold text-rose bg-rose/10 border border-rose/20"
              >
                🚨 Alert Broadcast Activated: {success}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleTriggerSim}
            disabled={loading}
            className="px-6 py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase flex items-center gap-2 select-none"
            style={{ background: 'linear-gradient(135deg, #f87171 0%, #a78bfa 100%)' }}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>Trigger Cyclone surge simulation</span>
          </motion.button>
        </motion.div>

        {/* Server Status Monitor */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-fit space-y-6"
        >
          <h3 className="text-lg font-black text-white">Node Health Telemetry</h3>
          
          <div className="space-y-4">
            <motion.div variants={staggerItem} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/40 font-extrabold uppercase">API Router</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">Online • Stable</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>

            <motion.div variants={staggerItem} className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] text-white/40 font-extrabold uppercase">LSTM Microservice</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">Online • Stable</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}