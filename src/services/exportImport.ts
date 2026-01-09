import { db } from './database'
import { ExportData } from '../types'

export async function exportData(): Promise<ExportData> {
  const user = await db.users.get('local-user')
  if (!user) {
    throw new Error('User not found')
  }

  const games = await db.games.toArray()
  const userGames = await db.userGames.toArray()
  const timelineEvents = await db.timelineEvents.toArray()
  const tags = await db.tags.toArray()

  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    user,
    games,
    userGames,
    timelineEvents,
    tags
  }
}

export async function importData(data: ExportData): Promise<void> {
  // Validate data structure
  if (!data.version || !data.user || !Array.isArray(data.games) || !Array.isArray(data.userGames)) {
    throw new Error('Invalid export data format')
  }

  // Clear existing data (except user if we want to preserve it)
  await db.games.clear()
  await db.userGames.clear()
  await db.timelineEvents.clear()
  
  // Optionally clear tags, or merge them
  // For MVP, we'll clear and import
  await db.tags.clear()

  // Import data (convert date strings back to Date objects)
  if (data.games.length > 0) {
    const gamesWithDates = data.games.map(game => ({
      ...game,
      createdAt: new Date(game.createdAt)
    }))
    await db.games.bulkAdd(gamesWithDates)
  }

  if (data.userGames.length > 0) {
    const userGamesWithDates = data.userGames.map(ug => ({
      ...ug,
      createdAt: new Date(ug.createdAt),
      updatedAt: new Date(ug.updatedAt)
    }))
    await db.userGames.bulkAdd(userGamesWithDates)
  }

  if (data.timelineEvents.length > 0) {
    const eventsWithDates = data.timelineEvents.map(event => ({
      ...event,
      startDate: new Date(event.startDate),
      endDate: event.endDate ? new Date(event.endDate) : null,
      createdAt: new Date(event.createdAt)
    }))
    await db.timelineEvents.bulkAdd(eventsWithDates)
  }

  if (data.tags.length > 0) {
    const tagsWithDates = data.tags.map(tag => ({
      ...tag,
      createdAt: new Date(tag.createdAt)
    }))
    await db.tags.bulkAdd(tagsWithDates)
  }

  // Update user if needed (convert date)
  const userWithDate = {
    ...data.user,
    createdAt: new Date(data.user.createdAt)
  }
  await db.users.put(userWithDate)
}

export async function downloadExport(): Promise<void> {
  const data = await exportData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `game-collection-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function importFromFile(file: File): Promise<void> {
  const text = await file.text()
  const data: ExportData = JSON.parse(text)
  await importData(data)
}
