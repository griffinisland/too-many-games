import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { db } from '../services/database'
import { Game, UserGame, GameStatus, TimelineEvent } from '../types'
import { useGames } from '../hooks/useGames'
import { useTimeline } from '../hooks/useTimeline'
import { CoverImage } from '../components/common/CoverImage'
import { StatusSelector } from '../components/game/StatusSelector'
import { RatingInput } from '../components/game/RatingInput'
import { TagInput } from '../components/game/TagInput'
import { StatusBadge } from '../components/common/StatusBadge'
import { formatDate } from '../utils/dateHelpers'
import { Upload, Trash2, ArrowLeft } from 'lucide-react'

export function GameDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { updateUserGame, deleteUserGame } = useGames()
  const { createTimelineEvent } = useTimeline()
  const [game, setGame] = useState<Game | null>(null)
  const [userGame, setUserGame] = useState<UserGame | null>(null)
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGameData()
  }, [id])

  async function loadGameData() {
    if (!id) return

    try {
      const gameId = parseInt(id)
      const [gameData, userGameData] = await Promise.all([
        db.games.get(gameId),
        db.userGames.where('gameId').equals(gameId).first()
      ])

      if (!gameData) {
        navigate('/library')
        return
      }

      setGame(gameData)
      setUserGame(userGameData || null)

      if (userGameData) {
        const events = await db.timelineEvents
          .where('userGameId')
          .equals(userGameData.id)
          .toArray()
        setTimelineEvents(events.sort((a, b) => a.startDate.getTime() - b.startDate.getTime()))
      }
    } catch (error) {
      console.error('Error loading game:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: GameStatus) => {
    if (!userGame) return

    await updateUserGame(userGame.id, { status: newStatus })
    await createTimelineEvent(userGame.id, newStatus)
    
    const updated = await db.userGames.get(userGame.id)
    setUserGame(updated || null)
    await loadGameData()
  }

  const handleRatingChange = async (rating: number | null) => {
    if (!userGame) return
    await updateUserGame(userGame.id, { rating })
    const updated = await db.userGames.get(userGame.id)
    setUserGame(updated || null)
  }

  const handleTagsChange = async (tags: string[]) => {
    if (!userGame) return
    await updateUserGame(userGame.id, { tags })
    const updated = await db.userGames.get(userGame.id)
    setUserGame(updated || null)
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userGame || !e.target.files?.[0]) return

    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = async () => {
      const base64String = reader.result as string
      await updateUserGame(userGame.id, { customCoverImage: base64String })
      const updated = await db.userGames.get(userGame.id)
      setUserGame(updated || null)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveCover = async () => {
    if (!userGame) return
    await updateUserGame(userGame.id, { customCoverImage: null })
    const updated = await db.userGames.get(userGame.id)
    setUserGame(updated || null)
  }

  const handleDelete = async () => {
    if (!userGame) return
    if (confirm('Are you sure you want to remove this game from your collection?')) {
      await deleteUserGame(userGame.id)
      navigate('/library')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!game) {
    return <div className="text-center py-12">Game not found</div>
  }

  return (
    <div>
      <button
        onClick={() => navigate('/library')}
        className="flex items-center gap-2 text-gray-400 hover:text-white mb-6"
      >
        <ArrowLeft size={20} />
        Back to Library
      </button>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <CoverImage game={game} userGame={userGame || undefined} size="lg" />
          {userGame && (
            <div className="mt-4 space-y-2">
              <label className="block">
                <span className="text-sm text-gray-400 mb-2 block">Custom Cover Art</span>
                <div className="flex gap-2">
                  <label className="flex-1 cursor-pointer">
                    <div className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-center text-sm flex items-center justify-center gap-2">
                      <Upload size={16} />
                      Upload
                    </div>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleCoverUpload}
                      className="hidden"
                    />
                  </label>
                  {userGame.customCoverImage && (
                    <button
                      onClick={handleRemoveCover}
                      className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm flex items-center gap-2"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  )}
                </div>
              </label>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-4">{game.title}</h1>

          {userGame && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                <StatusSelector
                  value={userGame.status}
                  onChange={handleStatusChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Rating</label>
                <RatingInput
                  value={userGame.rating}
                  onChange={handleRatingChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <TagInput
                  value={userGame.tags}
                  onChange={handleTagsChange}
                />
              </div>

              <div>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Remove from Collection
                </button>
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Game Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {game.releaseDate && (
                <div>
                  <span className="text-gray-400">Release Date:</span>
                  <span className="ml-2 text-white">{formatDate(game.releaseDate)}</span>
                </div>
              )}
              {game.developer && (
                <div>
                  <span className="text-gray-400">Developer:</span>
                  <span className="ml-2 text-white">{game.developer}</span>
                </div>
              )}
              {game.publisher && (
                <div>
                  <span className="text-gray-400">Publisher:</span>
                  <span className="ml-2 text-white">{game.publisher}</span>
                </div>
              )}
              {game.platforms.length > 0 && (
                <div>
                  <span className="text-gray-400">Platforms:</span>
                  <span className="ml-2 text-white">{game.platforms.join(', ')}</span>
                </div>
              )}
              {game.genres.length > 0 && (
                <div>
                  <span className="text-gray-400">Genres:</span>
                  <span className="ml-2 text-white">{game.genres.join(', ')}</span>
                </div>
              )}
              {game.playtimeEstimate && (
                <div>
                  <span className="text-gray-400">Playtime:</span>
                  <span className="ml-2 text-white">{game.playtimeEstimate} hours</span>
                </div>
              )}
            </div>
          </div>

          {timelineEvents.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">Status History</h2>
              <div className="space-y-2">
                {timelineEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-3 text-sm">
                    <StatusBadge status={event.status} />
                    <span className="text-gray-400">
                      {formatDate(event.startDate)}
                      {event.endDate && ` → ${formatDate(event.endDate)}`}
                      {!event.endDate && ' → Present'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
