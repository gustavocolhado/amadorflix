import { useState } from 'react'

interface CreatorAvatarProps {
  creator: {
    id: string
    name: string
    image?: string | null
  }
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function CreatorAvatar({ creator, size = 'md', className = '' }: CreatorAvatarProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const handleImageError = () => {
    setImageError(true)
    setIsLoading(false)
  }

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  // Se não há imagem ou houve erro ao carregar, usar placeholder
  if (!creator.image || imageError) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ${className}`}>
        <svg 
          className={`${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'} text-gray-400`} 
          fill="currentColor" 
          viewBox="0 0 20 20"
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
    )
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {isLoading && (
        <div className="w-full h-full bg-gray-200 animate-pulse"></div>
      )}
      <img
        src={creator.image}
        alt={creator.name}
        className={`${sizeClasses[size]} rounded-full object-cover border-2 border-gray-200 ${isLoading ? 'hidden' : ''}`}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}
