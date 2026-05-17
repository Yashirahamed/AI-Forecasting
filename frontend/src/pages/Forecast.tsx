import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { fadeUp, scaleIn, staggerContainer, staggerItem } from '@/utils/animations'

export default function Forecast() {
  const [activeDay, setActiveDay] = useState<number | null>(0)
  const [condition, setCondition] = useState<'sunny' | 'rainy'>('sunny')

  // Mock Hourly Data
  const hourlyData = [
    { time: '09:00', temp: 28, icon: '☀️', active: false },
    { time: '11:00', temp: 30, icon: '☀️', active: false },
    { time: '13:00', temp: 32, icon: '☀️', active: true }, // Current hour
    { time: '15:00', temp: 31, icon: '🌤️', active: false },
    { time: '17:00', temp: 29, icon: '🌤️', active: false },
    { time: '19:00', temp: 27, icon: '☁️', active: false },
    { time: '21:00', temp: 26, icon: '🌧️', active: false },
    { time: '23:00', temp: 25, icon: '🌧️', active: false },
  ]

  // Mock 7-Day Data
  const dailyForecast = [
    { day: 'Monday', temp: '31°C / 24°C', icon: '☀️', desc: 'Sunny & Warm', hum: '82%', wind: '12 km/h', press: '1008 hPa' },
    { day: 'Tuesday', temp: '32°C / 25°C', icon: '🌤️', desc: 'Partly Cloudy', hum: '85%', wind: '14 km/h', press: '1007 hPa' },
    { day: 'Wednesday', temp: '29°C / 23°C', icon: '🌧️', desc: 'Heavy Rain showers', hum: '95%', wind: '18 km/h', press: '1005 hPa' },
    { day: 'Thursday', temp: '30°C / 24°C', icon: '⛈️', desc: 'Thunderstorms expected', hum: '90%', wind: '22 km/h', press: '1004 hPa' },
    { day: 'Friday', temp: '31°C / 24°C', icon: '🌤️', desc: 'Clearing skies', hum: '80%', wind: '10 km/h', press: '1009 hPa' },
    { day: 'Saturday', temp: '32°C / 26°C', icon: '☀️', desc: 'Completely Clear', hum: '75%', wind: '8 km/h', press: '1010 hPa' },
    { day: 'Sunday', temp: '33°C / 26°C', icon: '☀️', desc: 'Intense Heat Index', hum: '78%', wind: '11 km/h', press: '1008 hPa' },
  ]

  // Mock Chart Data
  const chartData = [
    { name: 'Mon', temp: 31, humidity: 82, wind: 12 },
    { name: 'Tue', temp: 32, humidity: 85, wind: 14 },
    { name: 'Wed', temp: 29, humidity: 95, wind: 18 },
    { name: 'Thu', temp: 30, humidity: 90, wind: 22 },
    { name: 'Fri', temp: 31, humidity: 80, wind: 10 },
    { name: 'Sat', temp: 32, humidity: 75, wind: 8 },
    { name: 'Sun', temp: 33, humidity: 78, wind: 11 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 select-none">
      
      {/* ── Condition Switcher (Simulating sunny vs rainy dashboard styling) ── */}
      <div className="flex justify-end gap-3">
        <button 
          onClick={() => setCondition('sunny')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            condition === 'sunny' ? 'bg-amber/15 border-amber text-amber glow-blue' : 'bg-white/5 border-white/10 text-white/55'
          }`}
        >
          ☀️ Sunny Station Style
        </button>
        <button 
          onClick={() => setCondition('rainy')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
            condition === 'rainy' ? 'bg-sky-400/15 border-sky-400 text-sky-400 glow-blue' : 'bg-white/5 border-white/10 text-white/55'
          }`}
        >
          🌧️ Rainy Station Style
        </button>
      </div>

      {/* ── Page Hero Card with Dynamic Condition Gradients ── */}
      <motion.div
        {...scaleIn}
        className={`glass p-8 relative overflow-hidden rounded-3xl shadow-2xl bg-white/[0.04] border border-white/10`}
      >
        <div className={`absolute inset-0 bg-gradient-to-tr transition-all duration-500 ${
          condition === 'sunny' 
            ? 'from-amber/10 via-transparent to-transparent' 
            : 'from-blue/15 via-transparent to-transparent'
        }`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-extrabold bg-sky-400/20 text-sky-400 px-3 py-1 rounded-full uppercase tracking-wider">Operational Station</span>
            <h1 className="text-4xl sm:text-5xl font-black text-white">Chennai, India</h1>
            <p className="text-white/50 text-sm font-semibold">Coordinates: 13.0827° N, 80.2707° E • Elev: 6m</p>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-5xl sm:text-7xl font-black gradient-text">31°C</span>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{condition === 'sunny' ? '☀️' : '🌧️'}</span>
                <span className="text-lg font-bold text-white capitalize">{condition === 'sunny' ? 'Sunny & Clear' : 'Rain Showers'}</span>
              </div>
              <p className="text-xs text-white/40 font-bold uppercase tracking-wider">Feels Like: 34°C</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── AI Weather Prediction Card ── */}
      <motion.div 
        {...fadeUp}
        className="glass p-6 relative bg-white/[0.03] border border-white/10 rounded-2xl flex items-start gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-purple/10 flex items-center justify-center shrink-0 text-xl">
          🤖
        </div>
        <div className="space-y-1">
          <p className="text-xs font-extrabold text-purple uppercase tracking-widest">AI Prediction Insight</p>
          <p className="text-white/85 text-sm font-semibold leading-relaxed">
            The low pressure system over the bay of Bengal is expected to carry precipitation inward starting Wednesday. Barometric readings will fall gradually to 1004 hPa before restoring Friday evening. Keep rain gear accessible.
          </p>
        </div>
      </motion.div>

      {/* ── Hourly Forecast (Horizontal Scroll) ── */}
      <div className="space-y-4">
        <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
          ⏰ Hourly Sequence Forecast
        </h3>
        <div className="flex items-center gap-4 overflow-x-auto pb-4 scrollbar-none">
          {hourlyData.map((h) => (
            <motion.div
              key={h.time}
              whileHover={{ y: -4 }}
              className={`flex-shrink-0 w-32 p-5 rounded-2xl border text-center transition-all flex flex-col justify-between h-36 ${
                h.active 
                  ? 'bg-sky-400/10 border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.25)]' 
                  : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              <span className={`text-xs font-bold ${h.active ? 'text-sky-400 font-extrabold' : 'text-white/40'}`}>{h.time}</span>
              <span className="text-2xl my-2 block select-none">{h.icon}</span>
              <span className="text-lg font-black text-white">{h.temp}°C</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 7-Day Forecast & Charts Split Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 7-DAY VERTICAL ACCORDION LIST */}
        <div className="space-y-4">
          <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
            📅 7-Day Sequence Forecast
          </h3>
          <div className="space-y-3">
            {dailyForecast.map((d, idx) => {
              const isOpen = activeDay === idx
              return (
                <div 
                  key={d.day}
                  className="glass overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl transition-all"
                >
                  {/* Summary Bar */}
                  <div 
                    onClick={() => setActiveDay(isOpen ? null : idx)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/[0.05] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl select-none">{d.icon}</span>
                      <span className="font-extrabold text-sm text-white">{d.day}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-white/50 font-bold">{d.desc}</span>
                      <span className="text-sm font-black text-white">{d.temp}</span>
                      <span className="text-xs text-white/40 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}>▼</span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="border-t border-white/5 bg-black/10 px-5 py-4"
                      >
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-white/40 font-extrabold uppercase">Humidity</p>
                            <p className="text-sm font-bold text-white">{d.hum}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-white/40 font-extrabold uppercase">Wind</p>
                            <p className="text-sm font-bold text-white">{d.wind}</p>
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-[10px] text-white/40 font-extrabold uppercase">Pressure</p>
                            <p className="text-sm font-bold text-white">{d.press}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </div>

        {/* RECHARTS WEATHER SYSTEM CHARTS */}
        <div className="space-y-6">
          <h3 className="text-white font-extrabold text-lg flex items-center gap-2">
            📈 Dynamic Metrics Curves
          </h3>
          
          {/* Chart 1: Temp Curve */}
          <div className="glass p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
            <p className="text-xs font-extrabold text-white/40 uppercase tracking-wider">Temperature Curve (Mon - Sun)</p>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ left: -30, right: 10, top: 5, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="temp" stroke="#38bdf8" strokeWidth={2.5} dot={{ fill: '#38bdf8' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Humidity Curve */}
          <div className="glass p-5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-4">
            <p className="text-xs font-extrabold text-white/40 uppercase tracking-wider">Air Saturation Curve (%)</p>
            <div className="h-[120px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ left: -30, right: 10, top: 5, bottom: 5 }}>
                  <defs>
                    <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(10,15,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', backdropFilter: 'blur(10px)' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="humidity" stroke="#a78bfa" strokeWidth={2.5} fillOpacity={1} fill="url(#humGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}