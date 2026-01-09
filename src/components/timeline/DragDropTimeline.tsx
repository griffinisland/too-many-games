import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState, useMemo } from 'react'
import { useGames } from '../../hooks/useGames'
import { useTimeline } from '../../hooks/useTimeline'
import { GameWithUserData } from '../../hooks/useGames'
import { GameStatus } from '../../types'
import { TimelineLane } from './TimelineLane'
import { DraggableGameCard } from './DraggableGameCard'
import { TimelineGameTile } from './TimelineGameTile'

interface TimelineLaneConfig {
  status: GameStatus
  title: string
  color: string
  bgColor: string
}

const LANES: TimelineLaneConfig[] = [
  { status: 'playing', title: 'Now Playing', color: 'text-green-400', bgColor: 'bg-green-900/20' },
  { status: 'backlog', title: 'Backlog', color: 'text-gray-400', bgColor: 'bg-gray-900/20' },
  { status: 'paused', title: 'Paused', color: 'text-yellow-400', bgColor: 'bg-yellow-900/20' }
]

export function DragDropTimeline() {
  const { getGamesByStatus, updateUserGame, loading, games, userGames } = useGames()
  const { createTimelineEvent } = useTimeline()
  const [activeId, setActiveId] = useState<number | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px of movement before drag starts
      },
    })
  )

  // Memoize games by status - recompute when games or userGames state changes
  const { playingGames, backlogGames, pausedGames } = useMemo(() => {
    const playing = getGamesByStatus('playing')
    const backlog = getGamesByStatus('backlog')
    const paused = getGamesByStatus('paused')
    return { playingGames: playing, backlogGames: backlog, pausedGames: paused }
  }, [getGamesByStatus, games, userGames])

  const gamesByLane: Record<GameStatus, GameWithUserData[]> = {
    playing: playingGames,
    backlog: backlogGames,
    paused: pausedGames,
    completed: [],
    dropped: [],
    wishlist: [],
    replaying: []
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveId(null)

    if (!over) return

    const gameId = active.id as number
    // Only lanes are droppable; if we ever get a non-string id here, ignore it.
    if (typeof over.id !== 'string') return
    const newStatus = over.id as GameStatus
    if (newStatus !== 'playing' && newStatus !== 'backlog' && newStatus !== 'paused') return

    // Find the game from current state
    const allGames = [...playingGames, ...backlogGames, ...pausedGames]
    const game = allGames.find(g => g.id === gameId)

    if (!game || !game.userGame) return

    const currentStatus = game.userGame.status

    // Only update if status changed
    if (currentStatus !== newStatus) {
      try {
        // Update the UserGame status immediately (this calls loadGames internally which updates state)
        await updateUserGame(game.userGame.id, { status: newStatus })
        
        // Create timeline event
        await createTimelineEvent(game.userGame.id, newStatus)
        
        // State update from updateUserGame will trigger re-render automatically
        // The useMemo will recompute games arrays with fresh data
      } catch (error) {
        console.error('Error updating game status:', error)
      }
    }
  }

  const activeGame = activeId
    ? [...playingGames, ...backlogGames, ...pausedGames].find(g => g.id === activeId)
    : null

  if (loading) {
    return <div className="text-center py-12">Loading timeline...</div>
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-6">
        {LANES.map((lane) => {
          const laneGames = gamesByLane[lane.status]

          return (
            <TimelineLane
              key={lane.status}
              id={lane.status}
              title={lane.title}
              color={lane.color}
              bgColor={lane.bgColor}
              gameCount={laneGames.length}
            >
              <div className="flex gap-4 overflow-x-auto pb-2 min-h-[200px]">
                {laneGames.map(game => (
                  <DraggableGameCard key={game.id} gameWithUserData={game} />
                ))}
                {laneGames.length === 0 && (
                  <div className="flex items-center justify-center w-full text-gray-500 text-sm">
                    No games in {lane.title.toLowerCase()}
                  </div>
                )}
              </div>
            </TimelineLane>
          )
        })}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeGame ? (
          <div className="pointer-events-none w-32 opacity-95 rotate-2">
            <TimelineGameTile gameWithUserData={activeGame} disableNavigation />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
