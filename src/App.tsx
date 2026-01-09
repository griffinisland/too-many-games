import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
import { useDatabase } from './hooks/useDatabase'
import { Home } from './pages/Home'
import { Library } from './pages/Library'
import { AddGame } from './pages/AddGame'
import { GameDetail } from './pages/GameDetail'
import { Timeline } from './pages/Timeline'
import { Stats } from './pages/Stats'
import { Settings } from './pages/Settings'

function App() {
  const { isInitialized, error } = useDatabase()

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div>Initializing database...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-red-400">Error initializing database: {error.message}</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/add" element={<AddGame />} />
          <Route path="/game/:id" element={<GameDetail />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  )
}

export default App
