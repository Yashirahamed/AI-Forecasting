import { useState } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { LANGUAGE_OPTIONS, saveLanguagePreference } from '@/utils/languageDetect'

const NAV_LINKS = [
  { to: '/dashboard', key: 'nav.dashboard', icon: '📊' },
  { to: '/forecast', key: 'nav.forecast', icon: '🌦️' },
  { to: '/travel', key: 'nav.travel', icon: '✈️' },
  { to: '/compare', key: 'nav.compare', icon: '🔄' },
  { to: '/aqi', key: 'nav.aqi', icon: '🍃' },
  { to: '/alerts', key: 'nav.alerts', icon: '⚠️' },
  { to: '/news', key: 'nav.news', icon: '📰' },
  { to: '/community', key: 'nav.community', icon: '👥' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, supabaseUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [hasAlert, setHasAlert] = useState(true) // Mock notification badge

  const handleLang = (code: string) => {
    i18n.changeLanguage(code)
    saveLanguagePreference(code as 'en')
    setLangOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0f1e]/80 backdrop-blur-xl border-b border-white/5 shadow-lg select-none">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-20">

        {/* ─── Logo with gradient pulse on W icon ─── */}
        <Link to="/" className="flex items-center gap-3 group shrink-0">
          <motion.div 
            className="w-10 h-10 rounded-xl flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #a78bfa)' }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            animate={{ boxShadow: ['0 0 10px rgba(56,189,248,0.3)', '0 0 25px rgba(56,189,248,0.6)', '0 0 10px rgba(56,189,248,0.3)'] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {/* Logo shine effect */}
            <motion.div 
              className="absolute inset-y-0 -left-full w-1/2 bg-white/20 skew-x-12"
              animate={{ left: ['100%', '-100%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <span className="text-white font-extrabold text-lg tracking-wider drop-shadow-md">W</span>
          </motion.div>
          <span className="font-extrabold text-white text-lg hidden md:block tracking-wide">
            Weather<span className="gradient-text font-black">Cast AI</span>
          </span>
        </Link>

        {/* ─── Desktop Nav Links with slide underline transitions ─── */}
        <div className="hidden lg:flex items-center gap-1.5 bg-white/[0.02] border border-white/[0.05] rounded-full px-2.5 py-1.5">
          {NAV_LINKS.map(({ to, key }) => {
            const isActive = location.pathname === to
            return (
              <NavLink
                key={to}
                to={to}
                className="px-4 py-2 rounded-full text-sm font-semibold transition-all relative text-white"
              >
                {/* Slideline selection bubble background */}
                {isActive && (
                  <motion.div
                    layoutId="activeBubble"
                    className="absolute inset-0 bg-white/[0.07] border border-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'gradient-text font-extrabold' : 'text-white/60 hover:text-white'}`}>
                  {t(key)}
                </span>
                
                {/* Glow dot below active link */}
                {isActive && (
                  <motion.span 
                    layoutId="activeDot"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-sky-400 glow-blue"
                  />
                )}
              </NavLink>
            )
          })}
        </div>

        {/* ─── Right Controls ─── */}
        <div className="flex items-center gap-3">
          
          {/* Notification bell with badge bounce */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setHasAlert(false)}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/75 hover:text-white hover:bg-white/[0.08] relative transition-all"
            title="Notifications"
          >
            🔔
            {hasAlert && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse border border-[#0a0f1e]" />
            )}
          </motion.button>

          {/* Dark/Light mode solar toggle with Sun/Moon flip */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 18 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/75 hover:text-white hover:bg-white/[0.08] transition-all flex items-center justify-center"
            title="Toggle Theme"
          >
            <motion.span
              key={isDarkMode ? 'dark' : 'light'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-lg"
            >
              {isDarkMode ? '🌙' : '☀️'}
            </motion.span>
          </motion.button>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => { setLangOpen(!langOpen); setUserOpen(false) }}
              className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-white/75 hover:text-white hover:bg-white/[0.08] transition-all flex items-center gap-1.5 text-sm font-semibold"
              title="Change Language"
            >
              <span>🌐</span>
              <span className="hidden sm:inline uppercase">{i18n.language}</span>
            </motion.button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-3 w-44 glass rounded-2xl py-2 z-50 bg-[#0d1526]/90 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                >
                  {LANGUAGE_OPTIONS.map(({ code, label, flag }) => (
                    <button
                      key={code}
                      onClick={() => handleLang(code)}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-white/[0.08] transition-colors ${
                        i18n.language === code ? 'text-[#38bdf8] font-bold' : 'text-white/70'
                      }`}
                    >
                      <span>{flag}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Section with custom ring hover */}
          {user ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => { setUserOpen(!userOpen); setLangOpen(false) }}
                className="flex items-center gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 hover:bg-white/[0.08] transition-all relative group"
              >
                {supabaseUser?.avatar_url ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden p-[1.5px] bg-gradient-to-tr from-[#38bdf8] to-[#a78bfa] transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]">
                    <img
                      src={supabaseUser.avatar_url}
                      alt="avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-sm transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #a78bfa)' }}>
                    {(supabaseUser?.name ?? user.email ?? 'U')[0].toUpperCase()}
                  </div>
                )}
              </motion.button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-3 w-56 glass rounded-2xl py-2 z-50 bg-[#0d1526]/90 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-extrabold text-white truncate">
                        {supabaseUser?.name ?? 'User'}
                      </p>
                      <p className="text-xs text-white/50 truncate font-semibold">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      👤 {t('nav.profile')}
                    </Link>
                    <Link
                      to="/badges"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-white/80 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      🏅 {t('nav.badges')}
                    </Link>
                    {supabaseUser?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-2.5 text-sm font-bold text-[#a78bfa] hover:bg-white/[0.08] transition-colors"
                      >
                        🛡️ {t('nav.admin')}
                      </Link>
                    )}
                    <hr className="border-white/10 my-1.5" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#f87171] hover:bg-[#f87171]/10 transition-colors"
                    >
                      🚪 {t('nav.logout')}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn-primary text-sm hidden sm:inline-flex items-center font-bold px-6 py-2.5 rounded-full"
              style={{ background: 'linear-gradient(135deg, #38bdf8, #a78bfa)' }}
            >
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile Hamburger menu */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            id="mobile-menu-toggle"
            className="lg:hidden p-2.5 rounded-xl text-white/80 hover:text-white hover:bg-white/[0.06] transition-all bg-white/[0.03] border border-white/10 flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </motion.button>
        </div>
      </nav>

      {/* ─── Mobile Drawer sliding from right with absolute backdrop blur ─── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Drawer Overlay backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />

            {/* Sliding Drawer Card */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-[280px] bg-[#0a0f1e]/95 border-l border-white/10 z-50 lg:hidden p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl"
            >
              <div className="space-y-8">
                {/* Drawer Header */}
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white text-base tracking-wide">
                    Weather<span className="gradient-text font-black">Cast AI</span>
                  </span>
                  <button 
                    onClick={() => setMenuOpen(false)}
                    className="p-1.5 rounded-lg text-white/50 hover:text-white bg-white/5 hover:bg-white/10 transition-all text-xs"
                  >
                    ✕
                  </button>
                </div>

                {/* Nav list */}
                <div className="space-y-2">
                  {NAV_LINKS.map(({ to, key, icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'text-white bg-white/[0.08] border border-white/10 font-bold shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                        }`
                      }
                    >
                      <span className="text-base">{icon}</span>
                      <span>{t(key)}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Drawer Footer controls */}
              <div className="space-y-4">
                {!user ? (
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full btn-primary text-center font-bold py-3.5 rounded-xl block"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #a78bfa)' }}
                  >
                    {t('nav.login')}
                  </Link>
                ) : (
                  <button
                    onClick={() => { handleLogout(); setMenuOpen(false) }}
                    className="w-full text-center py-3.5 rounded-xl font-bold bg-rose/10 text-rose border border-rose/25 hover:bg-rose/20 transition-all text-sm block"
                  >
                    🚪 {t('nav.logout')}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
