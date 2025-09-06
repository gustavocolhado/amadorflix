import { useState, useEffect } from 'react'
import { prismaVideos } from '@/lib/database'

// Hook para gerenciar vídeos do banco de vídeos
export function useVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setLoading(true)
        // Exemplo de uso do banco de vídeos
        const response = await fetch('/api/videos')
        const data = await response.json()
        setVideos(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  return { videos, loading, error }
}

// Hook para gerenciar criadores do banco de vídeos
export function useCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchCreators() {
      try {
        setLoading(true)
        // Exemplo de uso do banco de vídeos
        const response = await fetch('/api/creators')
        const data = await response.json()
        setCreators(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  return { creators, loading, error }
}