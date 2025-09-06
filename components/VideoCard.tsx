'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, Star } from 'lucide-react'
import { useVideoActions } from '@/hooks/useVideoActions'

interface VideoCardProps {
  id: string
  title: string
  duration: string
  thumbnailUrl: string
  videoUrl: string
  trailerUrl?: string
  isIframe?: boolean
  premium?: boolean
  viewCount?: number
  likesCount?: number
  category?: string[]
  creator?: string
  uploader?: {
    id: string
    name: string
    username: string
  } | null
  onClick?: (video: VideoCardProps) => void
}

export default function VideoCard({ 
  id, 
  title, 
  duration, 
  thumbnailUrl, 
  videoUrl, 
  trailerUrl,
  isIframe = false,
  premium = false, 
  viewCount = 0, 
  likesCount = 0, 
  category = [], 
  creator, 
  uploader, 
  onClick 
}: VideoCardProps) {
  const [showTrailer, setShowTrailer] = useState(false)
  const router = useRouter()
  const { isLiked, isFavorited, isLoading, toggleLike, toggleFavorite } = useVideoActions({ videoId: id })
  
  // Função para construir a URL do thumbnail
  const getThumbnailUrl = (url: string, isIframe: boolean) => {
    if (isIframe) {
      return url
    }
    
    const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
    if (!mediaUrl) {
      console.warn('NEXT_PUBLIC_MEDIA_URL não está configurada')
      return url
    }
    
    // Remove barra dupla se existir
    const cleanMediaUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl
    const cleanThumbnailUrl = url.startsWith('/') ? url : `/${url}`
    
    return `${cleanMediaUrl}${cleanThumbnailUrl}`
  }
  
  const handleClick = () => {
    if (onClick) {
      onClick({ id, title, duration, thumbnailUrl, videoUrl, trailerUrl, isIframe, premium, viewCount, likesCount, category, creator, uploader })
    } else {
      // Navegar para a página do vídeo
      router.push(`/video/${id}`)
    }
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike()
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite()
  }

  const handleMouseEnter = () => {
    if (isIframe && trailerUrl) {
      setShowTrailer(true)
    }
  }

  const handleMouseLeave = () => {
    if (isIframe && trailerUrl) {
      setShowTrailer(false)
    }
  }

  return (
    <div 
      className="group cursor-pointer" 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative aspect-video theme-card rounded-lg overflow-hidden">
        {/* Trailer (se iframe e mouse sobre) */}
        {showTrailer && isIframe && trailerUrl && (
          <div className="absolute inset-0 z-10">
            <video
              src={trailerUrl}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              style={{
                pointerEvents: 'none' // Desabilita interações com o vídeo
              }}
            />
          </div>
        )}
        
        {/* Thumbnail (visível quando não há trailer) */}
        {(!showTrailer || !isIframe || !trailerUrl) && (
          <>
            {thumbnailUrl ? (
              <img 
                src={getThumbnailUrl(thumbnailUrl, isIframe)} 
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  target.nextElementSibling?.classList.remove('hidden')
                }}
              />
            ) : null}
            
            {/* Fallback Thumbnail */}
            <div className={`w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center ${thumbnailUrl ? 'hidden' : ''}`}>
              <div className="text-gray-600 text-sm">Thumbnail</div>
            </div>
          </>
        )}
        
        {/* Premium Badge */}
        {premium && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
            PREMIUM
          </div>
        )}
        
        {/* Duration */}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
          {duration}
        </div>
        
        {/* View Count */}
        {viewCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
            {viewCount.toLocaleString()} views
          </div>
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="w-0 h-0 border-l-8 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-black bg-opacity-75 text-white hover:bg-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
              isFavorited 
                ? 'bg-yellow-500 text-white' 
                : 'bg-black bg-opacity-75 text-white hover:bg-yellow-500'
            }`}
          >
            <Star className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
      
      {/* Title */}
      <h3 className="text-sm text-theme-primary mt-2 line-clamp-2 group-hover:text-accent-red transition-colors">
        {title}
      </h3>
      
      {/* Creator Info */}
      {(creator || uploader) && (
        <p className="text-xs text-theme-secondary mt-1">
          {uploader?.name || uploader?.username || creator}
        </p>
      )}
      
      {/* Stats */}
      <div className="flex items-center space-x-2 mt-1">
        {viewCount > 0 && (
          <span className="text-xs text-theme-secondary">
            {viewCount.toLocaleString()} views
          </span>
        )}
        {likesCount > 0 && (
          <span className="text-xs text-theme-secondary">
            {likesCount.toLocaleString()} likes
          </span>
        )}
      </div>
    </div>
  )
} 