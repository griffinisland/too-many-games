import { useState } from 'react'

interface RatingInputProps {
  value: number | null
  onChange: (rating: number | null) => void
  className?: string
}

export function RatingInput({ value, onChange, className = '' }: RatingInputProps) {
  const [hovered, setHovered] = useState<number | null>(null)

  const handleClick = (rating: number) => {
    if (value === rating) {
      onChange(null) // Toggle off if clicking the same rating
    } else {
      onChange(rating)
    }
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(rating => {
        const isActive = value !== null && rating <= value
        const isHovered = hovered !== null && rating <= hovered
        const showActive = isHovered || isActive

        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => setHovered(rating)}
            onMouseLeave={() => setHovered(null)}
            className={`text-2xl transition-all ${
              showActive ? 'text-yellow-400 scale-110' : 'text-gray-600 hover:text-gray-400'
            }`}
            aria-label={`Rate ${rating} out of 10`}
          >
            ★
          </button>
        )
      })}
    </div>
  )
}
