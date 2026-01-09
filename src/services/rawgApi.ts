import { RAWGGame, RAWGSearchResponse } from '../types'

const API_KEY = import.meta.env.VITE_RAWG_API_KEY
const BASE_URL = 'https://api.rawg.io/api'

export async function searchGames(query: string): Promise<RAWGGame[]> {
  if (!API_KEY) {
    throw new Error('RAWG API key not configured. Please set VITE_RAWG_API_KEY in your .env file.')
  }

  if (!navigator.onLine) {
    throw new Error('You are currently offline. Please connect to the internet to search for games.')
  }

  const url = new URL(`${BASE_URL}/games`)
  url.searchParams.append('key', API_KEY)
  url.searchParams.append('search', query)
  url.searchParams.append('page_size', '20')

  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status} ${response.statusText}`)
  }

  const data: RAWGSearchResponse = await response.json()
  return data.results
}

export async function getGameDetails(gameId: number): Promise<RAWGGame> {
  if (!API_KEY) {
    throw new Error('RAWG API key not configured.')
  }

  if (!navigator.onLine) {
    throw new Error('You are currently offline.')
  }

  const url = new URL(`${BASE_URL}/games/${gameId}`)
  url.searchParams.append('key', API_KEY)

  const response = await fetch(url.toString())
  
  if (!response.ok) {
    throw new Error(`RAWG API error: ${response.status} ${response.statusText}`)
  }

  return await response.json()
}
