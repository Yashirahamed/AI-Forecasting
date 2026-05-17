import { useState, useCallback } from 'react'
import axiosInstance from '@/api/axiosInstance'

interface GroqOptions {
  endpoint: string
  body: Record<string, unknown>
}

/**
 * Hook for calling Groq AI endpoints
 */
export function useGroq() {
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const ask = useCallback(async ({ endpoint, body }: GroqOptions) => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await axiosInstance.post(endpoint, body)
      setResponse(data.result ?? data.message ?? JSON.stringify(data))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setResponse(null)
    setError(null)
  }, [])

  return { response, loading, error, ask, reset }
}
