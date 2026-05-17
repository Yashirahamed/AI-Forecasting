import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { useWeather } from '@/context/WeatherContext'
import { supabase } from '@/supabase/supabaseClient'
import { WeatherAlert } from '@/types/alert.types'
import { getGreeting, formatTemp, getAQIInfo } from '@/utils/formatWeather'

const SkeletonCard: React.FC = () => (
  <div className="glass rounded-2xl p-6 space-y-3">
    <div className="skeleton h-4 w-1/2 rounded" />
    <div className="skeleton h-8 w-3/4 rounded" />
    <div className="skeleton h-3 w-1/3 rounded" />
  </div>
)

const MetricCard: React.FC<{
  icon: string
  label: string
  value: string
  sub?: string
  color?: string
  loading?: boolean
}> = ({ icon, label, value, sub, color = '#38bdf8', loading }) => {
  if (loading) return <SkeletonCard />
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass rounded-2xl p-5 cursor-default group"
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium px-2 py-1 rounded-full"
          style={{ background: `${color}20`, color }}>
          Live
        </span>
      </div>
      <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-bold text-white group-hover:text-[#38bdf8] transition-colors">{value}</p>
      {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
    </motion.div>
  )
}

export default function Dashboard() {
  const { t } = useTranslation()
  const { user, supabaseUser } = useAuth()
  const { currentWeather, unit, loading: weatherLoading } = useWeather()
  const [alerts, setAlerts] = useState<WeatherAlert[]>([])
  const [alertBanner, setAlertBanner] = useState<WeatherAlert | null>(null)

  const greeting = getGreeting()
  const displayName = supabaseUser?.name ?? user?.displayName ?? 'there'

  // ─── Supabase Realtime alerts subscription ────────────────
  useEffect(() => {
    // Initial fetch
    void supabase
      .from('alerts')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setAlerts(data as WeatherAlert[])
      })

    // Realtime subscription
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

      {/* ── Realtime Alert Banner ─────────────────────────── */}
      {alertBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-lg w-full mx-4"
          style={{ background: 'rgba(248,113,113,0.15)', border: '1px solid rgba(248,113,113,0.3)', backdropFilter: 'blur(20px)' }}
        >
          <span className="text-2xl">🚨</span>
          <div>
            <p className="text-[#f87171] font-semibold text-sm">{alertBanner.type.toUpperCase()} ALERT — {alertBanner.city}</p>
            <p className="text-slate-300 text-xs">{alertBanner.message}</p>
          </div>
          <button onClick={() => setAlertBanner(null)} className="ml-auto text-slate-400 hover:text-white">✕</button>
        </motion.div>
      )}

      {/* ── Header ───────────────────────────────────────── */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-1">
            {t(`dashboard.${greeting}`)},{' '}
            <span className="gradient-text">{displayName}</span> 👋
          </h1>
          <p className="text-slate-400">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </motion.div>
      </div>

      {/* ── Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          icon="🌡️"
          label={t('dashboard.todayWeather')}
          value={currentWeather ? formatTemp(currentWeather.temperature, unit) : '—'}
          sub={currentWeather?.description ?? 'Loading...'}
          color="#38bdf8"
          loading={weatherLoading}
        />
        <MetricCard
          icon="🌿"
          label={t('dashboard.airQuality')}
          value={aqiInfo.label}
          sub="AQI Data"
          color={aqiInfo.color}
          loading={weatherLoading}
        />
        <MetricCard
          icon="🚨"
          label={t('dashboard.activeAlerts')}
          value={alerts.length.toString()}
          sub={`${alerts.length > 0 ? 'Active warnings' : 'All clear'}`}
          color={alerts.length > 0 ? '#f87171' : '#34d399'}
        />
        <MetricCard
          icon="🌱"
          label={t('dashboard.ecoScore')}
          value={(supabaseUser?.eco_score ?? 0).toString()}
          sub="Points earned"
          color="#34d399"
        />
      </div>

      {/* ── Current Weather Detail ────────────────────────── */}
      {currentWeather && !weatherLoading && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              📍 {currentWeather.city}, {currentWeather.country}
            </h2>
            <span className="text-slate-400 text-sm capitalize">{currentWeather.description}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="text-slate-400 text-xs mb-1">Feels Like</p>
              <p className="text-white font-semibold">{formatTemp(currentWeather.feelsLike, unit)}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Humidity</p>
              <p className="text-white font-semibold">{currentWeather.humidity}%</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Wind</p>
              <p className="text-white font-semibold">{currentWeather.windSpeed} m/s</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs mb-1">Pressure</p>
              <p className="text-white font-semibold">{currentWeather.pressure} hPa</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Active Alerts Section ─────────────────────────── */}
      {alerts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-white font-semibold text-lg mb-4">⚠️ Active Weather Alerts</h2>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className="glass rounded-xl px-5 py-4 flex items-start gap-4"
                style={{ borderLeft: '3px solid #f87171' }}
              >
                <span className="text-xl mt-0.5">
                  {alert.type === 'storm' ? '⛈️' : alert.type === 'flood' ? '🌊' : alert.type === 'heatwave' ? '🌡️' : '❄️'}
                </span>
                <div>
                  <p className="text-white font-medium text-sm">
                    {alert.type.toUpperCase()} — {alert.city}
                    <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171' }}>
                      {alert.severity}
                    </span>
                  </p>
                  <p className="text-slate-400 text-sm mt-0.5">{alert.message}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Quick Navigation ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-white font-semibold text-lg mb-4">🚀 Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { icon: '📊', label: 'Forecast', href: '/forecast' },
            { icon: '✈️', label: 'Travel', href: '/travel' },
            { icon: '🗺️', label: 'Compare', href: '/compare' },
            { icon: '🌿', label: 'AQI', href: '/aqi' },
            { icon: '🌾', label: 'Agriculture', href: '/agriculture' },
            { icon: '📰', label: 'News', href: '/news' },
          ].map(({ icon, label, href }) => (
            <a
              key={label}
              href={href}
              className="glass rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/[0.08] transition-all hover:scale-105 cursor-pointer"
            >
              <span className="text-2xl">{icon}</span>
              <span className="text-slate-300 text-xs font-medium">{label}</span>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
