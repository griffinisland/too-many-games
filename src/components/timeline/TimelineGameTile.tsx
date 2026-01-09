import { Link } from 'react-router-dom'
import { GameWithUserData } from '../../hooks/useGames'
import { StatusBadge } from '../common/StatusBadge'

interface TimelineGameTileProps {
  gameWithUserData: GameWithUserData
  /** Used to prevent accidental navigation while dragging/overlaying */
  disableNavigation?: boolean
}

export function TimelineGameTile({ gameWithUserData, disableNavigation }: TimelineGameTileProps) {
  const { userGame } = gameWithUserData

  return (
    <Link
      to={`/game/${gameWithUserData.id}`}
      onClick={(e) => {
        if (disableNavigation) e.preventDefault()
      }}
      className="block"
    >
      <div className="w-32 bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors group">
        <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-800">
          {userGame?.customCoverImage || gameWithUserData.coverImage ? (
            <img
              src={userGame?.customCoverImage || gameWithUserData.coverImage}
              alt={gameWithUserData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src =
                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%239ca3af" x="50" y="50" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14"%3ENo Cover%3C/text%3E%3C/svg%3E'
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-sm">
              No Cover
            </div>
          )}
          {userGame && (
            <div className="absolute top-1 right-1">
              <StatusBadge status={userGame.status} />
            </div>
          )}
        </div>
        <div className="p-2">
          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
            {gameWithUserData.title}
          </h3>
        </div>
      </div>
    </Link>
  )
}

