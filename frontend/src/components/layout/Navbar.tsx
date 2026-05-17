import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const { user, supabaseUser, logout } = useAuth()
  const navigate = useNavigate()
  const displayName = supabaseUser?.name ?? user?.displayName ?? 'Y'
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Forecast', path: '/forecast' },
    { label: 'Travel', path: '/travel' },
    { label: 'Compare', path: '/compare' },
    { label: 'Air Quality', path: '/aqi' },
    { label: 'Alerts', path: '/alerts' },
    { label: 'News', path: '/news' },
    { label: 'Community', path: '/community' },
  ]

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass-dark border-b border-white/5 px-6 flex items-center justify-between select-none">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg btn-primary flex items-center justify-center font-bold text-sm">
            W
          </div>
          <span className="font-bold text-white text-sm sm:text-base">
            Weather<span className="gradient-text font-black">Cast AI</span>
          </span>
        </Link>

        {/* Desktop Nav links */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link, idx) => (
            <NavLink
              key={idx}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? 'gradient-text font-black text-xs uppercase tracking-wider'
                  : 'text-white/50 hover:text-white text-xs uppercase tracking-wider transition-colors'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Desktop Right side & Mobile Hamburger */}
        <div className="flex items-center gap-3 relative">
          
          <div className="hidden sm:flex items-center gap-3">
            <Link to="/alerts" className="glass-sm p-2 rounded-lg text-white/50 hover:text-white transition-colors cursor-pointer text-xs">
              🔔
            </Link>
            <button className="glass-sm p-2 rounded-lg text-white/50 hover:text-white transition-colors text-xs">
              🌙
            </button>
            <div className="glass-sm px-3 py-1.5 rounded-lg text-white/50 text-xs font-bold">
              EN
            </div>
          </div>
          
          {/* Profile User Dropdown */}
          {user && (
            <div className="relative">
              <div 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-8 h-8 rounded-full btn-primary flex items-center justify-center font-bold text-sm cursor-pointer select-none uppercase"
              >
                {displayName.charAt(0)}
              </div>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass p-2 bg-[#0d1526] border border-white/10 rounded-xl shadow-2xl flex flex-col gap-1 z-50">
                  <Link 
                    to="/profile" 
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-4 py-2 hover:bg-white/5 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    Profile Credentials
                  </Link>
                  <Link 
                    to="/badges" 
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-4 py-2 hover:bg-white/5 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    Achievements
                  </Link>
                  <Link 
                    to="/admin" 
                    onClick={() => setUserDropdownOpen(false)}
                    className="px-4 py-2 hover:bg-white/5 rounded-lg text-xs font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    Admin Panel
                  </Link>
                  <div className="divider my-1" />
                  <button 
                    onClick={() => {
                      setUserDropdownOpen(false)
                      void handleLogout()
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-rose/10 rounded-lg text-xs font-semibold text-rose hover:text-rose transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden glass-sm p-2 rounded-lg text-white/50 hover:text-white transition-colors text-xs cursor-pointer"
          >
            ☰
          </button>
        </div>

      </nav>

      {/* Full-Screen Glass Drawer for Mobile */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            />

            {/* Sliding Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] z-50 glass bg-[#0d1526]/95 border-l border-white/10 p-6 flex flex-col justify-between"
            >
              <div>
                {/* Header inside drawer */}
                <div className="flex items-center justify-between mb-8">
                  <span className="font-bold text-white text-sm">Navigation</span>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-white/40 hover:text-white text-xs font-semibold px-2 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Navigation Links stacked */}
                <div className="flex flex-col gap-4">
                  {links.map((link, idx) => (
                    <NavLink
                      key={idx}
                      to={link.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        isActive
                          ? 'gradient-text font-black text-sm uppercase tracking-wider'
                          : 'text-white/60 hover:text-white text-sm uppercase tracking-wider transition-colors'
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Drawer footer */}
              {user && (
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false)
                    void handleLogout()
                  }}
                  className="w-full py-3 bg-rose/10 hover:bg-rose/20 text-rose border border-rose/20 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
