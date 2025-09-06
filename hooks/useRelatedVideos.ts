import { useState, useEffect } from 'react'

interface RelatedVideo {
  id: string
  title: string
  thumbnailUrl: string
  duration: string
  creator: string
  viewCount: number
  uploadTime: string
}

interface UseRelatedVideosOptions {
  videoId: string
  limit?: number
  autoLoad?: boolean
}

export function useRelatedVideos(options: UseRelatedVideosOptions) {
  const { videoId, limit = 10, autoLoad = true } = options
  
  const [videos, setVideos] = useState<RelatedVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRelatedVideos = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/videos/${videoId}/related?limit=${limit}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar vídeos relacionados')
      }
      
      const data = await response.json()
      setVideos(data.videos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
      // Fallback para dados mock
      setVideos([
        {
          id: '1',
          title: 'Novinha em Biquíni na Praia - Vídeo Sensual',
          thumbnailUrl: 'https://medias.cornosbrasilvip.com/uploads/thumb/622a46f7-feba-4157-bc7a-d95c55f18f74.png',
          duration: '2:15',
          creator: 'Cremona',
          viewCount: 1200,
          uploadTime: '2 hours ago'
        },
        {
          id: '2',
          title: 'Magrinha Fazendo Boquete Caseiro',
          thumbnailUrl: 'https://medias.cornosbrasilvip.com/uploads/thumb/622a46f7-feba-4157-bc7a-d95c55f18f74.png',
          duration: '3:42',
          creator: 'Cremona',
          viewCount: 890,
          uploadTime: '4 hours ago'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (autoLoad && videoId) {
      fetchRelatedVideos()
    }
  }, [videoId, autoLoad])

  return {
    videos,
    loading,
    error,
    refetch: fetchRelatedVideos
  }
} 