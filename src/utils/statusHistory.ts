import { TimelineEvent, GameStatus } from '../types'

export function getActiveEvent(events: TimelineEvent[]): TimelineEvent | null {
  return events.find(e => e.endDate === null) || null
}

export function getEventsForStatus(events: TimelineEvent[], status: GameStatus): TimelineEvent[] {
  return events.filter(e => e.status === status)
}

export function getStatusHistory(userGameId: string, events: TimelineEvent[]): TimelineEvent[] {
  return events
    .filter(e => e.userGameId === userGameId)
    .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
}

export function getPlayCycles(events: TimelineEvent[]): TimelineEvent[][] {
  const playingEvents = events.filter(e => e.status === 'playing')
  playingEvents.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
  
  // Group consecutive playing events (if any)
  // For now, each playing event is a separate cycle
  return playingEvents.map(e => [e])
}
