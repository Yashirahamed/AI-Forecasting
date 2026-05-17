// ─────────────────────────────────────────────────────────────
// Groq AI Client — Llama 3 (llama3-8b-8192)
//
// SETUP:
//   1. console.groq.com → API Keys → Create new key
//   2. Add GROQ_API_KEY to .env
// ─────────────────────────────────────────────────────────────

import Groq from 'groq-sdk'

const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama3-8b-8192'

export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

/**
 * Ask Groq Llama 3 a question with system + user prompts.
 * Returns the AI text response.
 */
export const askGroq = async (
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1024,
  temperature = 0.7,
): Promise<string> => {
  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature,
  })

  return completion.choices[0]?.message?.content ?? 'No response generated.'
}
