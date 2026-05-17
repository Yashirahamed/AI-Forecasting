import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function TimeMachine() {
  const [selectedDecade, setSelectedDecade] = useState('1990')
  const [loading, setLoading] = useState(false)
  const [queryComplete, setQueryComplete] = useState(true)

  const historicalData: Record<string, { year: string; anomaly: number; temp: number }[]> = {
    '1950': [
      { year: '1950', anomaly: -0.15, temp: 26.5 },
      { year: '1952', anomaly: -0.18, temp: 26.4 },
      { year: '1954', anomaly: -0.12, temp: 26.6 },
      { year: '1956', anomaly: -0.22, temp: 26.3 },
      { year: '1958', anomaly: -0.10, temp: 26.7 },
      { year: '1960', anomaly: -0.05, temp: 26.8 }
    ],
    '1990': [
      { year: '1990', anomaly: 0.15, temp: 27.2 },
      { year: '1992', anomaly: 0.18, temp: 27.3 },
      { year: '1994', anomaly: 0.22, temp: 27.4 },
      { year: '1996', anomaly: 0.25, temp: 27.5 },
      { year: '1998', anomaly: 0.38, temp: 27.8 },
      { year: '2000', anomaly: 0.32, temp: 27.6 }
    ],
    '2020': [
      { year: '2020', anomaly: 0.85, temp: 28.5 },
      { year: '2021', anomaly: 0.88, temp: 28.6 },
      { year: '2022', anomaly: 0.92, temp: 28.7 },
      { year: '2023', anomaly: 1.05, temp: 28.9 },
      { year: '2024', anomaly: 1.12, temp: 29.1 },
      { year: '2026', anomaly: 1.18, temp: 29.2 }
    ]
  }

  const data = historicalData[selectedDecade] || historicalData['1990']

  const handleQuery = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setQueryComplete(false)
    setTimeout(() => {
      setLoading(false)
      setQueryComplete(true)
    }, 1000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-3xl">⏳</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Climate Time Machine</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Consult and reconstruct regional weather sequences across decades to observe global warning indexes.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Settings Select (Column 1) */}
        <motion.div {...scaleIn} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-fit space-y-6">
          <h3 className="text-lg font-black text-white">Select Historical Era</h3>
          
          <form onSubmit={handleQuery} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase">Chronological Decade</label>
              <select
                value={selectedDecade}
                onChange={(e) => setSelectedDecade(e.target.value)}
                className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400 text-xs font-semibold"
              >
                <option value="1950">1950 - 1960 (Baseline Era)</option>
                <option value="1990">1990 - 2000 (Industrialization peak)</option>
                <option value="2020">2020 - 2026 (Contemporary warming)</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase select-none"
              style={{ background: 'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)' }}
            >
              Reconstruct Era Data
            </motion.button>
          </form>
        </motion.div>

        {/* Charts & Table outputs (Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass p-8 rounded-3xl flex flex-col items-center justify-center min-h-[300px]"
              >
                <div className="w-10 h-10 border-4 border-purple/30 border-t-purple rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-white/50 uppercase">Loading telemetry timelines...</p>
              </motion.div>
            ) : queryComplete ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl space-y-6 min-h-[300px]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-black text-white">Mean Temperature Reconstructions</h3>
                  <span className="text-[10px] text-sky-400 bg-sky-400/15 px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold">Reconstructed</span>
                </div>

                {/* Line Chart */}
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ left: -30, right: 10, top: 5, bottom: 5 }}>
                      <XAxis dataKey="year" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                        itemStyle={{ color: '#fff' }}
                      />
                      <Line type="monotone" dataKey="temp" stroke="#a78bfa" strokeWidth={2.5} dot={{ fill: '#a78bfa' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="w-full flex justify-between items-center border-t border-white/5 pt-4 text-[10px] text-white/40 font-bold uppercase tracking-wider">
                  <span>Temperature Anomaly: +{data[data.length - 1].anomaly}°C</span>
                  <span>Data Quality: High confidence</span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}