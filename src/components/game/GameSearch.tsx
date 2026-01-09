import { useState, FormEvent } from 'react'
import { useRawgApi } from '../../hooks/useRawgApi'
import { RAWGGame } from '../../types'
import { Search, Loader2 } from 'lucide-react'

interface GameSearchProps {
  onGameSelect: (game: RAWGGame) => void
}

export function GameSearch({ onGameSelect }: GameSearchProps) {
  const { search, loading, error } = useRawgApi()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RAWGGame[]>([])

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    try {
      const searchResults = await search(query)
      setResults(searchResults)
    } catch (err) {
      // Error is handled by the hook
      setResults([])
    }
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for games..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Searching...
              </>
            ) : (
              'Search'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
          {error.message}
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map(game => (
            <div
              key={game.id}
              className="flex gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors"
              onClick={() => onGameSelect(game)}
            >
              {game.background_image && (
                <img
                  src={game.background_image}
                  alt={game.name}
                  className="w-24 h-32 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                {game.released && (
                  <p className="text-sm text-gray-400 mt-1">Released: {game.released}</p>
                )}
                {game.platforms.length > 0 && (
                  <p className="text-sm text-gray-400 mt-1">
                    {game.platforms.slice(0, 5).map(p => p.platform.name).join(', ')}
                  </p>
                )}
                {game.genres.length > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {game.genres.slice(0, 3).map(g => g.name).join(', ')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <div className="text-center py-12 text-gray-400">
          No games found. Try a different search term.
        </div>
      )}
    </div>
  )
}
