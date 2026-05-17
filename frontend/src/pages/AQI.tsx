import { motion } from 'framer-motion'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function AQI() {
  const pollutantData = [
    { name: 'PM2.5', value: '8.4 µg/m³', status: 'Excellent', color: 'text-emerald-400' },
    { name: 'PM10', value: '18.2 µg/m³', status: 'Excellent', color: 'text-emerald-400' },
    { name: 'Ozone (O3)', value: '42 ppb', status: 'Good', color: 'text-sky-400' },
    { name: 'Nitrogen Dioxide (NO2)', value: '14.5 ppb', status: 'Good', color: 'text-sky-400' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-emerald/10 flex items-center justify-center text-3xl">🌿</div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">AQI Analyzer</h1>
            <p className="text-white/50 text-sm font-semibold mt-1">Real-time air purification index, dust particulate monitoring, and health parameters.</p>
          </div>
        </div>
      </motion.div>

      {/* Main AQI Gauge Card */}
      <motion.div {...scaleIn} className="glass p-8 bg-white/[0.03] border border-white/10 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4">
          <span className="text-[10px] font-extrabold bg-emerald/20 text-emerald-400 px-3 py-1 rounded-full uppercase tracking-wider">Station Chennai Status</span>
          <h2 className="text-2xl font-black text-white">Current Rating: Good</h2>
          <p className="text-white/60 text-sm font-semibold max-w-md leading-relaxed">
            The atmospheric pressure and sea winds maintain excellent particle dispersion. Outdoors exercises and normal physical actions are completely recommended!
          </p>
        </div>

        {/* Circular AQI Counter Dial */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full rotate-[-90deg]">
            <circle cx="80" cy="80" r="64" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
            <motion.circle 
              cx="80" 
              cy="80" 
              r="64" 
              fill="transparent" 
              stroke="#34d399" 
              strokeWidth="10" 
              strokeDasharray={2 * Math.PI * 64}
              initial={{ strokeDashoffset: 2 * Math.PI * 64 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 64 * 0.75 }}
              transition={{ duration: 1.5 }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center select-none">
            <span className="text-4xl font-black text-white">36</span>
            <span className="text-[10px] text-emerald-400 font-extrabold uppercase mt-1">AQI index</span>
          </div>
        </div>
      </motion.div>

      {/* Pollutant metrics Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {pollutantData.map((p) => (
          <motion.div
            key={p.name}
            variants={staggerItem}
            whileHover={{ y: -4 }}
            className="glass p-6 bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col justify-between h-32 relative overflow-hidden"
          >
            <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">{p.name}</p>
            <div>
              <span className="text-xl font-black text-white">{p.value}</span>
              <p className={`text-[10px] font-bold uppercase mt-1 ${p.color}`}>{p.status}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  )
}