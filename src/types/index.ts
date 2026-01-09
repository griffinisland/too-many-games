export type GameStatus = 
  | 'backlog' 
  | 'playing' 
  | 'paused' 
  | 'completed' 
  | 'dropped' 
  | 'wishlist' 
  | 'replaying'

export interface User {
  id: string // "local-user"
  createdAt: Date
}

export interface Game {
  id: number // RAWG ID (primary key)
  title: string
  coverImage: string
  platforms: string[]
  releaseDate: string // ISO date
  developer: string
  publisher: string
  genres: string[]
  franchise: string | null
  playtimeEstimate: number | null // in hours
  rawgDataSnapshot: object // full RAWG response for future use
  createdAt: Date
}

export interface UserGame {
  id: string // UUID
  userId: string // "local-user"
  gameId: number // FK to Game
  owned: boolean
  rating: number | null // 1-10
  status: GameStatus
  tags: string[] // Array of tag slugs
  customCoverImage: string | null // Base64 or blob URL
  createdAt: Date
  updatedAt: Date
}

export interface TimelineEvent {
  id: string // UUID
  userGameId: string // FK to UserGame
  status: GameStatus
  startDate: Date
  endDate: Date | null
  createdAt: Date
}

export interface Tag {
  id: string // slug (primary key)
  slug: string // lowercase, hyphens allowed, unique
  createdAt: Date
}

export interface ExportData {
  version: string
  exportedAt: string
  user: User
  games: Game[]
  userGames: UserGame[]
  timelineEvents: TimelineEvent[]
  tags: Tag[]
}

export interface RAWGGame {
  id: number
  name: string
  background_image: string | null
  platforms: Array<{ platform: { id: number; name: string } }>
  released: string | null
  developers: Array<{ id: number; name: string }>
  publishers: Array<{ id: number; name: string }>
  genres: Array<{ id: number; name: string }>
  tags: Array<{ id: number; name: string }>
  playtime: number | null
}

export interface RAWGSearchResponse {
  count: number
  results: RAWGGame[]
}
