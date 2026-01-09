import { DragDropTimeline } from '../components/timeline/DragDropTimeline'

export function Timeline() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Timeline</h1>
      <p className="text-gray-400 mb-6">
        Drag games between lanes to change their status. Organize your backlog and track what you're playing!
      </p>
      <DragDropTimeline />
    </div>
  )
}
