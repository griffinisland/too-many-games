import { useGames } from '../../hooks/useGames'
import { GameStatus } from '../../types'

export function StatsDashboard() {
  const { getGamesWithUserData, getGamesByStatus } = useGames()
  const allGames = getGamesWithUserData().filter(g => g.userGame?.owned !== false)

  const statusCounts: Record<GameStatus, number> = {
    backlog: getGamesByStatus('backlog').length,
    playing: getGamesByStatus('playing').length,
    paused: getGamesByStatus('paused').length,
    completed: getGamesByStatus('completed').length,
    dropped: getGamesByStatus('dropped').length,
    wishlist: getGamesByStatus('wishlist').length,
    replaying: getGamesByStatus('replaying').length
  }

  const ratings = allGames
    .map(g => g.userGame?.rating)
    .filter((r): r is number => r !== null && r !== undefined)

  const ratingDistribution: Record<number, number> = {}
  for (let i = 1; i <= 10; i++) {
    ratingDistribution[i] = ratings.filter(r => r === i).length
  }

  const averageRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
    : null

  const totalPlaytime = allGames
    .map(g => g.playtimeEstimate)
    .filter((pt): pt is number => pt !== null && pt !== undefined)
    .reduce((sum, pt) => sum + pt, 0)

  const statusColors: Record<GameStatus, string> = {
    backlog: 'bg-gray-600',
    playing: 'bg-green-600',
    paused: 'bg-yellow-600',
    completed: 'bg-blue-600',
    dropped: 'bg-red-600',
    wishlist: 'bg-purple-600',
    replaying: 'bg-indigo-600'
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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-white mb-2">{allGames.length}</div>
          <div className="text-gray-400">Total Games</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-yellow-400 mb-2">
            {averageRating || '—'}
          </div>
          <div className="text-gray-400">Average Rating</div>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {totalPlaytime > 0 ? `${totalPlaytime.toFixed(0)}h` : '—'}
          </div>
          <div className="text-gray-400">Estimated Playtime</div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Status Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(statusCounts).map(([status, count]) => {
            const percentage = allGames.length > 0
              ? ((count / allGames.length) * 100).toFixed(1)
              : '0'
            
            return (
              <div key={status}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-300">{statusLabels[status as GameStatus]}</span>
                  <span className="text-gray-400 text-sm">{count} ({percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${statusColors[status as GameStatus]}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {ratings.length > 0 && (
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Rating Distribution</h2>
          <div className="space-y-2">
            {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating] || 0
              const maxCount = Math.max(...Object.values(ratingDistribution))
              const width = maxCount > 0 ? (count / maxCount) * 100 : 0

              return (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-gray-300 w-8">{rating}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div
                      className="bg-yellow-400 h-4 rounded-full"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <span className="text-gray-400 text-sm w-8 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
