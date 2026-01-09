import Dexie, { Table } from 'dexie'
import { Game, User, UserGame, TimelineEvent, Tag } from '../types'
import { seedTags } from '../data/seedTags'

class GameCollectionDB extends Dexie {
  users!: Table<User, string>
  games!: Table<Game, number>
  userGames!: Table<UserGame, string>
  timelineEvents!: Table<TimelineEvent, string>
  tags!: Table<Tag, string>

  constructor() {
    super('GameCollectionDB')
    
    this.version(1).stores({
      users: 'id, createdAt',
      games: 'id, title, createdAt',
      userGames: 'id, userId, gameId, status, updatedAt, *tags',
      timelineEvents: 'id, userGameId, status, startDate, endDate',
      tags: 'id, slug, createdAt'
    })
  }
}

export const db = new GameCollectionDB()

// Initialize database with local user and seed tags
export async function initializeDatabase(): Promise<void> {
  // Create local user if not exists
  const localUser = await db.users.get('local-user')
  if (!localUser) {
    await db.users.add({
      id: 'local-user',
      createdAt: new Date()
    })
  }

  // Seed tags - use bulkPut to avoid errors if tags already exist
  const tagsToAdd: Tag[] = seedTags.map(slug => ({
    id: slug,
    slug,
    createdAt: new Date()
  }))
  await db.tags.bulkPut(tagsToAdd)
}
