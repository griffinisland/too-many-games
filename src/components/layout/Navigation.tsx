import { Link, useLocation } from 'react-router-dom'
import { Home, Library, Plus, TrendingUp, Settings, BarChart3 } from 'lucide-react'

export function Navigation() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/library', label: 'Library', icon: Library },
    { path: '/add', label: 'Add Game', icon: Plus },
    { path: '/timeline', label: 'Timeline', icon: TrendingUp },
    { path: '/stats', label: 'Stats', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings }
  ]

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex space-x-8">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-4 border-b-2 transition-colors ${
                  isActive
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-600'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
