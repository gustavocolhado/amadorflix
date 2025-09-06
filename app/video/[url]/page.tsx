'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { 
  ThumbsUp,
  Share2,
  Download,
  Info,
  Flag,
  MessageCircle,
  Plus,
  Eye,
  User,
  Clock,
  RefreshCw
} from 'lucide-react'
import Layout from '@/components/Layout'
import Header from '@/components/Header'
import Player from '@/components/Player'
import { useRelatedVideos } from '@/hooks/useRelatedVideos'

interface VideoData {
  id: string
  url: string
  title: string
  duration: string
  thumbnailUrl: string
  videoUrl: string
  trailerUrl?: string
  isIframe?: boolean
  premium?: boolean
  viewCount: number
  likesCount: number
  dislikesCount: number
  category: string[]
  creator: string
  uploader?: {
    id: string
    name: string
    username: string
  } | null
  uploadTime: string
  description: string
  tags: string[]
}

export default function VideoPage() {
  const params = useParams()
  const videoUrl = params.url as string
  
  const [video, setVideo] = useState<VideoData | null>(null)
  const [loading, setLoading] = useState(true)

  // Buscar vídeos relacionados
  const { videos: relatedVideos, loading: relatedLoading } = useRelatedVideos({
    videoId: videoUrl,
    limit: 5
  })
  // Buscar dados do vídeo
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true)
        
        const response = await fetch(`/api/videos/${videoUrl}`)
        
        if (!response.ok) {
          throw new Error('Vídeo não encontrado')
        }
        
        const videoData = await response.json()
        setVideo(videoData)
      } catch (error) {
        console.error('Erro ao buscar vídeo:', error)
        // Fallback para dados mock se a API falhar
        const mockVideo: VideoData = {
          id: videoUrl,
          url: videoUrl,
          title: 'BOQUETE CASEIROS MAGRINHA SUGANDO PIROCA DURA DO MACHO',
          duration: '1:52',
          thumbnailUrl: '/thumbnails/video1.jpg',
          videoUrl: '/videos/video1.mp4',
          isIframe: false,
          premium: false,
          viewCount: 0,
          likesCount: 1,
          dislikesCount: 0,
          category: ['BOQUETES', 'MAGRINHA'],
          creator: 'Cremona',
          uploader: {
            id: '1',
            name: 'Cremona',
            username: 'cremona'
          },
          uploadTime: '24 minutes ago',
          description: 'Assista a este vídeo emocionante de uma novinha magrinha pagando boquete de forma intensa! Ela está sugando a piroca dura do macho com maestria, proporcionando sexo oral de alta qualidade. Esses boquete caseiros são deliciosos de se ver, com a magrinha se dedicando ao prazer do parceiro. Se você gosta de assistir a sexo oral bem feito, este vídeo é para você. Aproveite cada momento dessa cena excitante e mergulhe no mundo do prazer oral. Prepare-se para se surpreender com a habilidade dessa novinha em ação!',
          tags: ['Cremona', 'BOQUETE CASEIROS', 'MAGRINHA', 'SUGANDO', 'PIROCA', 'SEXO ORAL']
        }
        setVideo(mockVideo)
      } finally {
        setLoading(false)
      }
    }

    if (videoUrl) {
      fetchVideo()
    }
  }, [videoUrl])

  // Função para construir a URL do thumbnail (igual ao VideoCard)
  const getThumbnailUrl = (url: string, isIframe: boolean) => {
    console.log('🖼️ Construindo URL do thumbnail:', { url, isIframe })
    
    if (isIframe) {
      return url
    }
    
    const mediaUrl = 'https://cdn.vazadex.com'
    const cleanMediaUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl
    const cleanThumbnailUrl = url.startsWith('/') ? url : `/${url}`
    
    const finalUrl = `${cleanMediaUrl}${cleanThumbnailUrl}`
    console.log('🖼️ URL do thumbnail construída:', finalUrl)
    return finalUrl
  }

  // Função para construir a URL do vídeo (apenas para vídeos não-iframe)
  const getVideoUrl = (url: string, isIframe: boolean) => {
    console.log('🎬 Construindo URL do vídeo:', { url, isIframe })
    
    // Se a URL já é completa (começa com http), usar proxy para evitar CORS
    if (url.startsWith('http')) {
      const proxyUrl = `/api/proxy/video?url=${encodeURIComponent(url)}`
      console.log('🎬 URL completa detectada, usando proxy:', proxyUrl)
      return proxyUrl
    }
    
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
    if (!mediaUrl) {
      console.warn('⚠️ NEXT_PUBLIC_MEDIA_URL não está configurada, usando URL original:', url)
      return url
    }
    
    const cleanMediaUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl
    const cleanVideoUrl = url.startsWith('/') ? url : `/${url}`
    const finalUrl = `${cleanMediaUrl}${cleanVideoUrl}`
    
    // Usar proxy para URLs externas
    const proxyUrl = `/api/proxy/video?url=${encodeURIComponent(finalUrl)}`
    console.log('🎬 URL construída com proxy:', proxyUrl)
    return proxyUrl
  }





  if (loading) {
    return (
      <Layout>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-theme-primary flex items-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Carregando vídeo...</span>
          </div>
        </div>
      </Layout>
    )
  }

  if (!video) {
    return (
      <Layout>
        <Header />
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-theme-primary">Vídeo não encontrado</div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Header />
      <main className="bg-theme-primary min-h-screen mt-5">
        <div className="container-content py-6">
          {/* Top Bar */}
          <div className="bg-theme-card border border-theme-primary text-theme-primary p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-bold truncate flex-1 mr-4">
                {video.title}
              </h1>
              <div className="flex items-center space-x-2">
                <span className="bg-accent-red px-2 py-1 rounded text-sm font-bold text-white">
                  {video.duration}
                </span>
                <span className="bg-theme-hover text-theme-primary px-2 py-1 rounded text-sm font-bold">
                  HD
                </span>
              </div>
            </div>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              {video.tags.map((tag, index) => (
                <button
                  key={index}
                  className="bg-theme-hover hover:bg-theme-input text-theme-primary px-3 py-1 rounded text-sm transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Video Player */}
                      <div className="flex-1">

              <Player
                videoUrl={video.isIframe ? (video.videoUrl || video.url) : getVideoUrl(video.videoUrl || video.url, video.isIframe || false)}
                poster={getThumbnailUrl(video.thumbnailUrl, video.isIframe || false)}
                title={video.title}
                onError={(error) => console.error('Erro no player:', error)}
                onLoad={() => console.log('Vídeo carregado com sucesso')}
                autoPlay={false}
                muted={true}
                loop={false}
                isIframe={video.isIframe || false}
              />

              {/* Engagement Buttons */}
              <div className="flex items-center space-x-4 mt-4">
                <button className="flex items-center space-x-2 bg-theme-hover hover:bg-theme-input text-theme-primary px-4 py-2 rounded-lg transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm font-medium">100%</span>
                  <span className="text-sm text-theme-muted">1 curtida</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-accent-red hover:bg-accent-red-hover text-white px-4 py-2 rounded-lg transition-colors">
                  <Info className="w-4 h-4" />
                  <span className="text-sm font-medium">INFO</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-theme-hover hover:bg-theme-input text-theme-primary px-4 py-2 rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">ADICIONAR</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-theme-hover hover:bg-theme-input text-theme-primary px-4 py-2 rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span className="text-sm font-medium">BAIXAR</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-theme-hover hover:bg-theme-input text-theme-primary px-4 py-2 rounded-lg transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">EMBED</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-theme-hover hover:bg-theme-input text-theme-primary px-4 py-2 rounded-lg transition-colors">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm font-medium">DENUNCIAR</span>
                </button>
                
                <button className="flex items-center space-x-2 bg-theme-hover hover:bg-theme-input text-theme-primary px-4 py-2 rounded-lg transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">COMENTARIOS 0</span>
                </button>
              </div>

              {/* Video Info */}
              <div className="bg-theme-card border border-theme-primary rounded-lg p-6 mt-4">
                <div className="flex items-center space-x-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-theme-muted" />
                    <span className="text-sm text-theme-secondary">{video.duration}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-theme-muted" />
                    <span className="text-sm text-theme-secondary">{video.viewCount}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-theme-muted" />
                    <span className="text-sm text-theme-secondary">{video.uploadTime}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-theme-muted" />
                    <span className="text-sm text-theme-secondary">{video.creator}</span>
                  </div>
                </div>

                <p className="text-theme-primary leading-relaxed mb-4">
                  {video.description}
                </p>

                <h2 className="text-lg font-bold text-theme-primary mb-2">
                  {video.title}
                </h2>

                <div className="flex flex-wrap gap-2">
                  {video.category.map((cat, index) => (
                    <span
                      key={index}
                      className="bg-theme-hover text-theme-primary px-3 py-1 rounded-full text-sm"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Vídeos Relacionados - Agora abaixo das informações */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-theme-primary mb-4">Vídeos Relacionados</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {relatedLoading ? (
                    <div className="col-span-full text-center py-8">
                      <div className="text-theme-muted">Carregando vídeos relacionados...</div>
                    </div>
                  ) : (
                    relatedVideos.map((relatedVideo) => (
                      <div 
                        key={relatedVideo.id} 
                        className="bg-theme-card border border-theme-primary rounded-lg overflow-hidden cursor-pointer hover:bg-theme-hover transition-colors"
                        onClick={() => window.location.href = `/video/${relatedVideo.id}`}
                      >
                        <div className="relative aspect-video bg-theme-input">
                          <img
                            src={relatedVideo.thumbnailUrl}
                            alt={relatedVideo.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCAxMjggODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iODAiIGZpbGw9IiNGM0Y0RjYiLz4KPHN2ZyB4PSI0OCIgeT0iNDAiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0iI0QxRDVEQiI+CjxwYXRoIGQ9Ik0xNiAxNkMyMC40MTgzIDE2IDI0IDEyLjQxODMgMjQgOEMyNCAzLjU4MTcgMjAuNDE4MyAwIDE2IDBDMTEuNTgxNyAwIDggMy41ODE3IDggOEM4IDEyLjQxODMgMTEuNTgxNyAxNiAxNiAxNloiLz4KPHBhdGggZD0iTTMyIDMyQzMyIDI0LjI2ODAxIDI0LjgzNiAxOCAxNiAxOEM3LjE2NCAxOCAwIDI0LjI2ODAxIDAgMzIiLz4KPC9zdmc+Cjwvc3ZnPgo='
                            }}
                          />
                          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {relatedVideo.duration}
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="text-sm font-medium text-theme-primary line-clamp-2 mb-1">
                            {relatedVideo.title}
                          </h4>
                          <p className="text-xs text-theme-muted">{relatedVideo.creator}</p>
                          <p className="text-xs text-theme-muted">
                            {relatedVideo.viewCount.toLocaleString()} views • {relatedVideo.uploadTime}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </Layout>
  )
} 