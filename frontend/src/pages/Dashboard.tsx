import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useWeather } from '@/context/WeatherContext'
import { supabase } from '@/supabase/supabaseClient'
import { WeatherAlert } from '@/types/alert.types'
import { formatTemp } from '@/utils/formatWeather'
import { scaleIn, fadeUp, staggerContainer, staggerItem } from '@/utils/animations'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'
import MoodRing from '@/components/lifestyle/MoodRing'

export default function Dashboard() {
  const { user, supabaseUser } = useAuth()
  const { currentWeather, unit } = useWeather()
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [alertBanner, setAlertBanner] = useState<WeatherAlert | null>(null)
  
  // Dynamic Greeting and Clock State
  const [time, setTime] = useState(new Date())
  const displayName = supabaseUser?.name ?? user?.displayName ?? 'Yashir Ahamed'

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Supabase Realtime alerts subscription
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

  const morningBrief = "Westerly wind flows will maintain high humidity levels at 82% today with slight drizzle chances. Energy grids should expect peak solar collection between 11:00 AM and 3:00 PM."

  const cities = [
    { name: 'Chennai', temp: '31°C', condition: 'Few Clouds' },
    { name: 'Mumbai', temp: '28°C', condition: 'Heavy Rain' },
    { name: 'Delhi', temp: '34°C', condition: 'Dusty Haze' },
    { name: 'Bangalore', temp: '25°C', condition: 'Clear Sky' },
  ]

  const chartData = [
    { name: 'Mon', temp: 29 },
    { name: 'Tue', temp: 31 },
    { name: 'Wed', temp: 32 },
    { name: 'Thu', temp: 30 },
    { name: 'Fri', temp: 28 },
    { name: 'Sat', temp: 31 },
    { name: 'Sun', temp: 32 },
  ]

  const actions = [
    { label: 'Forecast', icon: '📅', path: '/forecast' },
    { label: 'Travel', icon: '✈️', path: '/travel' },
    { label: 'Compare', icon: '🔄', path: '/compare' },
    { label: 'Air Quality', icon: '🌿', path: '/aqi' },
    { label: 'Soil Moisture', icon: '🌾', path: '/agriculture' },
    { label: 'Aviation Risk', icon: '🛫', path: '/flight-risk' },
    { label: 'Event Planner', icon: '🎉', path: '/events' },
    { label: 'Time Machine', icon: '⏳', path: '/time-machine' },
  ]

  return (
    <div className="page-wrapper pt-20 select-none">

      {/* Realtime Push Alert Banner */}
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

      {/* GREETING */}
      <motion.div {...fadeUp} className="mb-8">
        <h1 className="text-5xl font-bold mb-1">
          Good evening, {' '}
          <span className="gradient-text">{displayName}</span> 👋
        </h1>
        <p className="text-white/40 text-sm">
          Sunday, May 17, 2026 · Live: {time.toLocaleTimeString()}
        </p>
      </motion.div>

      {/* MORNING BRIEF */}
      <motion.div {...fadeUp} className="glass p-5 mb-6 glow-blue">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-blue">AI INSIGHT</span>
          <span className="text-white/50 text-xs">Morning Intelligence Brief</span>
        </div>
        <p className="text-white/80 text-sm leading-relaxed">
          {morningBrief}
        </p>
      </motion.div>

      {/* METRIC CARDS - 4 columns */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        {/* Card 1: Today's Weather */}
        <motion.div variants={staggerItem}
          className="glass glass-hover p-5"
        >
          <div className="stat-label mb-3">TODAY'S WEATHER</div>
          <div className="stat-value gradient-text">
            {currentWeather ? formatTemp(currentWeather.temperature, unit) : '31°C'}
          </div>
          <div className="text-white/50 text-sm mt-1 capitalize">
            {currentWeather?.description ?? 'Few Clouds'}
          </div>
          <div className="divider" />
          <div className="text-xs text-white/40">Chennai, India</div>
        </motion.div>

        {/* Card 2: AQI */}
        <motion.div variants={staggerItem}
          className="glass glass-hover p-5"
        >
          <div className="stat-label mb-3">AIR QUALITY</div>
          <div className="stat-value gradient-text-green">Good</div>
          <div className="text-white/50 text-sm mt-1">AQI 36</div>
          <div className="divider" />
          <span className="badge badge-green">HEALTHY</span>
        </motion.div>

        {/* Card 3: Alerts */}
        <motion.div variants={staggerItem}
          className="glass glass-hover p-5"
        >
          <div className="stat-label mb-3">ACTIVE ALERTS</div>
          <div className="stat-value text-white">{alerts.length}</div>
          <div className="text-white/50 text-sm mt-1">
            {alerts.length > 0 ? `${alerts.length} warning active` : 'All clear'}
          </div>
          <div className="divider" />
          <span className={`badge ${alerts.length > 0 ? 'badge-red animate-pulse' : 'badge-green'}`}>
            {alerts.length > 0 ? 'WARNINGS' : 'NO DANGER'}
          </span>
        </motion.div>

        {/* Card 4: Eco Score */}
        <motion.div variants={staggerItem}
          className="glass glass-hover p-5 glow-green"
        >
          <div className="stat-label mb-3">ECO SCORE</div>
          <div className="stat-value gradient-text-green">
            {supabaseUser?.eco_score ?? 180}
          </div>
          <div className="text-white/50 text-sm mt-1">Level 3</div>
          <div className="divider" />
          <span className="badge badge-purple">+20 TODAY</span>
        </motion.div>
      </motion.div>

      {/* Wellness & Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          {/* WEATHER DETAIL CARD */}
          <motion.div {...fadeUp} className="glass p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <span>📍</span>
              <span className="font-semibold">Chennai, India</span>
              <span className="text-white/40 text-sm ml-auto">
                Current Forecast Station
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="stat-label">FEELS LIKE</div>
                <div className="text-2xl font-bold text-white mt-1">34°C</div>
                <div className="text-white/40 text-xs mt-1">Heat index active</div>
              </div>
              <div>
                <div className="stat-label">HUMIDITY</div>
                <div className="text-2xl font-bold text-sky-400 mt-1">82%</div>
                <div className="text-white/40 text-xs mt-1">High saturation</div>
              </div>
              <div>
                <div className="stat-label">WIND FLOW</div>
                <div className="text-2xl font-bold text-white mt-1">4.8 m/s</div>
                <div className="text-white/40 text-xs mt-1">South-Easterly</div>
              </div>
              <div>
                <div className="stat-label">PRESSURE</div>
                <div className="text-2xl font-bold text-white mt-1">1008 hPa</div>
                <div className="text-white/40 text-xs mt-1">Steady barometric</div>
              </div>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-1">
          <MoodRing />
        </div>
      </div>

      {/* FAVOURITE CITIES + 7 DAY CHART side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Favourite Cities */}
        <motion.div {...fadeUp} className="glass p-5">
          <div className="section-heading">⭐ Favourite Stations</div>
          <div className="grid grid-cols-2 gap-3">
            {cities.map((city, idx) => (
              <div key={idx} className="glass-sm glass-hover p-3">
                <div className="text-white/50 text-xs mb-1">{city.name}</div>
                <div className="text-xl font-bold text-white">{city.temp}</div>
                <div className="text-white/40 text-xs">{city.condition}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 7-Day Chart */}
        <motion.div {...fadeUp} className="glass p-5">
          <div className="section-heading">📈 7-Day Trends Preview</div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 5, bottom: 5 }}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#blueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      {/* QUICK ACTIONS */}
      <motion.div {...fadeUp} className="glass p-5">
        <div className="section-heading">🚀 Command Quick Actions</div>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {actions.map((action, idx) => (
            <Link 
              key={idx} 
              to={action.path}
              className="glass-sm glass-hover p-4 flex flex-col items-center gap-2 text-center select-none cursor-pointer"
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-white/70 text-xs font-medium">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

    </div>
  )
}
