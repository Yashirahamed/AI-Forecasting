import { Request, Response } from 'express'
import { askGroq } from '../../lib/groqClient'
import { supabaseAdmin } from '../../lib/supabaseAdmin'
import { AuthenticatedRequest } from '../../middleware/authMiddleware'
import { sendSuccess, sendError } from '../../utils/apiResponse'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// ─── POST /api/ai/chat ────────────────────────────────────────
export default async function handler(req: AuthenticatedRequest & Request, res: Response): Promise<void> {
  if (req.method !== 'POST') {
    sendError(res, 'Method not allowed', 405)
    return
  }

  const { messages } = req.body as { messages: ChatMessage[] }
  if (!messages?.length) {
    sendError(res, 'Messages array is required', 400)
    return
  }

  const systemPrompt = `You are Nexus Oracle, the AI assistant for WeatherCast AI — an advanced weather intelligence platform. 
You specialize in weather, climate, travel planning, outdoor activities, agriculture, health tips based on weather, and disaster safety.
Be helpful, concise, and personable. Format responses clearly. Always consider weather context when giving advice.
Do NOT answer questions unrelated to weather, climate, travel, lifestyle, or the WeatherCast platform.`

  try {
    const lastUserMessage = messages.filter((m) => m.role === 'user').pop()?.content ?? ''
    
    // Build conversation context from last 6 messages
    const context = messages.slice(-6)
    const userPrompt = context
      .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
      .join('\n')

    const result = await askGroq(systemPrompt, userPrompt, 1024, 0.7)

    // Save to chat history in Supabase if authenticated
    if (req.user?.uid) {
      await supabaseAdmin.from('chat_history').insert([
        { user_id: req.user.uid, role: 'user', content: lastUserMessage },
        { user_id: req.user.uid, role: 'assistant', content: result },
      ])
    }

    sendSuccess(res, { result })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'AI chat failed'
    sendError(res, message, 500)
  }
}
