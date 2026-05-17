import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/context/AuthContext'
import { LANGUAGE_OPTIONS, saveLanguagePreference } from '@/utils/languageDetect'

const NAV_LINKS = [
  { to: '/dashboard', key: 'nav.dashboard' },
  { to: '/forecast', key: 'nav.forecast' },
  { to: '/travel', key: 'nav.travel' },
  { to: '/compare', key: 'nav.compare' },
  { to: '/aqi', key: 'nav.aqi' },
  { to: '/alerts', key: 'nav.alerts' },
  { to: '/news', key: 'nav.news' },
  { to: '/community', key: 'nav.community' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { user, supabaseUser, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)

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
    <header className="sticky top-0 z-50 w-full" style={{
      background: 'rgba(10, 15, 30, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center glow-blue"
            style={{ background: 'linear-gradient(135deg, #38bdf8, #a78bfa)' }}>
            <span className="text-white font-bold text-sm">W</span>
          </div>
          <span className="font-bold text-white hidden sm:block" style={{ fontSize: '1.1rem' }}>
            Weather<span className="gradient-text">Cast AI</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map(({ to, key }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-[#38bdf8] bg-[rgba(56,189,248,0.12)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`
              }
            >
              {t(key)}
            </NavLink>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">

          {/* Language Switcher */}
          <div className="relative">
            <button
              id="lang-toggle"
              onClick={() => { setLangOpen(!langOpen); setUserOpen(false) }}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all text-sm"
              title="Change Language"
            >
              🌐
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-40 glass rounded-xl py-1 z-50"
                >
                  {LANGUAGE_OPTIONS.map(({ code, label, flag }) => (
                    <button
                      key={code}
                      onClick={() => handleLang(code)}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-white/[0.08] transition-colors ${
                        i18n.language === code ? 'text-[#38bdf8]' : 'text-slate-300'
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

          {/* Auth */}
          {user ? (
            <div className="relative">
              <button
                id="user-menu-toggle"
                onClick={() => { setUserOpen(!userOpen); setLangOpen(false) }}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/[0.06] transition-all"
              >
                {supabaseUser?.avatar_url ? (
                  <img
                    src={supabaseUser.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-[#38bdf8]/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg, #38bdf8, #a78bfa)' }}>
                    {(supabaseUser?.name ?? user.email ?? 'U')[0].toUpperCase()}
                  </div>
                )}
              </button>
              <AnimatePresence>
                {userOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-48 glass rounded-xl py-1 z-50"
                  >
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-sm font-medium text-white truncate">
                        {supabaseUser?.name ?? 'User'}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      👤 {t('nav.profile')}
                    </Link>
                    <Link
                      to="/badges"
                      onClick={() => setUserOpen(false)}
                      className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
                    >
                      🏅 {t('nav.badges')}
                    </Link>
                    {supabaseUser?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserOpen(false)}
                        className="block px-4 py-2 text-sm text-[#a78bfa] hover:bg-white/[0.08] transition-colors"
                      >
                        🛡️ {t('nav.admin')}
                      </Link>
                    )}
                    <hr className="border-white/10 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-[#f87171] hover:bg-white/[0.08] transition-colors"
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
              className="btn-primary text-sm hidden sm:inline-flex items-center"
            >
              {t('nav.login')}
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            id="mobile-menu-toggle"
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-t border-white/[0.08]"
            style={{ background: 'rgba(10, 15, 30, 0.95)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(({ to, key }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'text-[#38bdf8] bg-[rgba(56,189,248,0.12)]'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                    }`
                  }
                >
                  {t(key)}
                </NavLink>
              ))}
              {!user && (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block btn-primary text-center mt-3"
                >
                  {t('nav.login')}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
