import { useEffect, useState, useCallback } from 'react'
import { db } from '../services/database'
import { Game, UserGame, GameStatus } from '../types'
import { RAWGGame } from '../types'

export interface GameWithUserData extends Game {
  userGame?: UserGame
}

export function useGames() {
  const [games, setGames] = useState<Game[]>([])
  const [userGames, setUserGames] = useState<UserGame[]>([])
  const [loading, setLoading] = useState(true)

  const loadGames = useCallback(async () => {
    try {
      const [gamesData, userGamesData] = await Promise.all([
        db.games.toArray(),
        db.userGames.toArray()
      ])
      setGames(gamesData)
      setUserGames(userGamesData)
    } catch (error) {
      console.error('Error loading games:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadGames()
  }, [loadGames])

  const addGame = useCallback(async (rawgGame: RAWGGame): Promise<Game> => {
    // Check if game already exists
    const existingGame = await db.games.get(rawgGame.id)
    if (existingGame) {
      // Check if user already has this game
      const existingUserGame = await db.userGames
        .where('gameId')
        .equals(rawgGame.id)
        .first()
      if (existingUserGame) {
        throw new Error('Game is already in your collection')
      }
      // Game exists but user doesn't have it, so create UserGame only
      const userGame: UserGame = {
        id: crypto.randomUUID(),
        userId: 'local-user',
        gameId: existingGame.id,
        owned: true,
        rating: null,
        status: 'backlog',
        tags: [],
        customCoverImage: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      await db.userGames.add(userGame)
      await loadGames()
      return existingGame
    }

    const game: Game = {
      id: rawgGame.id,
      title: rawgGame.name,
      coverImage: rawgGame.background_image || '',
      platforms: (rawgGame.platforms || []).map(p => p.platform.name),
      releaseDate: rawgGame.released || '',
      developer: rawgGame.developers?.[0]?.name || '',
      publisher: rawgGame.publishers?.[0]?.name || '',
      genres: (rawgGame.genres || []).map(g => g.name),
      franchise: null, // RAWG doesn't provide this directly
      playtimeEstimate: rawgGame.playtime || null,
      rawgDataSnapshot: rawgGame,
      createdAt: new Date()
    }

    await db.games.add(game)
    
    // Create UserGame entry
    const userGame: UserGame = {
      id: crypto.randomUUID(),
      userId: 'local-user',
      gameId: game.id,
      owned: true,
      rating: null,
      status: 'backlog',
      tags: [],
      customCoverImage: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    await db.userGames.add(userGame)
    
    await loadGames()
    return game
  }, [loadGames])

  const updateUserGame = useCallback(async (userGameId: string, updates: Partial<UserGame>) => {
    await db.userGames.update(userGameId, {
      ...updates,
      updatedAt: new Date()
    })
    await loadGames()
  }, [loadGames])

  const deleteUserGame = useCallback(async (userGameId: string) => {
    await db.userGames.delete(userGameId)
    // Optionally delete timeline events
    await db.timelineEvents.where('userGameId').equals(userGameId).delete()
    await loadGames()
  }, [loadGames])

  const getGamesWithUserData = useCallback((): GameWithUserData[] => {
    return games.map(game => {
      const userGame = userGames.find(ug => ug.gameId === game.id)
      return { ...game, userGame }
    })
  }, [games, userGames])

  const getGamesByStatus = useCallback((status: GameStatus): GameWithUserData[] => {
    return getGamesWithUserData().filter(game => game.userGame?.status === status)
  }, [getGamesWithUserData])

  return {
    games,
    userGames,
    loading,
    addGame,
    updateUserGame,
    deleteUserGame,
    getGamesWithUserData,
    getGamesByStatus,
    refresh: loadGames
  }
}
