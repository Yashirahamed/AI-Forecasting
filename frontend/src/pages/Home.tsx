import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

interface Slide {
  id: number
  title: string
  subtitle: string
  cta: string
  path: string
  gradient: string
  icon: string
  iconClass: string
  particlesColor: string
}

const SLIDES: Slide[] = [
  {
    id: 0,
    title: 'Monsoon Intelligence',
    subtitle: 'AI predicts rainfall patterns 72hrs ahead with unmatched precision',
    cta: 'Check Forecast',
    path: '/forecast',
    gradient: 'linear-gradient(135deg, #0b1a30, #0a0f1e)',
    icon: '🌧️',
    iconClass: 'animate-rain',
    particlesColor: '#38bdf8'
  },
  {
    id: 1,
    title: 'AI Travel Oracle',
    subtitle: 'Find worldwide destinations matching your perfect custom weather',
    cta: 'Explore Destinations',
    path: '/travel',
    gradient: 'linear-gradient(135deg, #1e1135, #0a0f1e)',
    icon: '✈️',
    iconClass: 'animate-float',
    particlesColor: '#a78bfa'
  },
  {
    id: 2,
    title: 'Disaster Early Warning',
    subtitle: 'Real-time anomaly detection and dangerous storm alerts across 50+ cities',
    cta: 'View Alerts',
    path: '/alerts',
    gradient: 'linear-gradient(135deg, #300f13, #0a0f1e)',
    icon: '🛡️',
    iconClass: 'animate-pulse-glow',
    particlesColor: '#f87171'
  },
  {
    id: 3,
    title: 'Eco Guardian',
    subtitle: 'Track your personal carbon footprint integrated with local climate indicators',
    cta: 'My Eco Score',
    path: '/dashboard',
    gradient: 'linear-gradient(135deg, #0b2d18, #0a0f1e)',
    icon: '🌿',
    iconClass: 'animate-sway',
    particlesColor: '#34d399'
  },
  {
    id: 4,
    title: 'Night Sky Predictor',
    subtitle: 'AI intelligence models calculate the absolute best stargazing visibility tonight',
    cta: 'Check Tonight',
    path: '/forecast',
    gradient: 'linear-gradient(135deg, #0d122b, #180d2b)',
    icon: '🌌',
    iconClass: 'animate-twinkle',
    particlesColor: '#fbbf24'
  }
]

const FEATURES = [
  { icon: '🌤️', title: 'Real-Time Weather', desc: 'Live conditions and 7-day forecasts for any city on Earth.' },
  { icon: '🤖', title: 'AI Weather Chat', desc: 'Ask Nexus Oracle anything about weather, travel, or climate.' },
  { icon: '✈️', title: 'Smart Travel Planner', desc: 'AI-generated itineraries tailored to the weather forecast.' },
  { icon: '🌿', title: 'Air Quality Index', desc: 'Real-time AQI with health tips and pollution breakdowns.' },
  { icon: '🚨', title: 'Disaster Alerts', desc: 'Instant storm, flood, and cyclone alerts with safety checklists.' },
  { icon: '🏅', title: 'Gamification', desc: 'Earn badges and eco-scores by engaging with the platform.' },
]

export default function Home() {
  const { user } = useAuth()
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)

  // Auto-advance loop (5 seconds)
  useEffect(() => {
    setProgress(0)
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length)
    }, 5000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + (100 / 50), 100))
    }, 100)

    return () => {
      clearInterval(interval)
      clearInterval(progressInterval)
    }
  }, [current])

  const nextSlide = () => {
    setCurrent((current + 1) % SLIDES.length)
  }

  const prevSlide = () => {
    setCurrent((current - 1 + SLIDES.length) % SLIDES.length)
  }

  const slide = SLIDES[current]

  return (
    <div className="min-h-screen select-none overflow-x-hidden" style={{ background: '#0a0f1e' }}>

      {/* ── HERO SLIDER ──────────────────────────────────────── */}
      <section className="relative h-screen min-h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Dynamic Background Gradient */}
        <div className="absolute inset-0 transition-all duration-1000 ease-in-out pointer-events-none" 
          style={{ background: slide.gradient }} />

        {/* Ambient background particles (glow blobs) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full opacity-20 filter blur-[80px]"
            style={{ background: `radial-gradient(circle, ${slide.particlesColor}, transparent 70%)` }} />
          <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full opacity-15 filter blur-[80px]"
            style={{ background: `radial-gradient(circle, ${slide.particlesColor}, transparent 70%)` }} />
        </div>

        {/* Slides Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -200 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12 z-10"
          >
            {/* Left Column: Staggered Text */}
            <div className="flex-1 text-center md:text-left space-y-6">
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-white/5 border border-white/10 text-white"
              >
                🔮 Nexa Weather Intelligent
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight font-sans"
              >
                {slide.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/60 text-base sm:text-xl max-w-xl leading-relaxed"
              >
                {slide.subtitle}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center md:justify-start gap-4 pt-4"
              >
                <Link
                  to={slide.path}
                  className="btn-primary px-8 py-3.5 text-sm font-black tracking-wide uppercase select-none cursor-pointer"
                >
                  {slide.cta}
                </Link>
                <Link
                  to={user ? '/dashboard' : '/register'}
                  className="btn-glass px-8 py-3.5 text-sm font-bold tracking-wide uppercase select-none cursor-pointer"
                >
                  Join Nexus
                </Link>
              </motion.div>
            </div>

            {/* Right Column: Giant Animated Scenario Icon */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 20 }}
              transition={{ duration: 0.6 }}
              className="flex-1 flex justify-center items-center pointer-events-none"
            >
              <div className={`text-[120px] sm:text-[180px] md:text-[220px] select-none filter drop-shadow-[0_20px_50px_rgba(255,255,255,0.1)] ${slide.iconClass}`}>
                {slide.icon}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Dot Indicators */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrent(idx)}
              className={`w-3.5 h-3.5 rounded-full border transition-all duration-300 ${
                current === idx 
                  ? 'bg-white border-white scale-125' 
                  : 'bg-white/20 border-white/10 hover:bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Left & Right Arrow Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass hover:bg-white/10 text-white flex items-center justify-center font-bold z-20 transition-all select-none cursor-pointer"
        >
          ‹
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass hover:bg-white/10 text-white flex items-center justify-center font-bold z-20 transition-all select-none cursor-pointer"
        >
          ›
        </button>

        {/* Bottom Time Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 z-20">
          <div className="h-full bg-white transition-all duration-100 ease-linear" style={{ width: `${progress}%` }} />
        </div>

      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl sm:text-5xl font-black text-white">Everything you need to understand the sky</h2>
          <p className="text-white/40 text-base max-w-xl mx-auto font-semibold">
            From hyper-local forecasts to AI-powered travel planning — WeatherCast AI is the only weather app you'll ever need.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, idx) => (
            <div 
              key={idx}
              className="glass p-8 glass-hover flex flex-col justify-between h-[220px]"
            >
              <div>
                <span className="text-4xl block mb-4">{feat.icon}</span>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-white/50 text-xs font-semibold leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 mb-16">
        <div className="glass p-12 text-center rounded-3xl glow-blue">
          <h2 className="text-3xl font-black text-white mb-4">Ready to experience smarter weather?</h2>
          <p className="text-white/50 text-sm font-semibold max-w-md mx-auto mb-8">
            Join thousands of users getting AI-powered weather insights every single day.
          </p>
          <Link to="/register" className="btn-primary px-8 py-3.5 text-xs font-black tracking-wide uppercase select-none cursor-pointer">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 text-center border-t border-white/5">
        <p className="text-white/30 text-xs font-bold uppercase tracking-wider">
          © 2026 WeatherCast AI — Built with ❤️ using React, Groq Llama 3 & OpenWeatherMap
        </p>
      </footer>

    </div>
  )
}
