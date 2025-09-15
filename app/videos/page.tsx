'use client'

import { useState, useMemo } from 'react'
import Layout from '@/components/Layout'
import Header from '@/components/Header'
import Section from '@/components/Section'
import VideoCard from '@/components/VideoCard'
import Pagination from '@/components/Pagination'
import { Search, Play, TrendingUp, Heart, Clock, Shuffle, Filter } from 'lucide-react'
import { useVideos } from '@/hooks/useVideos'
import { formatDuration } from '@/utils/formatDuration'

type FilterType = 'recent' | 'popular' | 'liked' | 'long' | 'random'

interface FilterOption {
  id: FilterType
  label: string
  icon: React.ReactNode
  description: string
}

const filterOptions: FilterOption[] = [
  {
    id: 'recent',
    label: 'Mais Recentes',
    icon: <Play className="w-4 h-4" />,
    description: 'Vídeos publicados recentemente'
  },
  {
    id: 'popular',
    label: 'Mais Vistos',
    icon: <TrendingUp className="w-4 h-4" />,
    description: 'Vídeos com mais visualizações'
  },
  {
    id: 'liked',
    label: 'Mais Curtidos',
    icon: <Heart className="w-4 h-4" />,
    description: 'Vídeos com mais likes'
  },
  {
    id: 'long',
    label: 'Vídeos Longos',
    icon: <Clock className="w-4 h-4" />,
    description: 'Vídeos com mais de 10 minutos'
  },
  {
    id: 'random',
    label: 'Aleatórios',
    icon: <Shuffle className="w-4 h-4" />,
    description: 'Vídeos em ordem aleatória'
  }
]

export default function VideosPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('recent')
  const [showFilters, setShowFilters] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const { videos, loading, error, pagination, refetch } = useVideos({
    filter: selectedFilter,
    search: searchTerm,
    page: currentPage
  })

  const filteredVideos = useMemo(() => videos, [videos])

  const handleVideoClick = (video: any) => {
    window.location.href = `/video/${video.id}`
  }

  const handleFilterChange = (filter: FilterType) => {
    setSelectedFilter(filter)
    setShowFilters(false)
    setCurrentPage(1) // Reset para primeira página ao mudar filtro
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reset para primeira página ao buscar
  }

  if (loading) {
    return (
      <Layout>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <Section background="white" padding="lg">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {[...Array(12)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="aspect-video bg-gray-200"></div>
                    <div className="p-3">
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Section>
        </main>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <Header />
        <main className="min-h-screen bg-gray-50">
          <Section background="white" padding="lg">
            <div className="text-center">
              <div className="text-red-500 text-lg mb-4">
                Erro ao carregar vídeos
              </div>
              <div className="text-gray-600 mb-4">
                {error}
              </div>
              <button
                onClick={refetch}
                className="px-4 py-2 bg-theme-primary text-white rounded-lg hover:bg-theme-primary-dark transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </Section>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <Header />
      <main className="min-h-screen bg-theme-primary">
        <Section background="white" padding="lg">
          {/* Header da página */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Play className="w-8 h-8 text-theme-primary" />
                             <h1 className="text-3xl font-bold text-theme-primary">
                 Todos os Vídeos
               </h1>
             </div>
             <p className="text-theme-secondary mb-6">
              Explore nossa coleção completa de vídeos com filtros avançados
            </p>
            
            {/* Barra de busca e filtros */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Barra de busca */}
              <div className="relative flex-1 max-w-md">
                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-theme-muted w-5 h-5" />
                 <input
                   type="text"
                   placeholder="Buscar vídeos..."
                   value={searchTerm}
                   onChange={handleSearchChange}
                   className="w-full pl-10 pr-4 py-3 border border-theme-primary rounded-lg focus:ring-2 focus:ring-accent-red focus:border-transparent bg-theme-input text-theme-primary"
                />
              </div>

              {/* Botão de filtros */}
              <div className="relative">
                                 <button
                   onClick={() => setShowFilters(!showFilters)}
                   className="flex items-center gap-2 px-4 py-3 border border-theme-primary rounded-lg hover:bg-theme-hover transition-colors bg-theme-input text-theme-primary"
                >
                  <Filter className="w-5 h-5" />
                  <span>Filtros</span>
                </button>

                                 {/* Dropdown de filtros */}
                 {showFilters && (
                   <div className="absolute top-full left-0 mt-2 w-80 bg-theme-card border border-theme-primary rounded-lg shadow-lg z-50">
                     <div className="p-4">
                       <h3 className="font-semibold text-theme-primary mb-3">Ordenar por:</h3>
                      <div className="space-y-2">
                        {filterOptions.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleFilterChange(option.id)}
                                                         className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-colors ${
                               selectedFilter === option.id
                                 ? 'bg-accent-red text-white'
                                 : 'hover:bg-theme-hover'
                             }`}
                          >
                            <div className="flex-shrink-0 mt-0.5">
                              {option.icon}
                            </div>
                            <div>
                              <div className="font-medium">{option.label}</div>
                                                             <div className={`text-sm ${
                                 selectedFilter === option.id ? 'text-white/80' : 'text-theme-muted'
                               }`}>
                                {option.description}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

                         {/* Filtro ativo */}
             <div className="mt-4">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-red/10 text-accent-red rounded-full text-sm">
                {filterOptions.find(f => f.id === selectedFilter)?.icon}
                <span>{filterOptions.find(f => f.id === selectedFilter)?.label}</span>
              </div>
            </div>
          </div>

          {/* Grid de vídeos */}
          {filteredVideos.length === 0 ? (
            <div className="text-center py-12">
                             <Play className="w-16 h-16 text-theme-muted mx-auto mb-4" />
               <h3 className="text-xl font-semibold text-theme-secondary mb-2">
                 {searchTerm ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
               </h3>
               <p className="text-theme-muted">
                {searchTerm 
                  ? 'Tente ajustar sua busca ou filtros' 
                  : 'Os vídeos aparecerão aqui quando estiverem disponíveis'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {filteredVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    id={video.id}
                    title={video.title}
                    duration={formatDuration(video.duration)}
                    thumbnailUrl={video.thumbnailUrl}
                    videoUrl={video.videoUrl || video.url}
                    trailerUrl={video.trailerUrl || undefined}
                    isIframe={video.iframe}
                    premium={video.premium}
                    viewCount={video.viewCount}
                    likesCount={video.likesCount}
                    category={video.category}
                    creator={video.creator || undefined}
                    creatorId={video.creatorId || undefined}
                    onClick={handleVideoClick}
                  />
                ))}
              </div>

              {/* Paginação */}
              {pagination && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  onPageChange={handlePageChange}
                  className="mt-8"
                />
              )}
            </>
          )}
        </Section>
      </main>
    </Layout>
  )
} 