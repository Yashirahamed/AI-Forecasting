import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'

const FEATURES = [
  { icon: '🌤️', title: 'Real-Time Weather', desc: 'Live conditions and 7-day forecasts for any city on Earth.' },
  { icon: '🤖', title: 'AI Weather Chat', desc: 'Ask Nexus Oracle anything about weather, travel, or climate.' },
  { icon: '✈️', title: 'Smart Travel Planner', desc: 'AI-generated itineraries tailored to the weather forecast.' },
  { icon: '🌿', title: 'Air Quality Index', desc: 'Real-time AQI with health tips and pollution breakdowns.' },
  { icon: '🚨', title: 'Disaster Alerts', desc: 'Instant storm, flood, and cyclone alerts with safety checklists.' },
  { icon: '🏅', title: 'Gamification', desc: 'Earn badges and eco-scores by engaging with the platform.' },
]

const STATS = [
  { value: '10M+', label: 'Data points daily' },
  { value: '195', label: 'Countries covered' },
  { value: '5', label: 'Indian languages' },
  { value: '<1s', label: 'Response time' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Home() {
  const { t } = useTranslation()
  const { user } = useAuth()

  return (
    <div className="min-h-screen" style={{ background: '#0a0f1e' }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #38bdf8, transparent 70%)', filter: 'blur(80px)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #a78bfa, transparent 70%)', filter: 'blur(80px)' }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(56,189,248,1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(56,189,248,1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }} />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
            style={{ background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', color: '#38bdf8' }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#38bdf8] opacity-75 ping-slow" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38bdf8]" />
            </span>
            Powered by Groq Llama 3 · OpenWeatherMap
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight"
          >
            {t('home.hero')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {t('home.subtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to={user ? '/dashboard' : '/register'}
              id="hero-cta-btn"
              className="btn-primary px-8 py-4 text-base font-semibold"
              style={{ borderRadius: '1rem' }}
            >
              {t('home.getStarted')} →
            </Link>
            <Link
              to="/forecast"
              className="btn-secondary px-8 py-4 text-base"
              style={{ borderRadius: '1rem' }}
            >
              {t('home.learnMore')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            {STATS.map(({ value, label }) => (
              <motion.div key={label} variants={cardVariants} className="glass rounded-2xl p-5 text-center">
                <p className="text-3xl font-black gradient-text mb-1">{value}</p>
                <p className="text-slate-400 text-sm">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to understand the sky
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              From hyper-local forecasts to AI-powered travel planning — WeatherCast AI is the only weather app you'll ever need.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map(({ icon, title, desc }) => (
              <motion.div
                key={title}
                variants={cardVariants}
                whileHover={{ y: -4, scale: 1.02 }}
                className="glass rounded-2xl p-6 cursor-default group"
              >
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-[#38bdf8] transition-colors">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-dark rounded-3xl p-10 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-20 pointer-events-none"
              style={{ background: 'radial-gradient(circle at 50% 50%, #38bdf8, transparent 60%)' }} />
            <h2 className="text-3xl font-bold text-white mb-4 relative z-10">
              Ready to experience smarter weather?
            </h2>
            <p className="text-slate-400 mb-7 relative z-10">
              Join thousands of users getting AI-powered weather insights every day.
            </p>
            <Link
              to={user ? '/dashboard' : '/register'}
              id="cta-bottom-btn"
              className="btn-primary px-8 py-3.5 text-base font-semibold relative z-10 inline-block"
              style={{ borderRadius: '1rem' }}
            >
              {user ? 'Go to Dashboard →' : 'Get Started Free →'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="py-8 px-4 text-center border-t border-white/[0.06]">
        <p className="text-slate-500 text-sm">
          © 2026 WeatherCast AI — Built with ❤️ using React, Groq Llama 3 & OpenWeatherMap
        </p>
      </footer>
    </div>
  )
}
