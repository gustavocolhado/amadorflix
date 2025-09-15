import { useState, useEffect, useCallback } from 'react'

interface Video {
  id: string
  title: string
  description: string | null
  url: string
  videoUrl: string
  viewCount: number
  likesCount: number
  thumbnailUrl: string
  duration: number | null
  premium: boolean
  iframe: boolean
  trailerUrl: string | null
  category: string[]
  creator: string | null
  creatorId?: string | null
  created_at: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface VideosResponse {
  videos: Video[]
  pagination: Pagination
}

interface UseVideosParams {
  filter?: 'recent' | 'popular' | 'liked' | 'long' | 'random'
  search?: string
  category?: string
  page?: number
  limit?: number
}

// Hook para gerenciar vídeos do banco de vídeos com paginação
export function useVideos(params: UseVideosParams = {}) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasMore: false
  })

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Construir query params
      const queryParams = new URLSearchParams({
        page: (params.page || 1).toString(),
        limit: (params.limit || 12).toString()
      })

      if (params.filter) {
        queryParams.append('filter', params.filter)
      }

      if (params.search) {
        queryParams.append('search', params.search)
      }

      if (params.category) {
        queryParams.append('category', params.category)
      }

      const response = await fetch(`/api/videos?${queryParams.toString()}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar vídeos')
      }
      
      const data: VideosResponse = await response.json()
      
      // Verificar se a resposta tem a estrutura esperada
      if (data && data.videos && Array.isArray(data.videos)) {
        setVideos(data.videos)
        setPagination(data.pagination || {
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasMore: false
        })
      } else {
        // Fallback: se a resposta não tem a estrutura esperada
        setVideos([])
        setPagination({
          page: 1,
          limit: 12,
          total: 0,
          totalPages: 0,
          hasMore: false
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      setVideos([]) // Garantir que videos seja sempre um array
      console.error('Erro ao buscar vídeos:', err)
    } finally {
      setLoading(false)
    }
  }, [params.filter, params.search, params.category, params.page])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  return { 
    videos, 
    loading, 
    error, 
    pagination, 
    refetch: fetchVideos 
  }
}

// Hook para gerenciar criadores do banco de vídeos
export function useCreators() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCreators() {
      try {
        setLoading(true)
        // Exemplo de uso do banco de vídeos
        const response = await fetch('/api/creators')
        const data = await response.json()
        setCreators(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido')
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  return { creators, loading, error }
}