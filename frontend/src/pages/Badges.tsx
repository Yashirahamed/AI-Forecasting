import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, staggerItem } from '@/utils/animations'

export default function Badges() {
  const badges = [
    { id: 1, name: 'Storm Watcher', desc: 'Acknowledge 5 storm alerts', unlocked: true, icon: '⛈️' },
    { id: 2, name: 'Solar Farmer', desc: 'Optimize 3 solar harvests', unlocked: true, icon: '☀️' },
    { id: 3, name: 'Air Purifier', desc: 'Maintain eco rating > 80%', unlocked: true, icon: '🍃' },
    { id: 4, name: 'Commuter', desc: 'Lock in 5 low-risk travel plans', unlocked: true, icon: '✈️' },
    { id: 5, name: 'Time Traveller', desc: 'Consult 10 historical weather sequences', unlocked: false, icon: '⏳' },
    { id: 6, name: 'Aviation Risk Assessor', desc: 'Assess Runway operations safety logs', unlocked: false, icon: '🛫' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-purple/10 flex items-center justify-center text-3xl">🏅</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">Achievements & Badges</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Acquire rewards by logging weather events, saving carbon footings, and analyzing crop yields.</p>
          </div>
        </div>
      </motion.div>

      {/* Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6"
      >
        {badges.map((b) => (
          <motion.div
            key={b.id}
            variants={staggerItem}
            whileHover={b.unlocked ? { y: -4, scale: 1.02 } : {}}
            className={`glass p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 border ${
              b.unlocked 
                ? 'bg-white/[0.03] border-white/10 text-white shadow-md' 
                : 'bg-white/[0.01] border-white/5 text-white/30 opacity-40 grayscale select-none'
            }`}
          >
            <span className="text-4xl">{b.icon}</span>
            <div className="space-y-1">
              <h3 className="font-extrabold text-xs sm:text-sm">{b.name}</h3>
              <p className="text-[10px] text-white/50 leading-snug">{b.desc}</p>
            </div>
            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
              b.unlocked ? 'bg-sky-400/15 text-sky-400' : 'bg-white/5 text-white/20'
            }`}>
              {b.unlocked ? 'Unlocked' : 'Locked'}
            </span>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}