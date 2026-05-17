import { useState, useCallback } from 'react'
import { supabase } from '@/supabase/supabaseClient'

/**
 * Generic Supabase query hook
 * Usage: const { data, loading, error, execute } = useSupabase<MyType[]>()
 */
export function useSupabase<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (query: () => ReturnType<typeof supabase.from>) => {
      setLoading(true)
      setError(null)
      try {
        const { data: result, error: sbError } = await (query() as unknown as Promise<{ data: T; error: { message: string } | null }>)
        if (sbError) throw new Error(sbError.message)
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  return { data, loading, error, execute, supabase }
}
