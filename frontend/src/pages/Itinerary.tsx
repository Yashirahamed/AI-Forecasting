import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Itinerary() {
  const [items, setItems] = useState([
    { id: 1, name: 'Windproof Rain Shell Jacket', category: 'Storm gear', checked: false },
    { id: 2, name: 'Thermal Insulation Layers', category: 'Cold protection', checked: true },
    { id: 3, name: 'UV Protection Sunglasses', category: 'Sunny protection', checked: false },
    { id: 4, name: 'Quick-Dry Hydration Pack', category: 'High heat activity', checked: false }
  ])

  const [newItem, setNewItem] = useState('')
  const [newCat, setNewCat] = useState('Storm gear')

  const handleToggle = (id: number) => {
    setItems(items.map(i => i.id === id ? { ...i, checked: !i.checked } : i))
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem) return
    setItems([...items, { id: Date.now(), name: newItem, category: newCat, checked: false }])
    setNewItem('')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-sky-400/10 flex items-center justify-center text-3xl">🗓️</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Itinerary Gear Planner</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Plan packing lists and travel safety parameters synchronized perfectly with destination climate data.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Checklist Panel (Span 2) */}
        <motion.div {...scaleIn} className="lg:col-span-2 glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-black text-white">Weather-Adapted Gear Checklists</h3>
            <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
              {items.filter(i => i.checked).length} of {items.length} packed
            </span>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="space-y-3"
          >
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  variants={staggerItem}
                  onClick={() => handleToggle(item.id)}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    item.checked 
                      ? 'bg-emerald/5 border-emerald/20 text-white/40 line-through' 
                      : 'bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.checked ? '✅' : '⬜'}</span>
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-sky-400/80 mt-0.5">{item.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold opacity-30">Tap to toggle</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Add custom item form */}
        <motion.div {...fadeUp} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-fit space-y-6">
          <h3 className="text-lg font-black text-white">Add Custom Packing Gear</h3>
          
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase">Gear Item Name</label>
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400 text-xs font-semibold"
                placeholder="e.g. UV Cream SPF 50"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-white/50 uppercase">Category Tag</label>
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                className="w-full bg-[#0d1526] border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-400 text-xs font-semibold"
              >
                <option value="Storm gear">⛈️ Storm protection</option>
                <option value="Cold protection">❄️ Cold protection</option>
                <option value="Sunny protection">☀️ Sunny protection</option>
              </select>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase select-none"
              style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)' }}
            >
              Add to Checklist
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  )
}