import { Link } from 'react-router-dom'
import { GameWithUserData } from '../../hooks/useGames'
import { CoverImage } from '../common/CoverImage'
import { StatusBadge } from '../common/StatusBadge'

interface GameCardProps {
  gameWithUserData: GameWithUserData
}

export function GameCard({ gameWithUserData }: GameCardProps) {
  const { userGame } = gameWithUserData
  const rating = userGame?.rating

  return (
    <Link to={`/game/${gameWithUserData.id}`} className="block group">
      <div className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-all hover:shadow-lg hover:shadow-blue-500/20 h-full flex flex-col">
        <div className="relative w-full">
          <CoverImage game={gameWithUserData} userGame={userGame} size="lg" />
          {userGame && (
            <div className="absolute top-2 right-2">
              <StatusBadge status={userGame.status} />
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
            {gameWithUserData.title}
          </h3>
          
          {rating && (
            <div className="mb-2">
              <span className="text-yellow-400 text-sm">
                {'★'.repeat(rating)}{'☆'.repeat(10 - rating)}
              </span>
            </div>
          )}
          
          {gameWithUserData.genres.length > 0 && (
            <div className="text-sm text-gray-400 mb-2 line-clamp-1">
              {gameWithUserData.genres.slice(0, 3).join(', ')}
            </div>
          )}
          
          {userGame && userGame.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {userGame.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs text-gray-500 bg-gray-700 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
