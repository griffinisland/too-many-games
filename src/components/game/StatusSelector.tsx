import { GameStatus } from '../../types'

interface StatusSelectorProps {
  value: GameStatus
  onChange: (status: GameStatus) => void
  className?: string
}

const statuses: GameStatus[] = ['backlog', 'playing', 'paused', 'completed', 'dropped', 'wishlist', 'replaying']

const statusLabels: Record<GameStatus, string> = {
  backlog: 'Backlog',
  playing: 'Playing',
  paused: 'Paused',
  completed: 'Completed',
  dropped: 'Dropped',
  wishlist: 'Wishlist',
  replaying: 'Replaying'
}

export function StatusSelector({ value, onChange, className = '' }: StatusSelectorProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as GameStatus)}
      className={`bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    >
      {statuses.map(status => (
        <option key={status} value={status}>
          {statusLabels[status]}
        </option>
      ))}
    </select>
  )
}
