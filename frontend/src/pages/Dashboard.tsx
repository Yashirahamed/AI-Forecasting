import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { useWeather } from '@/context/WeatherContext'
import { supabase } from '@/supabase/supabaseClient'
import { WeatherAlert } from '@/types/alert.types'
import { getGreeting, formatTemp, getAQIInfo } from '@/utils/formatWeather'
import { scaleIn, fadeUp, staggerContainer, staggerItem } from '@/utils/animations'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

// ─── Custom Animated Sparkline ──────────────────────────────────
const TempSparkline: React.FC<{ temps: number[] }> = ({ temps }) => {
  const min = Math.min(...temps)
  const max = Math.max(...temps)
  const range = max - min || 1
  const height = 30
  const width = 80
  const points = temps.map((t, idx) => {
    const x = (idx / (temps.length - 1)) * width
    const y = height - ((t - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="overflow-visible select-none pointer-events-none opacity-80">
      <polyline
        fill="none"
        stroke="url(#sparkline-grad)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <defs>
        <linearGradient id="sparkline-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
      </defs>
    </svg>
  )
}

// ─── Circular AQI Gauge ──────────────────────────────────────────
const AQIGauge: React.FC<{ value: number; max: number; color: string }> = ({ value, max, color }) => {
  const radius = 24
  const stroke = 5
  const normalizedValue = Math.min(value, max)
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (normalizedValue / max) * circumference

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width="60" height="60" className="rotate-[-90deg]">
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="30"
          cy="30"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-xs font-bold text-white">{value}</span>
    </div>
  )
}

// ─── Circular Eco Gauge ──────────────────────────────────────────
const EcoGauge: React.FC<{ points: number }> = ({ points }) => {
  const radius = 24
  const stroke = 5
  const max = 1000
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (points / max) * circumference

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width="60" height="60" className="rotate-[-90deg]">
        <circle
          cx="30"
          cy="30"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx="30"
          cy="30"
          r={radius}
          fill="transparent"
          stroke="#34d399"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-extrabold text-emerald-400">{points}pt</span>
    </div>
  )
}

// ─── Typewriter Text Hook Component ─────────────────────────────
const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayText((prev) => prev + text.charAt(index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 15)
    return () => clearInterval(interval)
  }, [text])

  return <span className="text-white/85 leading-relaxed text-sm font-semibold">{displayText}</span>
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, supabaseUser } = useAuth()
  const { currentWeather, unit, loading: weatherLoading } = useWeather()
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [alertBanner, setAlertBanner] = useState<WeatherAlert | null>(null)
  
  // Dynamic Greeting and Clock State
  const [time, setTime] = useState(new Date())
  const greeting = getGreeting()
  const displayName = supabaseUser?.name ?? user?.displayName ?? 'Yashir Ahamed'

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // ─── Supabase Realtime alerts subscription ────────────────
  useEffect(() => {
    void supabase
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setAlerts(data as WeatherAlert[])
      })

    const channel = supabase
      .channel('dashboard-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'alerts' },
        (payload) => {
          const newAlert = payload.new as WeatherAlert
          setAlerts((prev) => [newAlert, ...prev])
          setAlertBanner(newAlert)
          setTimeout(() => setAlertBanner(null), 8000)
        },
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [])

  const aqiInfo = getAQIInfo(supabaseUser?.eco_score ? 2 : 1)

  // Recharts Chart Mock Data
  const forecastData = [
    { name: 'Mon', temp: 29, humidity: 82 },
    { name: 'Tue', temp: 31, humidity: 85 },
    { name: 'Wed', temp: 32, humidity: 80 },
    { name: 'Thu', temp: 30, humidity: 78 },
    { name: 'Fri', temp: 28, humidity: 90 },
    { name: 'Sat', temp: 31, humidity: 83 },
    { name: 'Sun', temp: 32, humidity: 81 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-10">

      {/* ── Realtime Push Alert Banner ─────────────────────────── */}
      <AnimatePresence>
        {alertBanner && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.95 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 max-w-lg w-full mx-4 border border-rose/30 bg-[#0c0910]/95 backdrop-blur-2xl"
          >
            <span className="text-3xl animate-bounce">🚨</span>
            <div className="flex-1">
              <p className="text-rose font-extrabold text-sm tracking-wider uppercase">{alertBanner.type} ALERT — {alertBanner.city}</p>
              <p className="text-white/80 text-xs mt-0.5 font-medium">{alertBanner.message}</p>
            </div>
            <button onClick={() => setAlertBanner(null)} className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Greeting Header ───────────────────────────────────── */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <motion.h1 variants={staggerItem} className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t(`dashboard.${greeting}`)},{' '}
            <span className="gradient-text font-black select-all">{displayName}</span> 👋
          </motion.h1>
          <motion.p variants={staggerItem} className="text-white/50 text-sm font-semibold tracking-wider flex items-center gap-2">
            <span>📅 {time.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className="text-white/20">•</span>
            <span className="text-sky-400 font-bold">⏱️ {time.toLocaleTimeString()}</span>
          </motion.p>
        </div>

        {/* AI Morning Brief Widget */}
        <motion.div 
          variants={scaleIn}
          className="flex-1 max-w-lg glass p-5 relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl shadow-xl flex items-start gap-4"
        >
          <div className="absolute top-0 right-0 p-1 bg-sky-400/20 text-sky-400 font-extrabold text-[9px] uppercase tracking-widest rounded-bl-lg rounded-tr-xl select-none">AI Insight</div>
          <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0">
            🤖
          </div>
          <div className="space-y-1 flex-1">
            <p className="text-xs font-extrabold text-sky-400 uppercase tracking-widest">Morning Intelligence Brief</p>
            <div className="h-[44px]">
              <TypewriterText text="Westerly wind flows will maintain high humidity levels at 85% today with slight drizzle chances. Energy grids should expect peak solar collection between 11:00 AM and 3:00 PM." />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Upgraded Metric Cards Row ─────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {/* TODAY'S WEATHER CARD */}
        <motion.div
          variants={staggerItem}
          whileHover={{ y: -5 }}
          className="glass p-6 relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between group animated-border select-none"
        >
          {/* Amber solar glow for sunny/clear backing */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber/5 via-transparent to-transparent group-hover:from-amber/10 transition-all duration-500" />
          
          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Today's Temp</p>
              <h3 className="text-3xl font-black gradient-text">
                {currentWeather ? formatTemp(currentWeather.temperature, unit) : '31°C'}
              </h3>
              <p className="text-white/60 text-xs font-bold capitalize mt-1">
                {currentWeather?.description ?? 'Partly Cloudy'}
              </p>
            </div>
            {/* Spinning & floating weather icon SVG */}
            <motion.div 
              className="w-12 h-12 flex items-center justify-center text-3xl"
              animate={{ y: [0, -4, 0], rotate: 360 }}
              transition={{ 
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                rotate: { duration: 45, repeat: Infinity, ease: 'linear' }
              }}
            >
              ☀️
            </motion.div>
          </div>

          <div className="flex items-end justify-between mt-6 z-10">
            <span className="text-[10px] font-extrabold text-amber bg-amber/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Sunny</span>
            {/* Real sparkline drawn inside card */}
            <TempSparkline temps={[28, 29, 31, 32, 31, 29]} />
          </div>
        </motion.div>

        {/* AIR QUALITY CARD */}
        <motion.div
          variants={staggerItem}
          whileHover={{ y: -5 }}
          className="glass p-6 relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between group animated-border select-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald/5 via-transparent to-transparent group-hover:from-emerald/10 transition-all duration-500" />
          
          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Air Quality</p>
              <h3 className="text-3xl font-black text-white">
                {aqiInfo.label}
              </h3>
              <p className="text-white/60 text-xs font-bold mt-1">Healthy Environment</p>
            </div>
            {/* Circular AQI Gauge drawn on mount */}
            <AQIGauge value={36} max={150} color={aqiInfo.color} />
          </div>

          <div className="flex items-center justify-between mt-6 z-10">
            <span className="text-[10px] font-extrabold text-emerald bg-emerald/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Good</span>
            <span className="text-[10px] font-semibold text-white/40">PM2.5: 8.4 µg/m³</span>
          </div>
        </motion.div>

        {/* ACTIVE ALERTS CARD */}
        <motion.div
          variants={staggerItem}
          whileHover={{ y: -5 }}
          className="glass p-6 relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between group animated-border select-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-rose/5 via-transparent to-transparent group-hover:from-rose/10 transition-all duration-500" />
          
          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Active Alerts</p>
              <motion.h3 
                className="text-4xl font-black text-rose"
                animate={alerts.length > 0 ? { scale: [1, 1.15, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {alerts.length.toString()}
              </motion.h3>
              <p className="text-white/60 text-xs font-bold mt-1">
                {alerts.length > 0 ? 'Urgent Warning Actions' : 'All Systems Clear'}
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose/10 flex items-center justify-center text-2xl font-bold">
              {alerts.length > 0 ? '⚠️' : '🛡️'}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 z-10">
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              alerts.length > 0 ? 'text-rose bg-rose/15 animate-pulse' : 'text-emerald bg-emerald/15'
            }`}>
              {alerts.length > 0 ? 'Warnings' : 'No Danger'}
            </span>
            <span className="text-[10px] font-semibold text-white/40">Last check: Just now</span>
          </div>
        </motion.div>

        {/* ECO SCORE CARD */}
        <motion.div
          variants={staggerItem}
          whileHover={{ y: -5 }}
          className="glass p-6 relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between group animated-border select-none"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald/5 via-transparent to-transparent group-hover:from-emerald/10 transition-all duration-500" />
          
          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Eco Score</p>
              <h3 className="text-3xl font-black text-emerald-400">
                {supabaseUser?.eco_score ?? 180}
              </h3>
              <p className="text-white/60 text-xs font-bold mt-1">Sustainability Rank</p>
            </div>
            {/* Circular Progress Gauge */}
            <EcoGauge points={supabaseUser?.eco_score ?? 180} />
          </div>

          <div className="flex items-center justify-between mt-6 z-10">
            <span className="text-[10px] font-extrabold text-emerald bg-emerald/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Level 3</span>
            <span className="text-[10px] font-semibold text-white/40">Next level at 500pt</span>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Chennai Current Details Full Width Row ─────────────────── */}
      <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        className="glass p-8 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl overflow-hidden select-none"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-sky-400/[0.02] to-transparent pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 z-10 relative">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sky-400 text-xl">📍</span>
              <h2 className="text-xl font-extrabold text-white">Chennai, India</h2>
            </div>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Current Forecast Station Overview</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 flex-1">
            {/* Feels Like */}
            <div className="space-y-1.5 pl-6 border-l border-white/10">
              <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Feels Like</p>
              <p className="text-xl font-black text-white">34°C</p>
              <div className="text-[10px] font-bold text-white/50">Heat index active</div>
            </div>

            {/* Humidity with filling droplet */}
            <div className="space-y-1.5 pl-6 border-l border-white/10">
              <div className="flex items-center gap-1.5">
                <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Humidity</p>
                {/* Custom droplet SVG filling up */}
                <svg className="w-3.5 h-3.5 text-sky-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
              </div>
              <p className="text-xl font-black text-white">82%</p>
              <div className="text-[10px] font-bold text-white/50">High air saturation</div>
            </div>

            {/* Wind speed with rotating compass */}
            <div className="space-y-1.5 pl-6 border-l border-white/10">
              <div className="flex items-center gap-2">
                <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Wind Flow</p>
                {/* Rotating compass needle */}
                <motion.svg 
                  className="w-4 h-4 text-purple" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  animate={{ rotate: 135 }}
                  transition={{ duration: 1.5 }}
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 12" />
                </motion.svg>
              </div>
              <p className="text-xl font-black text-white">4.8 m/s</p>
              <div className="text-[10px] font-bold text-white/50">South-Easterly</div>
            </div>

            {/* Pressure */}
            <div className="space-y-1.5 pl-6 border-l border-white/10">
              <p className="text-white/40 text-[10px] font-extrabold uppercase tracking-widest">Pressure</p>
              <p className="text-xl font-black text-white">1008 hPa</p>
              <div className="text-[10px] font-bold text-white/50">Steady barometric</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Favourite Cities Scroll Row ─────────────────────────── */}
      <div className="space-y-4 select-none">
        <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
          🌟 Favourite Stations
        </h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
          {[
            { city: 'Chennai', temp: '31°C', icon: '☀️', bg: 'from-amber/5' },
            { city: 'Mumbai', temp: '28°C', icon: '🌧️', bg: 'from-blue/5' },
            { city: 'Delhi', temp: '34°C', icon: '🌪️', bg: 'from-purple/5' },
            { city: 'Bangalore', temp: '25°C', icon: '🌤️', bg: 'from-emerald/5' },
            { city: 'Kolkata', temp: '29°C', icon: '🌧️', bg: 'from-blue/5' },
            { city: 'London', temp: '16°C', icon: '☁️', bg: 'from-white/5' },
            { city: 'New York', temp: '19°C', icon: '☀️', bg: 'from-amber/5' },
          ].map((c, idx) => (
            <motion.div
              key={c.city}
              whileHover={{ y: -4, scale: 1.02 }}
              className="flex-shrink-0 w-44 glass p-5 relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl flex flex-col justify-between h-28"
            >
              <div className={`absolute inset-0 bg-gradient-to-tr ${c.bg} via-transparent to-transparent`} />
              <div className="flex justify-between items-start z-10">
                <span className="font-extrabold text-sm text-white/80">{c.city}</span>
                <span className="text-lg">{c.icon}</span>
              </div>
              <div className="z-10">
                <span className="text-xl font-black text-white">{c.temp}</span>
                <p className="text-[10px] text-white/40 font-bold uppercase mt-0.5 tracking-wider">Station {idx + 1}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Charts & Feed Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
        
        {/* 7-DAY FORECAST PREVIEW (Span 2) */}
        <motion.div
          {...fadeUp}
          className="lg:col-span-2 glass p-6 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between min-h-[350px]"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-0.5">
              <h3 className="text-white font-extrabold text-lg">7-Day Trends Preview</h3>
              <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Temperature & Saturation Curve</p>
            </div>
            <span className="text-[10px] font-extrabold text-sky-400 bg-sky-400/15 px-2 py-0.5 rounded-full uppercase tracking-wider">Active</span>
          </div>

          <div className="flex-1 w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartTempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{
                    background: 'rgba(10,15,30,0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    backdropFilter: 'blur(15px)'
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#chartTempGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* RECENT ALERTS FEED */}
        <motion.div
          {...fadeUp}
          className="glass p-6 relative bg-white/[0.03] border border-white/10 rounded-3xl shadow-xl flex flex-col justify-between min-h-[350px]"
        >
          <div className="space-y-0.5 mb-6">
            <h3 className="text-white font-extrabold text-lg">Recent Alerts Feed</h3>
            <p className="text-xs text-white/50 font-bold uppercase tracking-wider">Station Alert Log Overview</p>
          </div>

          <div className="flex-1 space-y-4">
            {alerts.length > 0 ? (
              alerts.slice(0, 3).map((alert) => (
                <motion.div
                  key={alert.id}
                  whileHover={{ x: 2 }}
                  className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl flex items-start gap-3 relative overflow-hidden"
                  style={{ borderLeft: `3px solid ${alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? '#f87171' : '#fbbf24'}` }}
                >
                  <span className="text-xl">
                    {alert.type === 'storm' ? '⛈️' : alert.type === 'flood' ? '🌊' : '⚠️'}
                  </span>
                  <div className="space-y-0.5 flex-1">
                    <p className="text-white font-bold text-xs">
                      {alert.city} — {alert.type.toUpperCase()}
                    </p>
                    <p className="text-[10px] text-white/60 truncate leading-snug">{alert.message}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-8">
                <span className="text-4xl opacity-55">🛡️</span>
                <p className="text-sm font-extrabold text-white/70">No threats detected</p>
                <p className="text-xs text-white/45 max-w-[200px]">All stations reporting clear operational statuses</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* ── Upgraded Quick Navigation (8 Action Cards) ────────── */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="space-y-4"
      >
        <h2 className="text-white font-extrabold text-lg flex items-center gap-2">
          🚀 Command Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { icon: '📊', label: 'Forecast', href: '/forecast', color: 'hover:border-sky-400' },
            { icon: '✈️', label: 'Travel Planning', href: '/travel', color: 'hover:border-emerald-400' },
            { icon: '🔄', label: 'Compare Station', href: '/compare', color: 'hover:border-purple' },
            { icon: '🍃', label: 'AQI Analyzer', href: '/aqi', color: 'hover:border-amber' },
            { icon: '🌾', label: 'Agriculture', href: '/agriculture', color: 'hover:border-emerald-400' },
            { icon: '📰', label: 'Weather News', href: '/news', color: 'hover:border-sky-400' },
            { icon: '🗓️', label: 'Itinerary Planner', href: '/itinerary', color: 'hover:border-purple' },
            { icon: '⚠️', label: 'Emergency Alerts', href: '/alerts', color: 'hover:border-rose' },
          ].map(({ icon, label, href, color }) => (
            <motion.a
              key={label}
              href={href}
              variants={staggerItem}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`glass p-5 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer ${color} group text-center select-none shadow-md`}
            >
              {/* Bouncing icon on hover */}
              <motion.span 
                className="text-3xl select-none"
                whileHover={{ scale: 1.15, y: -2 }}
              >
                {icon}
              </motion.span>
              <span className="text-white/80 text-xs font-bold leading-tight group-hover:text-white transition-colors">{label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
