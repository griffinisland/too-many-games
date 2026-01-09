import { useState, useMemo } from 'react'
import { useGames } from '../hooks/useGames'
import { GameCard } from '../components/game/GameCard'
import { GameStatus } from '../types'
import { Search, Filter } from 'lucide-react'

export function Library() {
  const { getGamesWithUserData, loading } = useGames()
  const [statusFilter, setStatusFilter] = useState<GameStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [tagFilter, setTagFilter] = useState<string>('')

  const games = useMemo(() => {
    let filtered = getGamesWithUserData().filter(game => game.userGame?.owned !== false)

    if (statusFilter !== 'all') {
      filtered = filtered.filter(game => game.userGame?.status === statusFilter)
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.genres.some(g => g.toLowerCase().includes(query))
      )
    }

    if (tagFilter.trim()) {
      const tag = tagFilter.toLowerCase()
      filtered = filtered.filter(game =>
        game.userGame?.tags.some(t => t.toLowerCase().includes(tag))
      )
    }

    return filtered.sort((a, b) => {
      const aUpdated = a.userGame?.updatedAt || a.userGame?.createdAt || new Date(0)
      const bUpdated = b.userGame?.updatedAt || b.userGame?.createdAt || new Date(0)
      return bUpdated.getTime() - aUpdated.getTime()
    })
  }, [getGamesWithUserData, statusFilter, searchQuery, tagFilter])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Library</h1>

      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title or genre..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as GameStatus | 'all')}
              className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="backlog">Backlog</option>
              <option value="playing">Playing</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="dropped">Dropped</option>
              <option value="wishlist">Wishlist</option>
              <option value="replaying">Replaying</option>
            </select>
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            placeholder="Filter by tag..."
            className="w-full md:w-64 pl-4 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
      </div>

      {games.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          {statusFilter !== 'all' || searchQuery || tagFilter
            ? 'No games match your filters.'
            : 'Your library is empty. Add some games to get started!'}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {games.map(game => (
            <GameCard key={game.id} gameWithUserData={game} />
          ))}
        </div>
      )}

      <div className="mt-6 text-sm text-gray-400">
        Showing {games.length} game{games.length !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
