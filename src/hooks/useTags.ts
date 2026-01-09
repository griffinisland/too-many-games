import { useEffect, useState, useCallback } from 'react'
import { db } from '../services/database'
import { Tag } from '../types'

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  const loadTags = useCallback(async () => {
    try {
      const tagsData = await db.tags.toArray()
      setTags(tagsData.sort((a, b) => a.slug.localeCompare(b.slug)))
    } catch (error) {
      console.error('Error loading tags:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadTags()
  }, [loadTags])

  const createTag = useCallback(async (slug: string): Promise<Tag> => {
    // Normalize slug: lowercase, replace spaces with hyphens
    const normalizedSlug = slug.toLowerCase().trim().replace(/\s+/g, '-')
    
    // Check if tag already exists
    const existing = await db.tags.get(normalizedSlug)
    if (existing) {
      return existing
    }

    const tag: Tag = {
      id: normalizedSlug,
      slug: normalizedSlug,
      createdAt: new Date()
    }

    await db.tags.add(tag)
    await loadTags()
    return tag
  }, [loadTags])

  const searchTags = useCallback((query: string): Tag[] => {
    const lowerQuery = query.toLowerCase()
    return tags.filter(tag => tag.slug.includes(lowerQuery))
  }, [tags])

  return {
    tags,
    loading,
    createTag,
    searchTags,
    refresh: loadTags
  }
}
