import { useState, useRef } from 'react'
import { downloadExport, importFromFile } from '../services/exportImport'
import { Download, Upload, AlertCircle, CheckCircle2, Trash2, RefreshCw } from 'lucide-react'
import { db } from '../services/database'
import { TimelineEvent, GameStatus } from '../types'

export function Settings() {
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [deleteGameId, setDeleteGameId] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    try {
      await downloadExport()
      setImportStatus({ type: 'success', message: 'Data exported successfully!' })
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to export data'
      })
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await importFromFile(file)
      setImportStatus({ type: 'success', message: 'Data imported successfully!' })
      // Reload page to reflect changes
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to import data'
      })
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDeleteGame = async () => {
    if (!deleteGameId.trim()) {
      setImportStatus({ type: 'error', message: 'Please enter a game ID' })
      return
    }

    const gameId = parseInt(deleteGameId.trim())
    if (isNaN(gameId)) {
      setImportStatus({ type: 'error', message: 'Invalid game ID. Please enter a number.' })
      return
    }

    if (!confirm(`Are you sure you want to delete game ID ${gameId}? This will remove the game and all associated data.`)) {
      return
    }

    try {
      // Find and delete UserGame entries
      const userGames = await db.userGames.where('gameId').equals(gameId).toArray()
      for (const userGame of userGames) {
        // Delete timeline events
        await db.timelineEvents.where('userGameId').equals(userGame.id).delete()
        // Delete UserGame
        await db.userGames.delete(userGame.id)
      }

      // Delete the Game entry
      await db.games.delete(gameId)

      setImportStatus({ type: 'success', message: `Game ID ${gameId} deleted successfully!` })
      setDeleteGameId('')
      
      // Reload page to reflect changes
      setTimeout(() => window.location.reload(), 1000)
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to delete game'
      })
    }
  }

  const handleResetTimeline = async () => {
    if (!confirm('Are you sure you want to reset the timeline? This will clear all existing timeline events and rebuild them from current game statuses. This cannot be undone.')) {
      return
    }

    try {
      setImportStatus({ type: 'success', message: 'Resetting timeline...' })

      // Delete all existing timeline events
      await db.timelineEvents.clear()

      // Get all UserGame entries
      const userGames = await db.userGames.toArray()

      // Create new timeline events for each UserGame based on current status
      const now = new Date()
      const trackedStatuses: GameStatus[] = ['playing', 'paused', 'backlog', 'completed', 'dropped']
      let eventsCreated = 0

      for (const userGame of userGames) {
        // Only create events for statuses that are tracked in the timeline
        if (trackedStatuses.includes(userGame.status)) {
          const newEvent: TimelineEvent = {
            id: crypto.randomUUID(),
            userGameId: userGame.id,
            status: userGame.status,
            startDate: now,
            endDate: null,
            createdAt: now
          }
          await db.timelineEvents.add(newEvent)
          eventsCreated++
        }
      }

      setImportStatus({ type: 'success', message: `Timeline reset successfully! Created ${eventsCreated} new timeline events based on current game statuses.` })
      setTimeout(() => window.location.reload(), 1500)
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to reset timeline'
      })
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Data Management</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Export Data</h3>
              <p className="text-sm text-gray-400 mb-4">
                Download all your game collection data as a JSON file. You can use this to backup your data or import it on another device.
              </p>
              <button
                onClick={handleExport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                <Download size={18} />
                Export Data
              </button>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Import Data</h3>
              <p className="text-sm text-gray-400 mb-4">
                Import previously exported data. This will replace all existing data in your collection.
              </p>
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer">
                <Upload size={18} />
                Import Data
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Debug Tools</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">Delete Game</h3>
              <p className="text-sm text-gray-400 mb-4">
                Delete a game by its RAWG ID. Use this if a game cannot be deleted normally. You can find the game ID in the URL when viewing the game detail page.
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={deleteGameId}
                  onChange={(e) => setDeleteGameId(e.target.value)}
                  placeholder="Enter game ID (e.g., 12345)"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  onClick={handleDeleteGame}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2"
                >
                  <Trash2 size={18} />
                  Delete
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <h3 className="text-lg font-medium text-gray-300 mb-2">Reset Timeline</h3>
              <p className="text-sm text-gray-400 mb-4">
                Rebuild the timeline from current game statuses. This will clear all existing timeline events and create new ones based on each game's current status. Useful if games are missing from the timeline.
              </p>
              <button
                onClick={handleResetTimeline}
                className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg"
              >
                <RefreshCw size={18} />
                Reset Timeline
              </button>
            </div>
          </div>
        </div>

        {importStatus && (
          <div
            className={`p-4 rounded-lg flex items-center gap-3 ${
              importStatus.type === 'success'
                ? 'bg-green-900/50 border border-green-700 text-green-200'
                : 'bg-red-900/50 border border-red-700 text-red-200'
            }`}
          >
            {importStatus.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{importStatus.message}</span>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">About</h2>
          <p className="text-gray-400 text-sm">
            Game Collection Tracker v0.1.0
            <br />
            A local-first web app for tracking your video game collection and backlog.
          </p>
        </div>
      </div>
    </div>
  )
}
