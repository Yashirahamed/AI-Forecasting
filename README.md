# WeatherCast AI ☁️🤖

**Startup-grade AI-powered weather intelligence and smart travel platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🌟 Features

| Feature | Description |
|---|---|
| 🌤️ **Real-Time Weather** | Current conditions + 7-day forecast via OpenWeatherMap |
| 🤖 **Nexus Oracle AI** | Groq Llama 3 chatbot for weather questions |
| ✈️ **Smart Itinerary** | AI-generated weather-aware travel plans |
| 🌿 **Air Quality Index** | Real-time AQI with health tips |
| 🚨 **Disaster Alerts** | Storm/flood/heatwave alerts with AI safety checklists |
| 👔 **Outfit Suggester** | Weather-appropriate fashion tips |
| 😴 **Sleep Predictor** | Sleep quality score based on weather |
| 🌾 **Agriculture AI** | Crop-specific farming advice |
| 📦 **Packing Lists** | AI-generated trip packing lists |
| ✈️ **Flight Risk** | Weather-based flight safety analysis |
| 📰 **Weather News** | Curated AI-summarized weather news |
| 👥 **Community Reports** | Crowdsourced local weather reports |
| 🏅 **Gamification** | Badges and eco-scores |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** (strict mode)
- **Tailwind CSS v4** — glassmorphic design system
- **Framer Motion** — page transitions + animations
- **Recharts** — forecast charts
- **Leaflet + React-Leaflet** — interactive weather maps
- **Three.js + React Three Fiber** — 3D weather visuals
- **React Router v6** — 19-page routing
- **i18next** — EN, Tamil, Hindi, Telugu, Kannada

### Backend (Vercel Serverless)
- **Node.js + Express** — API routes in `/backend/api/`
- **Firebase Admin SDK** — ID token verification
- **Supabase** (PostgreSQL) — all data storage + Realtime
- **Cloudinary** — media storage (avatars, PDFs, photos)
- **Groq Llama 3** (`llama3-8b-8192`) — all AI features
- **Nodemailer** — weather alert emails
- **Vercel Cron Jobs** — scheduled monitoring

### ML Microservice (Render)
- **FastAPI** + **TensorFlow/Keras** (LSTM forecasting)
- **Scikit-learn** (Isolation Forest anomaly detection)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+ (for ML service)

### 1. Clone & Install
```bash
git clone <your-repo>
cd weathercast-ai
npm run install:all
```

### 2. Configure Environment
```bash
cp .env.example .env
# Fill in all variables in .env
```

### 3. Run Supabase Migrations
> Go to Supabase → SQL Editor → paste `supabase_migrations.sql`

### 4. Start Development
```bash
# Start both frontend + backend
npm run dev:all

# Or individually:
npm run dev:frontend   # → http://localhost:5173
npm run dev:backend    # → http://localhost:3001

# ML service (requires Python venv):
cd ml-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🔑 Console Setup

### Firebase (console.firebase.google.com)
1. Create project: **weathercast-ai**
2. Enable **Authentication** → Email/Password + Google
3. Project Settings → Service Accounts → **Generate private key**
4. Add web app → copy config values to `.env`

### Supabase (supabase.com)
1. Create project: **weathercast-ai** (Singapore region)
2. SQL Editor → run `supabase_migrations.sql`
3. Authentication → **Disable** Supabase Auth (using Firebase)
4. Realtime → Enable for **alerts** table
5. Settings → API → copy URL + keys to `.env`

### Cloudinary (cloudinary.com)
1. Create free account
2. Settings → Upload Presets → Add **unsigned** preset: `weathercast_uploads`
3. Create folders: `avatars/`, `itineraries/`, `community/`, `badges/`

### Vercel (vercel.com)
1. Import repo
2. Add all `.env` variables in Dashboard → Settings → Environment Variables
3. Build command: `cd frontend && npm run build`
4. Output directory: `frontend/dist`

---

## 📁 Project Structure

```
weathercast-ai/
├── frontend/          # React + TypeScript + Tailwind
│   └── src/
│       ├── api/       # Axios + API helpers
│       ├── components/ # UI components
│       ├── context/   # Auth + Weather context
│       ├── firebase/  # Firebase Auth init
│       ├── hooks/     # Custom React hooks
│       ├── locales/   # 5 language JSON files
│       ├── pages/     # 19 page components
│       ├── supabase/  # Supabase client
│       ├── types/     # TypeScript interfaces
│       └── utils/     # Helpers
├── backend/           # Node.js + Express serverless
│   ├── api/          # Route handlers
│   ├── lib/          # Firebase, Supabase, Groq, etc.
│   └── middleware/   # Auth + Admin middleware
├── ml-service/        # FastAPI + TensorFlow
│   ├── routers/      # Forecast + Anomaly routes
│   └── services/     # LSTM + Isolation Forest
├── supabase_migrations.sql
├── vercel.json
└── .env.example
```

---

## 📄 License

MIT © 2026 WeatherCast AI
