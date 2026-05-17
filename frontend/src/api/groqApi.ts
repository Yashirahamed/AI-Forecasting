import axiosInstance from './axiosInstance'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

/**
 * Send a chat message to the AI backend (Groq Llama 3)
 */
export const sendChatMessage = (messages: ChatMessage[]) =>
  axiosInstance.post('/ai/chat', { messages })

/**
 * Generate a smart travel itinerary
 */
export const generateItinerary = (params: {
  destination: string
  startDate: string
  endDate: string
  tripType: string
  weatherSnapshot?: object
}) => axiosInstance.post('/ai/itinerary', params)

/**
 * Get mood + health tips based on current weather
 */
export const getMoodTips = (params: { city: string; weather: object }) =>
  axiosInstance.post('/ai/mood', params)

/**
 * Get outfit suggestions based on weather
 */
export const getOutfitSuggestions = (params: { city: string; weather: object }) =>
  axiosInstance.post('/ai/outfit', params)

/**
 * Get sleep quality prediction based on weather
 */
export const getSleepPrediction = (params: { city: string; weather: object }) =>
  axiosInstance.post('/ai/sleep', params)

/**
 * Get sport planning advice
 */
export const getSportPlanning = (params: { city: string; weather: object; sport: string }) =>
  axiosInstance.post('/ai/sport', params)

/**
 * Get food recommendations based on weather
 */
export const getFoodRecommendations = (params: { city: string; weather: object }) =>
  axiosInstance.post('/ai/food', params)

/**
 * Get agriculture tips based on weather
 */
export const getAgricultureTips = (params: { city: string; weather: object; cropType?: string }) =>
  axiosInstance.post('/ai/agriculture', params)

/**
 * Generate a packing list for a trip
 */
export const generatePackingList = (params: {
  destination: string
  tripType: string
  duration: number
  weather?: object
}) => axiosInstance.post('/ai/packing', params)

/**
 * Analyze flight risk for a route/date
 */
export const analyzeFlightRisk = (params: {
  origin: string
  destination: string
  date: string
}) => axiosInstance.post('/ai/flight', params)

/**
 * Generate an event weather report
 */
export const generateEventReport = (params: {
  eventName: string
  city: string
  eventDate: string
  eventType: string
}) => axiosInstance.post('/ai/events', params)
