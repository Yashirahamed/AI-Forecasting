import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '@/api/axiosInstance'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

interface Destination {
  city: string
  country: string
  temp: string
  condition: string
  tripType: string
  bestMonths: string
  description: string
  highlights: string[]
  aiScore: number
}

export default function Travel() {
  const [pref, setPref] = useState('sunny')
  const [month, setMonth] = useState('May')
  const [tripType, setTripType] = useState('Adventure')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])

  const fetchDestinations = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await axiosInstance.post('/ai/travel', {
        weatherPreference: pref,
        month,
        tripType,
      })
      const list = res.data?.destinations ?? []
      setDestinations(list)
    } catch (err) {
      setError('Unable to reach the Nexus Travel grid. Please retry.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch when filters change
  useEffect(() => {
    void fetchDestinations()
  }, [pref, month, tripType])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12 space-y-10 select-none">
      
      {/* ── Page Hero ── */}
      <motion.div {...fadeUp} className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white leading-tight">
          Find Your Perfect <span className="gradient-text font-black">Weather Destination</span>
        </h1>
        <p className="text-white/50 text-sm sm:text-base font-semibold leading-relaxed">
          Align your travel itineraries with live weather metrics, real-time storm monitoring, and AI recommendations.
        </p>
      </motion.div>

      {/* ── Search & Filter Bar (Glass Card) ── */}
      <motion.div 
        {...scaleIn}
        className="glass p-5 lg:p-6 bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Preference Select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Weather Preference</label>
            <select 
              value={pref} 
              onChange={(e) => setPref(e.target.value)}
              className="w-full input-glass text-xs font-semibold"
            >
              <option value="sunny">☀️ Sunny & Warm</option>
              <option value="snowy">❄️ Snowy & Winter</option>
              <option value="mild">🌤️ Mild & Cool</option>
            </select>
          </div>

          {/* Month Select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Travel Calendar Month</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              className="w-full input-glass text-xs font-semibold"
            >
              <option value="May">May (Spring peak)</option>
              <option value="Oct">October (Autumn transitions)</option>
              <option value="Dec">December (Winter wonderland)</option>
            </select>
          </div>

          {/* Trip Type Select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Adventure Intent</label>
            <select 
              value={tripType} 
              onChange={(e) => setTripType(e.target.value)}
              className="w-full input-glass text-xs font-semibold"
            >
              <option value="Adventure">🧗 Extreme Adventure & Trekking</option>
              <option value="Relaxation">🏖️ Coastal Relaxation & Retreats</option>
              <option value="Culture">🏯 Architectural & Cultural Tours</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* ── Split Destinations Grid & Map View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* DESTINATIONS GRID */}
        <div className="lg:col-span-2">
          {loading ? (
            /* Shimmer loading */
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="glass p-5 h-[280px] flex flex-col justify-between animate-pulse">
                  <div className="space-y-3">
                    <div className="h-6 w-2/3 bg-white/5 rounded-lg" />
                    <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                    <div className="h-12 w-full bg-white/5 rounded-lg" />
                  </div>
                  <div className="h-8 w-full bg-white/5 rounded-lg" />
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error Card */
            <div className="glass p-8 text-center space-y-4">
              <span className="text-4xl block">🚨</span>
              <p className="text-white/80 font-bold">{error}</p>
              <button 
                onClick={() => void fetchDestinations()}
                className="btn-primary px-6 py-2.5 text-xs font-black uppercase tracking-wider select-none cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : (
            /* Recommendations list */
            <motion.div 
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {destinations.map((d, idx) => (
                <motion.div
                  key={idx}
                  variants={staggerItem}
                  className="glass p-5 sm:p-6 bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between h-[340px] relative group"
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-sky-400">🤖 AI Recommendation</span>
                          <span className="badge badge-purple text-[8px]">AI {d.aiScore}%</span>
                        </div>
                        <h3 className="text-lg font-black text-white mt-1">{d.city}, {d.country}</h3>
                        <p className="text-[10px] text-white/40 font-bold">Best Months: {d.bestMonths}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black gradient-text">{d.temp}</span>
                        <span className="block text-[10px] text-white/50 lowercase">{d.condition}</span>
                      </div>
                    </div>

                    {/* Badge */}
                    <span className="inline-block text-[10px] font-extrabold bg-[#38bdf8]/15 border border-[#38bdf8]/20 text-sky-400 px-2 py-0.5 rounded-full uppercase mb-4">
                      {d.tripType}
                    </span>

                    {/* Desc */}
                    <p className="text-white/70 text-xs font-medium leading-relaxed mb-4">
                      {d.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {d.highlights?.slice(0, 3).map((h, i) => (
                        <span key={i} className="text-[9px] font-bold text-white/60 bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
                          ⭐ {h}
                        </span>
                      ))}
                    </div>
                  </div>

                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* HIGH-FIDELITY MAP OVERLAY */}
        <div className="lg:col-span-1">
          <motion.div
            {...fadeUp}
            className="glass p-5 lg:p-6 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between min-h-[380px] overflow-hidden"
          >
            {/* Mock satellite dark theme styling */}
            <div className="absolute inset-0 opacity-30 mix-blend-luminosity bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=60')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060810] via-[#060810]/40 to-transparent" />

            <div className="z-10 flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="text-white font-extrabold text-lg">Interactive Radar Map</h3>
                <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Real-time Station Pin Overlays</p>
              </div>
              <span className="text-[9px] font-extrabold text-rose bg-rose/15 px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live</span>
            </div>

            {/* Weather Marker Pins on the map */}
            <div className="relative h-44 my-4 w-full flex items-center justify-center z-10">
              <motion.div 
                className="absolute top-1/4 left-1/3 flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <div className="bg-sky-400 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-lg shadow-md glow-blue select-none">30°C 🏖️</div>
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 animate-ping" />
              </motion.div>

              <motion.div 
                className="absolute top-2/3 left-1/2 flex flex-col items-center cursor-pointer"
                whileHover={{ scale: 1.1 }}
              >
                <div className="bg-purple text-white font-extrabold text-[9px] px-2 py-0.5 rounded-lg shadow-md glow-purple select-none">4°C 🏔️</div>
                <div className="w-1.5 h-1.5 rounded-full bg-purple mt-1 animate-ping" />
              </motion.div>
            </div>

            <div className="z-10 space-y-3">
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Radar Overlay settings</p>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-extrabold text-white transition-all uppercase tracking-wider cursor-pointer">Satellite</button>
                <button className="flex-1 py-2 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 rounded-xl text-[10px] font-extrabold text-sky-400 transition-all uppercase tracking-wider cursor-pointer">Precipitation</button>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

    </div>
  )
}