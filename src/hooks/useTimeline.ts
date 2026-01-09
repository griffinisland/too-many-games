import { useEffect, useState, useCallback } from 'react'
import { db } from '../services/database'
import { TimelineEvent, GameStatus, Game, UserGame } from '../types'

export interface TimelineLaneData {
  status: GameStatus
  events: TimelineEvent[]
  games: Array<{ game: Game; userGame: UserGame; event: TimelineEvent }>
  count: number
}

export function useTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    try {
      const eventsData = await db.timelineEvents.toArray()
      setEvents(eventsData)
    } catch (error) {
      console.error('Error loading timeline events:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const createTimelineEvent = useCallback(async (
    userGameId: string,
    status: GameStatus
  ): Promise<TimelineEvent> => {
    // Close any active event for this userGame
    const allUserGameEvents = await db.timelineEvents
      .where('userGameId')
      .equals(userGameId)
      .toArray()

    for (const event of allUserGameEvents) {
      if (event.endDate === null) {
        await db.timelineEvents.update(event.id, {
          endDate: new Date()
        })
      }
    }

    // Create new event
    const event: TimelineEvent = {
      id: crypto.randomUUID(),
      userGameId,
      status,
      startDate: new Date(),
      endDate: null,
      createdAt: new Date()
    }

    await db.timelineEvents.add(event)
    await loadEvents()
    return event
  }, [loadEvents])

  const getLanes = useCallback(async (): Promise<TimelineLaneData[]> => {
    const statuses: GameStatus[] = ['playing', 'paused', 'completed', 'dropped']
    const lanes: TimelineLaneData[] = []

    for (const status of statuses) {
      const statusEvents = events.filter(e => e.status === status)
      
      // Get games for these events
      const games: TimelineLaneData['games'] = []
      const userGames = await db.userGames.where('id').anyOf(statusEvents.map(e => e.userGameId)).toArray()
      const gameIds = [...new Set(userGames.map(ug => ug.gameId))]
      const gamesData = await db.games.where('id').anyOf(gameIds).toArray()
      
      const gameMap = new Map(gamesData.map(g => [g.id, g]))
      const userGameMap = new Map(userGames.map(ug => [ug.id, ug]))

      for (const event of statusEvents) {
        const userGame = userGameMap.get(event.userGameId)
        if (userGame) {
          const game = gameMap.get(userGame.gameId)
          if (game) {
            games.push({ game, userGame, event })
          }
        }
      }

      lanes.push({
        status,
        events: statusEvents,
        games,
        count: games.length
      })
    }

    return lanes
  }, [events])

  const getPlayingTimelineSpans = useCallback(async () => {
    const playingEvents = events.filter(e => e.status === 'playing' && e.endDate === null)
    const spans: Array<{ event: TimelineEvent; game: Game; userGame: UserGame }> = []

    for (const event of playingEvents) {
      const userGame = await db.userGames.get(event.userGameId)
      if (userGame) {
        const game = await db.games.get(userGame.gameId)
        if (game) {
          spans.push({ event, game, userGame })
        }
      }
    }

    return spans
  }, [events])

  return {
    events,
    loading,
    createTimelineEvent,
    getLanes,
    getPlayingTimelineSpans,
    refresh: loadEvents
  }
}
