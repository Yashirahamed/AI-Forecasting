import { Request, Response } from 'express'
import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export default async function handler(req: Request, res: Response): Promise<Response> {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { weatherPreference, month, tripType } = req.body as {
    weatherPreference?: string
    month?: string
    tripType?: string
  }

  if (!weatherPreference || !month || !tripType) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  try {
    const prompt = `
You are a travel expert AI. A user wants to travel with these preferences:
- Weather preference: ${weatherPreference}
- Travel month: ${month}  
- Trip type: ${tripType}

Recommend exactly 6 destinations worldwide. For each destination return 
a JSON array with these exact fields:
[{
  "city": "City Name",
  "country": "Country",
  "temp": "24°C",
  "condition": "Sunny",
  "tripType": "Adventure",
  "bestMonths": "Nov - Apr",
  "description": "2 sentence description",
  "highlights": ["highlight1", "highlight2", "highlight3"],
  "aiScore": 95
}]

Return ONLY the JSON array. No extra text.`

    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7,
    })

    const text = completion.choices[0].message.content || '[]'
    const clean = text.replace(/```json|```/g, '').trim()
    const destinations = JSON.parse(clean)

    return res.status(200).json({ destinations })
  } catch (error) {
    console.error('Groq travel error:', error)
    return res.status(500).json({ 
      error: 'AI service failed',
      destinations: [] 
    })
  }
}
