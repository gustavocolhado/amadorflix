'use client'

import { useState, useRef } from 'react'
import { Play, Pause } from 'lucide-react'

interface TrailerPreviewProps {
  trailerUrl: string
  title: string
  className?: string
}

export default function TrailerPreview({ trailerUrl, title, className = '' }: TrailerPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handlePause = () => {
    setIsPlaying(false)
    if (videoRef.current) {
      videoRef.current.pause()
    }
  }

  const handleVideoPlay = () => {
    setIsPlaying(true)
  }

  const handleVideoPause = () => {
    setIsPlaying(false)
  }

  const handleVideoEnded = () => {
    setIsPlaying(false)
  }

  return (
    <div className={`relative ${className}`}>
      {isPlaying ? (
        <div className="relative">
          <video
            ref={videoRef}
            src={trailerUrl}
            className="w-full h-full object-cover"
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onEnded={handleVideoEnded}
            controls={false}
            preload="metadata"
          />
          <button
            onClick={handlePause}
            className="absolute top-2 right-2 bg-black bg-opacity-75 text-white p-2 rounded-full hover:bg-opacity-90 transition-all z-10"
          >
            <Pause size={16} />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
            <div className="text-gray-600 text-sm">Trailer Preview</div>
          </div>
          <button
            onClick={handlePlay}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all"
          >
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Play size={24} className="text-white ml-1" />
            </div>
          </button>
        </div>
      )}
    </div>
  )
} 