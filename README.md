# WeatherCast AI

WeatherCast AI is a startup-grade AI-powered weather intelligence and smart travel platform.

## Features

1. **Real-time AI Weather Forecasting**: Instant weather updates for any city globally.
2. **AI Travel Recommendations**: Personalized travel suggestions based on upcoming weather patterns.
3. **Smart Lifestyle Tools**:
   - **Health**: Weather-based health advice.
   - **Food**: Recipe suggestions based on current temperature/mood.
   - **Sleep**: Sleep quality predictions.
   - **Sports**: Best times for outdoor activities.
   - **Farming**: Precision agriculture weather insights.
4. **Interactive Weather Maps**: Leaflet-based maps showing precipitation, clouds, and temperature.
5. **AQI Monitoring**: Real-time Air Quality Index.
6. **AI ChatBot**: Llama 3 powered assistant.
7. **Nexus Oracle**: Deep AI analysis for climate trends.
8. **Itinerary Planner**: Automated travel itinerary generation.
9. **Seasonal Calendar**: Best times to visit specific regions.
10. **Mood Widget**: Weather-influenced mood tracking.
11. **Outfit Suggester**: Smart clothing recommendations.
12. **Alert Banner**: Critical weather alerts.
13. **Disaster Alert**: Emergency notifications.
14. **EcoScore**: Gamified environmental impact tracking.
15. **Badge Collection**: Rewards for reporting weather.
16. **Leaderboard**: Community competition.
17. **Community Reports**: User-submitted weather reports.
18. **Report Map**: Visualization of community-reported events.
19. **Admin Dashboard**: Real-time analytics and user management.
20. **City Heatmap**: Visualization of popular searched cities.
21. **Time Machine**: Historical weather data exploration.
22. **Flight Risk**: AI-powered flight assessment.
23. **Weather News**: Real-time news feed.
24. **Multi-language Support**: English, Tamil, Hindi, Telugu, Kannada.
25. **PWA Support**: Offline capability.
26. **PDF/Image Export**: Export forecasts and itineraries.

## Firebase Setup Instructions

1. Go to [Firebase Console](https://console.firebase.google.com).
2. Create project: "weathercast-ai".
3. Enable Authentication: Email/Password and Google.
4. Create Firestore Database: Region `asia-south1` (Mumbai).
5. Create collections: `users`, `alerts`, `chatHistory`, `itineraries`, `packingLists`, `communityReports`, `badges`, `ecoScores`, `savedArticles`, `eventPlans`, `weatherCache`, `newsCache`.
6. Enable Storage and Cloud Messaging.
7. Download `serviceAccountKey.json` and place it in `backend/`.
8. Copy Firebase config to `.env` as `VITE_FIREBASE_*`.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Leaflet, Three.js.
- **Backend**: Node.js, Express, Firebase Admin SDK, Socket.io.
- **AI**: Groq Llama 3, OpenWeatherMap, NewsAPI.
- **ML Service**: FastAPI, TensorFlow, Scikit-learn.

## Setup

1. `npm run install:all`
2. Configure `.env`
3. `npm run dev:all`
