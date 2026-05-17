import { useState } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function News() {
  const [activeCategory, setActiveCategory] = useState('all')

  const newsData = [
    {
      id: 1,
      category: 'Meteorology',
      title: 'Cyclonic Depression Over Bay of Bengal Expected to Strengthen',
      summary: 'Meteorologists predict wind gust velocity peaks up to 85 km/h. Coastal stations warning flags elevated.',
      date: 'May 17, 2026',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 2,
      category: 'Climate',
      title: 'Global Saturation Indexes Reflect Highest Ever Evaporation Velocity',
      summary: 'Extreme air heat dome vectors result in accelerated water bodies evaporation grids globally.',
      date: 'May 15, 2026',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 3,
      category: 'Energy',
      title: 'Solar Power Grids Harvest High Saturation Yield Under Cloudless Skies',
      summary: 'Southern regions reports peak grid capacity performance due to high clear solar tracking indexing.',
      date: 'May 14, 2026',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=500&auto=format&fit=crop&q=60'
    }
  ]

  const filtered = activeCategory === 'all' ? newsData : newsData.filter(n => n.category.toLowerCase() === activeCategory)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center text-3xl">📰</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Weather News Portal</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Get advanced storm warning alerts, climate grid index analyses, and meteorological discoveries.</p>
          </div>
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div {...scaleIn} className="flex gap-3 bg-white/[0.02] border border-white/5 p-2 rounded-2xl w-fit">
        {['all', 'meteorology', 'climate', 'energy'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
              activeCategory === cat ? 'bg-white/10 text-white font-extrabold shadow' : 'text-white/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {filtered.map((n) => (
          <motion.div
            key={n.id}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            className="glass overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col h-[380px] relative group"
          >
            <div className="h-44 w-full overflow-hidden relative">
              <img 
                src={n.image} 
                alt={n.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060810]/80 via-transparent to-transparent" />
              <span className="absolute top-4 left-4 text-[10px] font-extrabold bg-sky-400/25 border border-sky-400/30 text-sky-400 px-3 py-1 rounded-full uppercase tracking-wider">{n.category}</span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <p className="text-[10px] text-white/40 font-bold">{n.date}</p>
                <h3 className="text-base font-black text-white group-hover:text-sky-400 transition-colors leading-snug">{n.title}</h3>
                <p className="text-xs text-white/60 font-semibold leading-relaxed line-clamp-2">{n.summary}</p>
              </div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Read Full Station coverage →</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}