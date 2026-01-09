import { Game, UserGame } from '../../types'

interface CoverImageProps {
  game: Game
  userGame?: UserGame
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'w-24 h-32',
  md: 'w-32 h-44',
  lg: 'w-full h-72' // Fixed height: 288px (18rem)
}

export function CoverImage({ game, userGame, className = '', size = 'md' }: CoverImageProps) {
  const imageUrl = userGame?.customCoverImage || game.coverImage
  const sizeClass = className.includes('h-') && className.includes('w-') ? className : sizeClasses[size]

  return (
    <div className={`${sizeClass} ${!className.includes('h-') && !className.includes('w-') ? className : ''} relative overflow-hidden bg-gray-800 flex-shrink-0 rounded-lg`}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={game.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a placeholder on error
            const target = e.target as HTMLImageElement
            target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23374151" width="100" height="100"/%3E%3Ctext fill="%239ca3af" x="50" y="50" text-anchor="middle" dy=".3em" font-family="sans-serif" font-size="14"%3ENo Cover%3C/text%3E%3C/svg%3E'
          }}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-sm">
          No Cover
        </div>
      )}
    </div>
  )
}
