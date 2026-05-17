import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fadeUp, scaleIn } from '@/utils/animations'
import { useAuth } from '@/context/AuthContext'

export default function Profile() {
  const { user, supabaseUser } = useAuth()
  const [name, setName] = useState(supabaseUser?.name ?? 'Yashir Ahamed')
  const [role, setRole] = useState('Senior Agricultural Scientist')
  const [success, setSuccess] = useState(false)

  // Floating label focus states
  const [nameFocused, setNameFocused] = useState(false)
  const [roleFocused, setRoleFocused] = useState(false)

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    setSuccess(true)
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10 select-none">
      
      {/* Hero */}
      <motion.div {...fadeUp} className="glass p-8 relative overflow-hidden rounded-3xl shadow-xl bg-white/[0.03] border border-white/10">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-transparent pointer-events-none" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-sky-400 to-purple shadow-xl">
            <div className="w-full h-full bg-[#0a0f1e] rounded-full flex items-center justify-center text-2xl font-black text-white">Y</div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-wide">{name}</h1>
            <p className="text-white/50 text-sm font-semibold mt-0.5">{user?.email ?? 'yashir.ahamed@example.com'}</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Details Form (Span 2) */}
        <motion.div {...scaleIn} className="lg:col-span-2 glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-6">
          <h3 className="text-lg font-black text-white">Update Personal Station credentials</h3>
          
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald/10 border border-emerald/20 flex items-center gap-2"
              >
                <span>✅</span> Profile credentials updated successfully.
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleUpdate} className="space-y-6">
            {/* Name Input with Floating Label */}
            <div className="relative">
              <input
                id="profile-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setNameFocused(true)}
                onBlur={() => setNameFocused(false)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm"
                placeholder="Name"
                required
              />
              <label
                htmlFor="profile-name"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xs font-semibold pointer-events-none transition-all duration-300 ${
                  nameFocused || name ? '-translate-y-[28px] scale-90 text-sky-400 bg-[#090e1b] px-2 rounded' : ''
                }`}
              >
                Display Username
              </label>
            </div>

            {/* Role Input with Floating Label */}
            <div className="relative">
              <input
                id="profile-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                onFocus={() => setRoleFocused(true)}
                onBlur={() => setRoleFocused(false)}
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3.5 text-white outline-none focus:border-sky-400 focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm"
                placeholder="Role"
                required
              />
              <label
                htmlFor="profile-role"
                className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-xs font-semibold pointer-events-none transition-all duration-300 ${
                  roleFocused || role ? '-translate-y-[28px] scale-90 text-sky-400 bg-[#090e1b] px-2 rounded' : ''
                }`}
              >
                Agricultural Specialist Role Designation
              </label>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3.5 rounded-xl text-white font-bold text-xs tracking-wider uppercase select-none"
              style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)' }}
            >
              Commit credentials changes
            </motion.button>
          </form>
        </motion.div>

        {/* Sustainability & badges count sidebar */}
        <motion.div {...fadeUp} className="glass p-6 bg-white/[0.03] border border-white/10 rounded-3xl h-fit space-y-6">
          <h3 className="text-lg font-black text-white">Sustainability overview</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] text-white/40 font-extrabold uppercase">Eco score balance</p>
                <p className="text-xl font-black text-emerald-400">{supabaseUser?.eco_score ?? 180} pt</p>
              </div>
              <span className="text-2xl">🌱</span>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <p className="text-[10px] text-white/40 font-extrabold uppercase">Unlocked Achievements</p>
                <p className="text-xl font-black text-sky-400">4 / 12 Badges</p>
              </div>
              <span className="text-2xl">🏅</span>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}