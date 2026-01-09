import { useDroppable } from '@dnd-kit/core'
import { GameStatus } from '../../types'

interface TimelineLaneProps {
  id: GameStatus
  title: string
  color: string
  bgColor: string
  gameCount: number
  children: React.ReactNode
}

export function TimelineLane({ id, title, color, bgColor, gameCount, children }: TimelineLaneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg border-2 transition-all ${
        isOver
          ? 'border-blue-500 bg-blue-900/30'
          : 'border-gray-700 bg-gray-800/50'
      } ${bgColor}`}
    >
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${color}`}>{title}</h2>
        <span className="text-sm text-gray-400">{gameCount} game{gameCount !== 1 ? 's' : ''}</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )
}
