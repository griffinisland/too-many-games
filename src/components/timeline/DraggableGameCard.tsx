import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { GameWithUserData } from '../../hooks/useGames'
import { TimelineGameTile } from './TimelineGameTile'

interface DraggableGameCardProps {
  gameWithUserData: GameWithUserData
  isDragging?: boolean
}

export function DraggableGameCard({ gameWithUserData, isDragging }: DraggableGameCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging: isDragActive,
  } = useDraggable({ id: gameWithUserData.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    // Hide the original element while dragging so only the DragOverlay is visible
    // (prevents clipping inside overflow containers and removes "snap back" confusion)
    opacity: isDragActive ? 0 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-shrink-0 cursor-grab active:cursor-grabbing"
    >
      <TimelineGameTile gameWithUserData={gameWithUserData} disableNavigation={isDragActive || isDragging} />
    </div>
  )
}
