import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider, useAuth } from '@/context/AuthContext'
import { WeatherProvider } from '@/context/WeatherContext'
import './i18n'

// ─── Layout ───────────────────────────────────────────────────
import Navbar from '@/components/layout/Navbar'

// ─── Lazy Pages ───────────────────────────────────────────────
const Home        = lazy(() => import('@/pages/Home'))
const Dashboard   = lazy(() => import('@/pages/Dashboard'))
const Forecast    = lazy(() => import('@/pages/Forecast'))
const Travel      = lazy(() => import('@/pages/Travel'))
const Itinerary   = lazy(() => import('@/pages/Itinerary'))
const Compare     = lazy(() => import('@/pages/Compare'))
const AQI         = lazy(() => import('@/pages/AQI'))
const Alerts      = lazy(() => import('@/pages/Alerts'))
const Agriculture = lazy(() => import('@/pages/Agriculture'))
const Events      = lazy(() => import('@/pages/Events'))
const Community   = lazy(() => import('@/pages/Community'))
const TimeMachine = lazy(() => import('@/pages/TimeMachine'))
const FlightRisk  = lazy(() => import('@/pages/FlightRisk'))
const News        = lazy(() => import('@/pages/News'))
const Profile     = lazy(() => import('@/pages/Profile'))
const Badges      = lazy(() => import('@/pages/Badges'))
const Admin       = lazy(() => import('@/pages/Admin'))
const Login       = lazy(() => import('@/pages/Login'))
const Register    = lazy(() => import('@/pages/Register'))

// ─── Page Transition Wrapper ──────────────────────────────────
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
  >
    {children}
  </motion.div>
)

// ─── Loading Skeleton ─────────────────────────────────────────
const PageLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0f1e' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-[#38bdf8] animate-spin" />
      <p className="text-slate-400 text-sm animate-pulse">Loading WeatherCast AI…</p>
    </div>
  </div>
)

// ─── Protected Route ──────────────────────────────────────────
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

// ─── Admin Route ──────────────────────────────────────────────
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, supabaseUser, loading } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (supabaseUser?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

// ─── Public Layout (with Navbar) ──────────────────────────────
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
    <Navbar />
    <main>{children}</main>
  </div>
)

// ─── Auth Layout (no Navbar) ──────────────────────────────────
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen" style={{ background: '#0a0f1e' }}>
    {children}
  </div>
)

// ─── Animated Routes ─────────────────────────────────────────
const AnimatedRoutes: React.FC = () => {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth pages */}
        <Route path="/login" element={
          <AuthLayout>
            <PageTransition>
              <Suspense fallback={<PageLoader />}><Login /></Suspense>
            </PageTransition>
          </AuthLayout>
        } />
        <Route path="/register" element={
          <AuthLayout>
            <PageTransition>
              <Suspense fallback={<PageLoader />}><Register /></Suspense>
            </PageTransition>
          </AuthLayout>
        } />

        {/* Public home */}
        <Route path="/" element={
          <PublicLayout>
            <PageTransition>
              <Suspense fallback={<PageLoader />}><Home /></Suspense>
            </PageTransition>
          </PublicLayout>
        } />

        {/* Protected pages */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Dashboard /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/forecast" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Forecast /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/travel" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Travel /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/itinerary" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Itinerary /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/compare" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Compare /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/aqi" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><AQI /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/alerts" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Alerts /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/agriculture" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Agriculture /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Events /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Community /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/time-machine" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><TimeMachine /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/flight-risk" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><FlightRisk /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/news" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><News /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Profile /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />
        <Route path="/badges" element={
          <ProtectedRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Badges /></Suspense>
              </PageTransition>
            </PublicLayout>
          </ProtectedRoute>
        } />

        {/* Admin */}
        <Route path="/admin" element={
          <AdminRoute>
            <PublicLayout>
              <PageTransition>
                <Suspense fallback={<PageLoader />}><Admin /></Suspense>
              </PageTransition>
            </PublicLayout>
          </AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

// ─── Root App ─────────────────────────────────────────────────
export default function App() {
  return (
    <AuthProvider>
      <WeatherProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </WeatherProvider>
    </AuthProvider>
  )
}
