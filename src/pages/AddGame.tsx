import { useNavigate } from 'react-router-dom'
import { useGames } from '../hooks/useGames'
import { GameSearch } from '../components/game/GameSearch'
import { RAWGGame } from '../types'
import { CheckCircle2 } from 'lucide-react'

export function AddGame() {
  const navigate = useNavigate()
  const { addGame } = useGames()

  const handleGameSelect = async (rawgGame: RAWGGame) => {
    try {
      await addGame(rawgGame)
      navigate(`/game/${rawgGame.id}`)
    } catch (error) {
      console.error('Error adding game:', error)
      const message = error instanceof Error ? error.message : 'Failed to add game'
      alert(message)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Add Game</h1>
      <div className="mb-4 p-4 bg-blue-900/30 border border-blue-700 rounded-lg text-blue-200 text-sm">
        <CheckCircle2 className="inline-block mr-2" size={16} />
        Search for games using the RAWG API. Games are added to your collection with "Backlog" status.
      </div>
      <GameSearch onGameSelect={handleGameSelect} />
    </div>
  )
}
