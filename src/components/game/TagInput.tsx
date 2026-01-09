import { useState, useRef, useEffect } from 'react'
import { useTags } from '../../hooks/useTags'

interface TagInputProps {
  value: string[]
  onChange: (tags: string[]) => void
  className?: string
}

export function TagInput({ value, onChange, className = '' }: TagInputProps) {
  const { searchTags, createTag } = useTags()
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    if (val.trim()) {
      const matches = searchTags(val)
      setSuggestions(matches.map(t => t.slug).filter(slug => !value.includes(slug)))
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const addTag = async (tagSlug: string) => {
    if (!value.includes(tagSlug)) {
      // Ensure tag exists in database
      await createTag(tagSlug)
      onChange([...value, tagSlug])
    }
    setInputValue('')
    setShowSuggestions(false)
  }

  const removeTag = (tagSlug: string) => {
    onChange(value.filter(t => t !== tagSlug))
  }

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const normalizedSlug = inputValue.toLowerCase().trim().replace(/\s+/g, '-')
      await addTag(normalizedSlug)
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className="flex flex-wrap gap-2 p-2 bg-gray-700 rounded border border-gray-600 min-h-[2.5rem]">
        {value.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-sm rounded"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="hover:text-red-300"
              aria-label={`Remove ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => inputValue.trim() && setShowSuggestions(true)}
          placeholder={value.length === 0 ? 'Add tags...' : ''}
          className="flex-1 min-w-[120px] bg-transparent text-white placeholder-gray-400 focus:outline-none"
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map(slug => (
            <button
              key={slug}
              type="button"
              onClick={() => addTag(slug)}
              className="w-full text-left px-3 py-2 hover:bg-gray-600 text-white text-sm"
            >
              {slug}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
