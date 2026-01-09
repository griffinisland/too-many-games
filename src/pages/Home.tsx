import { useGames } from '../hooks/useGames'
import { GameCard } from '../components/game/GameCard'
import { Link } from 'react-router-dom'
import { TrendingUp, Library, Plus } from 'lucide-react'

export function Home() {
  const { getGamesByStatus, getGamesWithUserData, loading } = useGames()
  const playingGames = getGamesByStatus('playing')
  const allGames = getGamesWithUserData().filter(g => g.userGame?.owned !== false)

  // Calculate stats
  const stats = {
    total: allGames.length,
    playing: playingGames.length,
    completed: getGamesByStatus('completed').length,
    backlog: getGamesByStatus('backlog').length,
    rated: allGames.filter(g => g.userGame?.rating).length
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Now Playing</h1>

      {stats.total > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Games</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{stats.playing}</div>
            <div className="text-sm text-gray-400">Playing</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{stats.completed}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-gray-400">{stats.backlog}</div>
            <div className="text-sm text-gray-400">Backlog</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{stats.rated}</div>
            <div className="text-sm text-gray-400">Rated</div>
          </div>
        </div>
      )}

      {playingGames.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {playingGames.map(game => (
            <GameCard key={game.id} gameWithUserData={game} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-800 p-12 rounded-lg text-center">
          <p className="text-gray-400 mb-6">No games currently being played.</p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              <Library size={18} />
              Browse Library
            </Link>
            <Link
              to="/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              <Plus size={18} />
              Add Game
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 flex gap-4">
        <Link
          to="/timeline"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          <TrendingUp size={18} />
          View Timeline
        </Link>
      </div>
    </div>
  )
}
