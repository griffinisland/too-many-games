import { useState, useCallback } from 'react'
import { searchGames, getGameDetails } from '../services/rawgApi'
import { RAWGGame } from '../types'

export function useRawgApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const search = useCallback(async (query: string): Promise<RAWGGame[]> => {
    setLoading(true)
    setError(null)
    try {
      const results = await searchGames(query)
      return results
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const getDetails = useCallback(async (gameId: number): Promise<RAWGGame> => {
    setLoading(true)
    setError(null)
    try {
      const game = await getGameDetails(gameId)
      return game
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    search,
    getDetails,
    loading,
    error
  }
}
