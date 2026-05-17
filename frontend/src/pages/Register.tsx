import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'

export default function Register() {
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // RENDER 100 STARS with random positions
  const stars = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.8 + 0.2,
  }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Registration failed. Email might already exist.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError(null)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{background: 'radial-gradient(ellipse at top, #0d1526, #0a0f1e, #060810)'}}>

      {/* STARS */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            width: star.size + 'px',
            height: star.size + 'px',
            left: star.x + '%',
            top: star.y + '%',
            animationDelay: star.delay + 's',
            opacity: star.opacity,
          }}
        />
      ))}

      {/* ORBS */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full animate-float-slow pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.12), transparent)',
          filter: 'blur(60px)',
        }}
      />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full animate-float pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.1), transparent)',
          filter: 'blur(60px)',
        }}
      />

      {/* REGISTER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="glass glow-blue relative z-10 p-10 w-full max-w-md mx-4 select-none"
      >
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl btn-primary flex items-center justify-center text-3xl animate-spin-slow">
            🌤️
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-1">
          <span className="gradient-text">WeatherCast AI</span>
        </h1>
        <p className="text-white/40 text-center text-sm mb-8">
          Create Your Forecasting Account
        </p>

        {error && (
          <div className="p-3 bg-rose/10 border border-rose/20 rounded-xl text-xs font-semibold text-rose mb-4 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="stat-label block mb-2">FULL NAME</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="input-glass text-sm"
              required
            />
          </div>
          <div>
            <label className="stat-label block mb-2">EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-glass text-sm"
              required
            />
          </div>
          <div>
            <label className="stat-label block mb-2">PASSWORD</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-glass text-sm"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2 text-sm flex items-center justify-center gap-2">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            <span>Register</span>
          </button>

          <div className="divider" />

          <button type="button" onClick={handleGoogle} className="btn-glass w-full flex items-center justify-center gap-2 text-sm">
            <span>🔵</span> Sign up with Google
          </button>
        </form>

        <p className="text-white/40 text-center text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300">
            Sign In
          </Link>
        </p>
      </motion.div>

      {/* BOTTOM TICKER */}
      <div className="absolute bottom-0 left-0 right-0 glass-dark border-t border-white/5 py-2 overflow-hidden">
        <div className="animate-ticker whitespace-nowrap text-white/40 text-xs">
          🌡️ Chennai 31°C &nbsp;•&nbsp; 💧 Mumbai 85% humidity
          &nbsp;•&nbsp; 🌪️ Delhi 12 km/h &nbsp;•&nbsp; ☀️ Bangalore Clear
          &nbsp;•&nbsp; 🌧️ Kolkata Rain &nbsp;•&nbsp; ❄️ Shimla 8°C
          &nbsp;•&nbsp; 🌊 Kochi 29°C &nbsp;&nbsp;&nbsp;
        </div>
      </div>

    </div>
  )
}
