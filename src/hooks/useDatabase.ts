import { useEffect, useState } from 'react'
import { initializeDatabase } from '../services/database'

export function useDatabase() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    initializeDatabase()
      .then(() => setIsInitialized(true))
      .catch(err => {
        setError(err)
        setIsInitialized(true) // Still set to true to prevent infinite loading
      })
  }, [])

  return { isInitialized, error }
}
