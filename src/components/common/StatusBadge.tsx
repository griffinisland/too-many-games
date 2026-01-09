import { GameStatus } from '../../types'

interface StatusBadgeProps {
  status: GameStatus
  className?: string
}

const statusColors: Record<GameStatus, string> = {
  backlog: 'bg-gray-600 text-gray-100',
  playing: 'bg-green-600 text-white',
  paused: 'bg-yellow-600 text-white',
  completed: 'bg-blue-600 text-white',
  dropped: 'bg-red-600 text-white',
  wishlist: 'bg-purple-600 text-white',
  replaying: 'bg-indigo-600 text-white'
}

const statusLabels: Record<GameStatus, string> = {
  backlog: 'Backlog',
  playing: 'Playing',
  paused: 'Paused',
  completed: 'Completed',
  dropped: 'Dropped',
  wishlist: 'Wishlist',
  replaying: 'Replaying'
}

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  return (
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColors[status]} ${className}`}>
      {statusLabels[status]}
    </span>
  )
}
