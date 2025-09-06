'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  RotateCcw
} from 'lucide-react'

interface PlayerProps {
  videoUrl: string
  poster?: string
  title?: string
  onError?: (error: string) => void
  onLoad?: () => void
  autoPlay?: boolean
  muted?: boolean
  loop?: boolean
  isIframe?: boolean
}

export default function Player({ 
  videoUrl, 
  poster, 
  title, 
  onError, 
  onLoad, 
  autoPlay = false, 
  muted = false, 
  loop = false,
  isIframe = false
}: PlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const volumeSliderRef = useRef<HTMLDivElement>(null)
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [showControls, setShowControls] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [buffered, setBuffered] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hasMoved, setHasMoved] = useState(false)
  const isDraggingRef = useRef(false)

  // Formatar tempo em MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }, [isPlaying])

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Skip forward/backward
  const skip = useCallback((seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds
    }
  }, [])

  // Handle volume change
  const handleVolumeChange = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (volumeSliderRef.current && videoRef.current) {
      const rect = volumeSliderRef.current.getBoundingClientRect()
      const clickY = rect.bottom - e.clientY
      const height = rect.height
      const newVolume = Math.max(0, Math.min(1, clickY / height))
      
      setVolume(newVolume)
      videoRef.current.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }, [])

  // Function to update video time based on click position
  const updateVideoTime = useCallback((clientX: number) => {
    if (progressRef.current && videoRef.current && duration > 0 && !isLoading) {
      const rect = progressRef.current.getBoundingClientRect()
      const clickX = Math.max(0, Math.min(clientX - rect.left, rect.width))
      const newTime = (clickX / rect.width) * duration
      
      videoRef.current.currentTime = newTime
    }
  }, [duration, isLoading])

  // Handle progress bar click
  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle click if not dragging and hasn't moved
    if (!isDragging && !hasMoved) {
      updateVideoTime(e.clientX)
    }
  }, [isDragging, hasMoved, updateVideoTime])

  // Handle mouse drag events
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
    isDraggingRef.current = true
    setHasMoved(false)
    // Immediately update time on mouse down
    updateVideoTime(e.clientX)
  }, [updateVideoTime])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
    setHasMoved(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      setHasMoved(true)
      updateVideoTime(e.clientX)
    }
  }, [updateVideoTime])

  // Handle touch events for mobile
  const handleTouchStart = useCallback(() => {
    setIsDragging(true)
    isDraggingRef.current = true
  }, [])

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false)
    isDraggingRef.current = false
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (isDraggingRef.current) {
      const touch = e.touches[0]
      updateVideoTime(touch.clientX)
    }
  }, [updateVideoTime])

  // Event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    console.log('🎬 Player: Configurando event listeners para URL:', videoUrl)

    const handleLoadStart = () => {
      console.log('🎬 Player: Iniciando carregamento do vídeo')
      setIsLoading(true)
    }

    const handleLoadedMetadata = () => {
      console.log('🎬 Player: Metadados carregados, duração:', video.duration)
      setDuration(video.duration)
      setIsLoading(false)
      onLoad?.()
    }

    const handleTimeUpdate = () => {
      if (video.duration > 0) {
        setCurrentTime(video.currentTime)
        
        // Update buffered progress
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1)
          setBuffered((bufferedEnd / video.duration) * 100)
        }
      }
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)
    const handleSeeking = () => {
      // Video is seeking to a new position
    }
    const handleSeeked = () => {
      // Video finished seeking
    }
    const handleError = (e: Event) => {
      const error = e.target as HTMLVideoElement
      console.error('🎬 Player: Erro ao carregar vídeo:', error.error)
      setError('Erro ao carregar o vídeo')
      setIsLoading(false)
      onError?.('Erro ao carregar o vídeo')
    }

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('seeking', handleSeeking)
    video.addEventListener('seeked', handleSeeked)
    video.addEventListener('error', handleError)
    document.addEventListener('fullscreenchange', handleFullscreenChange)

    return () => {
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('seeking', handleSeeking)
      video.removeEventListener('seeked', handleSeeked)
      video.removeEventListener('error', handleError)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [onLoad, onError])

  // Global mouse up listener for drag
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsDragging(false)
      isDraggingRef.current = false
      setHasMoved(false)
    }

    document.addEventListener('mouseup', handleGlobalMouseUp)
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp)
  }, [])

  // Auto-hide controls with better logic
  useEffect(() => {
    let timeout: NodeJS.Timeout
    
    if (isPlaying && showControls && !isDragging) {
      timeout = setTimeout(() => {
        setShowControls(false)
      }, 3000)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isPlaying, showControls, isDragging])

  // Mouse move handler for controls
  const handleControlsMouseMove = useCallback(() => {
    setShowControls(true)
    if (isPlaying && !isDragging) {
      setTimeout(() => setShowControls(false), 3000)
    }
  }, [isPlaying, isDragging])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current?.contains(document.activeElement)) return

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault()
          togglePlay()
          break
        case 'm':
          e.preventDefault()
          toggleMute()
          break
        case 'f':
          e.preventDefault()
          toggleFullscreen()
          break
        case 'ArrowLeft':
          e.preventDefault()
          skip(-10)
          break
        case 'ArrowRight':
          e.preventDefault()
          skip(10)
          break
        case 'ArrowUp':
          e.preventDefault()
          if (volume < 1) {
            const newVolume = Math.min(1, volume + 0.1)
            setVolume(newVolume)
            if (videoRef.current) videoRef.current.volume = newVolume
          }
          break
        case 'ArrowDown':
          e.preventDefault()
          if (volume > 0) {
            const newVolume = Math.max(0, volume - 0.1)
            setVolume(newVolume)
            if (videoRef.current) videoRef.current.volume = newVolume
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [togglePlay, toggleMute, toggleFullscreen, skip, volume])

  if (error) {
    return (
      <div className="bg-black aspect-video rounded-lg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">{error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-accent-red hover:bg-accent-red-hover text-white px-4 py-2 rounded-lg transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    )
  }

  // Se for iframe, renderizar iframe simples
  if (isIframe) {
    return (
      <div className="relative bg-black aspect-video rounded-lg overflow-hidden">
        <iframe
          src={videoUrl}
          className="w-full h-full"
          frameBorder="0"
          allowFullScreen
          allow="autoplay; fullscreen; picture-in-picture"
          title={title || 'Vídeo'}
          onLoad={() => {
            console.log('🎬 Iframe: Vídeo carregado com sucesso')
            onLoad?.()
          }}
          onError={() => {
            console.error('🎬 Iframe: Erro ao carregar vídeo')
            onError?.('Erro ao carregar o vídeo')
          }}
        />
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="relative bg-black aspect-video rounded-lg overflow-hidden group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && !isDragging && setShowControls(false)}
      onMouseMove={handleControlsMouseMove}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline
        preload="metadata"
        crossOrigin="anonymous"
      >
        <source src={videoUrl} type="video/mp4" />
        <source src={videoUrl} type="application/x-mpegURL" />
        <source src={videoUrl} type="video/webm" />
        Seu navegador não suporta reprodução de vídeo.
      </video>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-sm">Carregando vídeo...</div>
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Top Controls */}
        <div className="absolute top-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-sm font-medium truncate flex-1 mr-4">
              {title}
            </h3>
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-black/20"
            >
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>

        {/* Center Play Button - Only show when not playing or controls are visible */}
        {(!isPlaying || showControls) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={togglePlay}
              className="bg-black/50 hover:bg-black/70 text-white rounded-full p-4 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
            >
              {isPlaying ? <Pause size={32} /> : <Play size={32} />}
            </button>
          </div>
        )}

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          {/* Progress Bar */}
          <div 
            ref={progressRef}
            className="relative h-2 bg-white/30 rounded-full mb-4 cursor-pointer group/progress"
            onClick={handleProgressClick}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onMouseLeave={() => {
              setIsDragging(false)
              isDraggingRef.current = false
              setHasMoved(false)
            }}
          >
            {/* Buffered Progress */}
            <div 
              className="absolute h-full bg-white/50 rounded-full"
              style={{ width: `${buffered}%` }}
            />
            {/* Current Progress */}
            <div 
              className="absolute h-full bg-accent-red rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            {/* Progress Handle */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 w-4 h-4 bg-accent-red rounded-full -ml-2 opacity-0 group-hover/progress:opacity-100 transition-opacity"
              style={{ left: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo'}
              >
                {isPlaying ? <Pause size={18} className="sm:w-5 sm:h-5" /> : <Play size={18} className="sm:w-5 sm:h-5" />}
              </button>

              {/* Skip Backward */}
              <button
                onClick={() => skip(-10)}
                className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Retroceder 10 segundos"
              >
                <SkipBack size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Skip Forward */}
              <button
                onClick={() => skip(10)}
                className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Avançar 10 segundos"
              >
                <SkipForward size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Volume Control */}
              <div className="relative">
                <button
                  onClick={toggleMute}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                  className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                  aria-label={isMuted || volume === 0 ? 'Ativar som' : 'Silenciar'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} className="sm:w-5 sm:h-5" /> : <Volume2 size={18} className="sm:w-5 sm:h-5" />}
                </button>
                
                {/* Volume Slider */}
                {showVolumeSlider && (
                  <div 
                    ref={volumeSliderRef}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-black/90 rounded-lg p-3"
                    onClick={handleVolumeChange}
                  >
                    <div className="w-3 h-20 bg-white/30 rounded-full relative">
                      <div 
                        className="absolute bottom-0 w-full bg-white rounded-full"
                        style={{ height: `${volume * 100}%` }}
                      />
                      <div 
                        className="absolute w-4 h-4 bg-white rounded-full -ml-2 transform -translate-y-1/2"
                        style={{ bottom: `${volume * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Time Display */}
              <div className="text-white text-sm font-medium hidden sm:block">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              {/* Mobile Time Display */}
              <div className="text-white text-xs font-medium sm:hidden">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2">
              {/* Quality Indicator */}
              <div className="hidden sm:block">
                <span className="text-white text-xs font-bold bg-accent-red px-2 py-1 rounded">
                  HD
                </span>
              </div>
              
              {/* Mobile Quality Indicator */}
              <div className="sm:hidden">
                <span className="text-white text-xs font-bold bg-accent-red px-1 py-0.5 rounded">
                  HD
                </span>
              </div>

              {/* Settings */}
              <button className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50">
                <Settings size={18} className="sm:w-5 sm:h-5" />
              </button>

              {/* Fullscreen Button - Also in bottom controls */}
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={isFullscreen ? 'Sair da tela cheia' : 'Tela cheia'}
              >
                {isFullscreen ? <Minimize size={18} className="sm:w-5 sm:h-5" /> : <Maximize size={18} className="sm:w-5 sm:h-5" />}
              </button>

              {/* Reload */}
              <button 
                onClick={() => videoRef.current?.load()}
                className="text-white hover:text-gray-300 transition-colors p-1 sm:p-2 rounded-lg hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label="Recarregar vídeo"
              >
                <RotateCcw size={18} className="sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
