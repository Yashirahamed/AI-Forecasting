import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axiosInstance from '@/api/axiosInstance'
import { useAuth } from '@/context/AuthContext'
import { useWeather } from '@/context/WeatherContext'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function FloatingChat() {
  const { user } = useAuth()
  const { city, currentWeather } = useWeather()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: `Hello! I'm Nexus AI. Ask me anything about the weather in ${city}, outfit suggestions, or travel planning! 🌤️` }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    
    // Add user message to UI
    const updatedMessages: Message[] = [...messages, { role: 'user', content: userMsg }]
    setMessages(updatedMessages)
    setLoading(true)

    try {
      // Build context
      const chatContext = {
        messages: updatedMessages.slice(-10), // Send last 10
        userCity: city,
        currentWeather: currentWeather ? {
          temp: currentWeather.temperature,
          desc: currentWeather.description,
          humidity: currentWeather.humidity,
          wind: currentWeather.windSpeed
        } : null
      }

      const res = await axiosInstance.post('/ai/chat', chatContext)
      const reply = res.data?.data?.result ?? "I'm having trouble connecting to the weather intelligence grid right now."

      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Network anomaly detected. Nexus connection interrupted." }])
    } finally {
      setLoading(false)
    }
  }

  // Render floating button if authenticated
  if (!user) return null

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 select-none">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 rounded-full btn-primary flex items-center justify-center relative shadow-2xl focus:outline-none cursor-pointer"
        >
          {/* Animated pulse rings */}
          <span className="absolute -inset-1 rounded-full border border-sky-400/30 animate-ping opacity-75" />
          <span className="absolute -inset-2 rounded-full border border-purple/20 animate-pulse" />
          <span className="text-2xl">🤖</span>
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-24 right-6 w-[400px] h-[550px] max-w-[calc(100vw-2rem)] glass rounded-3xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/10 flex flex-col z-50 select-none"
          >
            {/* Header */}
            <div className="glass-dark border-b border-white/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald animate-pulse" />
                <h3 className="font-bold text-white tracking-wide text-sm">Nexus AI</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/40 hover:text-white text-xs font-semibold px-2.5 py-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
              {messages.map((m, idx) => (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-4 max-w-[80%] rounded-2xl text-xs font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-[#38bdf8]/15 border border-[#38bdf8]/20 text-white rounded-tr-none'
                      : 'bg-[#a78bfa]/10 border border-[#a78bfa]/25 text-white/90 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#a78bfa]/10 border border-[#a78bfa]/25 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#a78bfa] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#a78bfa] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-[#a78bfa] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input footer */}
            <form onSubmit={handleSend} className="glass-dark border-t border-white/5 p-4 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about weather, travel options..."
                className="flex-1 input-glass py-2 px-4 text-xs"
                disabled={loading}
              />
              <button 
                type="submit" 
                disabled={loading || !input.trim()}
                className="btn-primary py-2 px-4 text-xs font-semibold"
              >
                Send
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
