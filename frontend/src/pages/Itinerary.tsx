import { motion } from 'framer-motion'

export default function Itinerary() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold text-white mb-2">Itinerary</h1>
        <p className="text-slate-400">This page is coming soon — Feature build begins next.</p>
      </motion.div>
    </div>
  )
}