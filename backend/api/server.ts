import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'
import path from 'path'

// ─── Load env variables ───────────────────────────────────────
dotenv.config({ path: path.join(__dirname, '../../.env') })

import { authMiddleware } from '../middleware/authMiddleware'
import { adminMiddleware } from '../middleware/adminMiddleware'
import { errorHandler } from '../utils/errorHandler'

// ─── Route handlers ───────────────────────────────────────────
import weatherHandler from './weather/[city]'
import forecastHandler from './forecast/[city]'
import aqiHandler from './aqi/[city]'
import chatHandler from './ai/chat'
import itineraryHandler from './ai/itinerary'
import moodHandler from './ai/mood'
import outfitHandler from './ai/outfit'
import sleepHandler from './ai/sleep'
import sportHandler from './ai/sport'
import foodHandler from './ai/food'
import agricultureHandler from './ai/agriculture'
import packingHandler from './ai/packing'
import flightHandler from './ai/flight'
import eventsHandler from './ai/events'
import alertsHandler from './alerts/index'
import newsHandler from './news/index'
import profileHandler from './profile/index'
import uploadSignHandler from './upload/sign'

const app = express()
const PORT = process.env.PORT ?? 3001

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', process.env.VERCEL_URL ?? ''].filter(Boolean),
  credentials: true,
}))
app.use(express.json({ limit: '2mb' }))

// ─── Rate limiting ────────────────────────────────────────────
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests, please try again later.',
})
app.use('/api/', apiLimiter)

const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: 'Too many AI requests. Please slow down.',
})

// ─── Weather Routes ───────────────────────────────────────────
app.get('/api/weather/:city', weatherHandler)
app.get('/api/forecast/:city', forecastHandler)
app.get('/api/aqi/:city', aqiHandler)

// ─── AI Routes (auth + rate limited) ─────────────────────────
app.post('/api/ai/chat', aiLimiter, authMiddleware, chatHandler)
app.post('/api/ai/itinerary', aiLimiter, authMiddleware, itineraryHandler)
app.post('/api/ai/mood', aiLimiter, moodHandler)
app.post('/api/ai/outfit', aiLimiter, moodHandler)
app.post('/api/ai/sleep', aiLimiter, sleepHandler)
app.post('/api/ai/sport', aiLimiter, sportHandler)
app.post('/api/ai/food', aiLimiter, foodHandler)
app.post('/api/ai/agriculture', aiLimiter, agricultureHandler)
app.post('/api/ai/packing', aiLimiter, packingHandler)
app.post('/api/ai/flight', aiLimiter, flightHandler)
app.post('/api/ai/events', aiLimiter, authMiddleware, eventsHandler)

// ─── Public Routes ────────────────────────────────────────────
app.all('/api/alerts', alertsHandler)
app.get('/api/news', newsHandler)

// ─── Auth-protected Routes ────────────────────────────────────
app.all('/api/profile', authMiddleware, profileHandler)
app.post('/api/upload/sign', authMiddleware, uploadSignHandler)

// ─── Error Handler ────────────────────────────────────────────
app.use(errorHandler)

// ─── Start server (only for local dev — Vercel handles prod) ──
app.listen(PORT, () => {
  console.log(`[WeatherCast Backend] Running on http://localhost:${PORT}`)
})

export default app
