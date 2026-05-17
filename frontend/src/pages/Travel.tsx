import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Travel() {
  const [pref, setPref] = useState('sunny')
  const [month, setMonth] = useState('May')
  const [tripType, setTripType] = useState('Adventure')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  // Mock Destination Data with Premium Photos
  const destinations = [
    {
      id: 0,
      city: 'Maldives',
      temp: '30°C',
      bestMonths: 'Nov - Apr',
      type: 'Relaxation',
      image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=500&auto=format&fit=crop&q=60',
      aiDesc: 'Sunny, crystal waters with calm sea breeze, perfect for beach villas and scuba diving.'
    },
    {
      id: 1,
      city: 'Tokyo, Japan',
      temp: '21°C',
      bestMonths: 'Mar - May',
      type: 'Culture',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=500&auto=format&fit=crop&q=60',
      aiDesc: 'Pleasant temperature, moderate wind, perfect for cherry blossom sight-seeing and street culinary tours.'
    },
    {
      id: 2,
      city: 'Swiss Alps',
      temp: '4°C',
      bestMonths: 'Dec - Feb',
      type: 'Adventure',
      image: 'https://images.unsplash.com/photo-1482862549707-f63cb32c5fd9?w=500&auto=format&fit=crop&q=60',
      aiDesc: 'Fresh snow accumulation, perfect for skiing. Clear, dry air with low avalanche index active.'
    },
    {
      id: 3,
      city: 'Sydney, Australia',
      temp: '24°C',
      bestMonths: 'Sep - Nov',
      type: 'Adventure',
      image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=500&auto=format&fit=crop&q=60',
      aiDesc: 'Gentle ocean breezes, complete sun, ideal for coastal hikes, surfing lessons, and harbour dining.'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* ── Page Hero ── */}
      <motion.div {...fadeUp} className="text-center space-y-3">
        <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight">
          Find Your Perfect <span className="gradient-text">Weather Destination</span>
        </h1>
        <p className="text-white/50 text-base font-semibold max-w-2xl mx-auto leading-relaxed">
          Align your travel itineraries with live weather metrics, real-time storm monitoring, and AI recommendations.
        </p>
      </motion.div>

      {/* ── Search & Filter Bar (Glass Card) ── */}
      <motion.div 
        {...scaleIn}
        className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Preference Select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Weather Condition Preference</label>
            <select 
              value={pref} 
              onChange={(e) => setPref(e.target.value)}
              className="w-full bg-[#0d1526] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
            >
              <option value="sunny">☀️ Sunny & Clear Skies</option>
              <option value="snowy">❄️ Snowy & Winter Skiing</option>
              <option value="mild">🌤️ Mild & Cool breeze</option>
            </select>
          </div>

          {/* Month Select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Travel Calendar Month</label>
            <select 
              value={month} 
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-[#0d1526] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
            >
              <option value="May">May (Spring peak)</option>
              <option value="Oct">October (Autumn transitions)</option>
              <option value="Dec">December (Winter wonderland)</option>
            </select>
          </div>

          {/* Trip Type Select */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-white/55 uppercase tracking-wider">Adventure & Trip Intent</label>
            <select 
              value={tripType} 
              onChange={(e) => setTripType(e.target.value)}
              className="w-full bg-[#0d1526] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-sky-400 text-sm font-semibold transition-all"
            >
              <option value="Adventure">🧗 Extreme Adventure & Trekking</option>
              <option value="Relaxation">🏖️ Coastal Relaxation & Retreats</option>
              <option value="Culture">🏯 Architectural & Cultural Tours</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* ── Split Destinations Grid & Map View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* DESTINATIONS GRID */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          {destinations.map((d) => (
            <motion.div
              key={d.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              onHoverStart={() => setHoveredCard(d.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="glass overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col h-[340px] relative group"
            >
              {/* Image Container */}
              <div className="h-44 w-full overflow-hidden relative">
                <img 
                  src={d.image} 
                  alt={d.city} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/80 via-[#060810]/20 to-transparent" />
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-xs font-extrabold bg-[#38bdf8]/20 border border-[#38bdf8]/30 text-sky-400 px-2.5 py-0.5 rounded-full uppercase tracking-wider">{d.type}</span>
                </div>
              </div>

              {/* Information bottom part */}
              <div className="p-5 flex-1 flex flex-col justify-between relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-white group-hover:text-sky-400 transition-colors">{d.city}</h3>
                    <p className="text-xs text-white/50 font-semibold mt-0.5">Best Months: {d.bestMonths}</p>
                  </div>
                  <span className="text-xl font-black gradient-text">{d.temp}</span>
                </div>

                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-4">Station recommendation active</div>

                {/* Animated AI description overlay on hover */}
                <AnimatePresence>
                  {hoveredCard === d.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0 bg-[#0a0f1e] p-5 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-sky-400 uppercase tracking-widest">🤖 AI Station Analysis</p>
                        <p className="text-xs font-semibold text-white/80 leading-relaxed">{d.aiDesc}</p>
                      </div>
                      <button className="w-full py-2 bg-sky-400/10 hover:bg-sky-400/20 text-sky-400 border border-sky-400/20 rounded-xl text-xs font-extrabold transition-all uppercase tracking-wider">
                        Lock in Destination
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* HIGH-FIDELITY MAP OVERLAY */}
        <motion.div
          {...fadeUp}
          className="glass p-6 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between min-h-[380px] overflow-hidden"
        >
          {/* Mock satellite dark theme styling */}
          <div className="absolute inset-0 opacity-40 mix-blend-luminosity bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=400&auto=format&fit=crop&q=60')" }} />
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
            {/* Maldives Pin */}
            <motion.div 
              className="absolute top-1/4 left-1/3 flex flex-col items-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
            >
              <div className="bg-sky-400 text-white font-extrabold text-[9px] px-2 py-0.5 rounded-lg shadow-md glow-blue select-none">30°C 🏖️</div>
              <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1 animate-ping" />
            </motion.div>

            {/* Swiss Alps Pin */}
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
              <button className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-extrabold text-white transition-all uppercase tracking-wider">Satellite</button>
              <button className="flex-1 py-2 bg-sky-400/10 hover:bg-sky-400/20 border border-sky-400/20 rounded-xl text-[10px] font-extrabold text-sky-400 transition-all uppercase tracking-wider">Precipitation</button>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  )
}