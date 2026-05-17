import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { scaleIn } from '@/utils/animations'

// ─── Star Field & Floating Orbs Component ─────────────────────
const ImmersiveSpaceBackground: React.FC = () => {
  const stars = Array.from({ length: 150 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 2,
  }))

  const meteors = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 40}%`,
    left: `${Math.random() * 60 + 20}%`,
    delay: Math.random() * 10,
    duration: Math.random() * 4 + 3,
  }))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#060810]">
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 10%, #0d1526 0%, #0a0f1e 50%, #060810 100%)'
        }}
      />

      {/* Stars */}
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white opacity-40 animate-twinkle"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}

      {/* Meteors */}
      {meteors.map((m) => (
        <div
          key={m.id}
          className="absolute h-0.5 w-[80px] bg-gradient-to-r from-white to-transparent opacity-0 animate-meteor"
          style={{
            top: m.top,
            left: m.left,
            transform: 'rotate(-45deg)',
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
          }}
        />
      ))}

      {/* Orbs */}
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full filter blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56,189,248,0.15) 0%, transparent 70%)',
          top: '-10%',
          left: '-10%',
        }}
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -30, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full filter blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.12) 0%, transparent 70%)',
          bottom: '-10%',
          right: '-10%',
        }}
        animate={{
          x: [0, -50, 30, 0],
          y: [0, 40, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[350px] h-[350px] rounded-full filter blur-[100px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(52,211,153,0.08) 0%, transparent 70%)',
          top: '30%',
          right: '15%',
        }}
        animate={{
          x: [0, 30, -30, 0],
          y: [0, -20, 40, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}

// ─── Bottom Weather Stats Ticker Component ───────────────────
const WeatherStatsTicker: React.FC = () => {
  const stats = [
    "🌡️ Chennai 31°C",
    "💧 Mumbai 85% humidity",
    "🌪️ Delhi 12 km/h wind",
    "☀️ Bangalore Clear",
    "🌡️ Hyderabad 33°C",
    "💧 Kolkata 78% humidity",
    "🌪️ Pune 8 km/h wind",
    "☀️ London 18°C"
  ]

  return (
    <div className="absolute bottom-0 inset-x-0 bg-black/30 backdrop-blur-md border-t border-white/5 py-3 overflow-hidden z-10 select-none">
      <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] gap-12 text-sm text-white/60 font-medium">
        {Array.from({ length: 4 }).flatMap(() => stats).map((text, idx) => (
          <span key={idx} className="flex items-center gap-2">
            {text}
            <span className="text-white/20">•</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

export default function Register() {
  const { t } = useTranslation()
  const { register, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  // Floating Label Focus States
  const [nameFocused, setNameFocused] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)
  const [confirmFocused, setConfirmFocused] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password || !confirm) {
      setError('Please fill in all fields.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
      setError(
        msg.includes('email-already-in-use')
          ? 'An account with this email already exists.'
          : 'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    setError(null)
    try {
      await loginWithGoogle()
      navigate('/dashboard')
    } catch {
      setError('Google sign-up failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative px-4 py-16 overflow-hidden">
      {/* Space Backdrop */}
      <ImmersiveSpaceBackground />

      {/* Registration Card */}
      <motion.div
        {...scaleIn}
        className="relative z-10 w-full max-w-[440px] glass rounded-3xl p-10 glow-purple shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-2xl bg-white/[0.04]"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <motion.svg 
              viewBox="0 0 24 24" 
              className="w-16 h-16 text-purple drop-shadow-[0_0_15px_rgba(167,139,250,0.6)]"
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            >
              <defs>
                <linearGradient id="cloud-glow-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a78bfa" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <path 
                fill="url(#cloud-glow-purple)" 
                d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4 0-2.05 1.53-3.76 3.56-3.97l1.07-.11.5-.95C8.08 7.14 9.94 6 12 6c2.62 0 4.88 1.86 5.39 4.43l.3 1.5 1.53.11c1.56.1 2.78 1.41 2.78 2.96 0 1.65-1.35 3-3 3z" 
              />
              <motion.path
                d="M13 9l-4 7h3l-1 5 6-8h-4z"
                fill="#ffeb3b"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            <span className="gradient-text">Create Account</span>
          </h1>
          <p className="text-white/60 text-sm font-semibold tracking-wide flex justify-center gap-1">
            🚀 Join WeatherCast AI today
          </p>
        </div>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="mb-6 px-4 py-3 rounded-2xl text-sm font-medium text-rose bg-rose/10 border border-rose/20 flex items-center gap-2"
            >
              <span>⚠️</span>
              <span className="flex-1">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Google Authentication Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          id="google-signup-btn"
          onClick={handleGoogle}
          disabled={googleLoading}
          className="w-full bg-white/[0.05] border border-white/10 hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300 rounded-2xl py-3.5 px-4 font-semibold text-white/95 flex items-center justify-center gap-3 shadow-lg select-none"
        >
          {googleLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
          )}
          <span>{t('auth.signInWithGoogle')}</span>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-white/10" />
          <span className="text-white/40 text-xs font-bold uppercase tracking-wider">or</span>
          <div className="flex-1 h-[1px] bg-white/10" />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="relative">
            <input
              id="register-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-purple focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm focus:shadow-[0_0_15px_rgba(167,139,250,0.25)]"
              placeholder="Name"
              required
            />
            <label
              htmlFor="register-name"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-semibold pointer-events-none transition-all duration-300 ${
                nameFocused || name ? '-translate-y-[28px] scale-90 text-purple bg-[#090e1b] px-2 rounded' : ''
              }`}
            >
              {t('auth.name')}
            </label>
          </div>

          {/* Email Field */}
          <div className="relative">
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 text-white outline-none focus:border-purple focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm focus:shadow-[0_0_15px_rgba(167,139,250,0.25)]"
              placeholder="Email"
              required
            />
            <label
              htmlFor="register-email"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-semibold pointer-events-none transition-all duration-300 ${
                emailFocused || email ? '-translate-y-[28px] scale-90 text-purple bg-[#090e1b] px-2 rounded' : ''
              }`}
            >
              {t('auth.email')}
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPassFocused(true)}
              onBlur={() => setPassFocused(false)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white outline-none focus:border-purple focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm focus:shadow-[0_0_15px_rgba(167,139,250,0.25)]"
              placeholder="Password"
              required
            />
            <label
              htmlFor="register-password"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-semibold pointer-events-none transition-all duration-300 ${
                passFocused || password ? '-translate-y-[28px] scale-90 text-purple bg-[#090e1b] px-2 rounded' : ''
              }`}
            >
              {t('auth.password')}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>

          {/* Confirm Password Field */}
          <div className="relative">
            <input
              id="register-confirm-password"
              type={showPassword ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-white outline-none focus:border-purple focus:bg-white/[0.06] transition-all duration-300 placeholder-transparent text-sm focus:shadow-[0_0_15px_rgba(167,139,250,0.25)]"
              placeholder="Confirm Password"
              required
            />
            <label
              htmlFor="register-confirm-password"
              className={`absolute left-4 top-1/2 -translate-y-1/2 text-white/50 text-sm font-semibold pointer-events-none transition-all duration-300 ${
                confirmFocused || confirm ? '-translate-y-[28px] scale-90 text-purple bg-[#090e1b] px-2 rounded' : ''
              }`}
            >
              {t('auth.confirmPassword')}
            </label>
          </div>

          {/* Submit Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 25px rgba(167,139,250,0.45)' }}
            whileTap={{ scale: 0.98 }}
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-bold tracking-wide flex items-center justify-center gap-2 select-none"
            style={{
              background: 'linear-gradient(135deg, #a78bfa 0%, #38bdf8 100%)'
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            <span>{t('auth.signUp')}</span>
          </motion.button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-white/50 mt-8 font-medium">
          {t('auth.hasAccount')}{' '}
          <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors font-semibold underline underline-offset-4">
            {t('auth.signIn')}
          </Link>
        </p>
      </motion.div>

      {/* Bottom Stats marquee */}
      <WeatherStatsTicker />
    </div>
  )
}
