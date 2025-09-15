export interface Creator {
  id: string
  name: string
  qtd: number | null
  description: string | null
  image: string | null
  created_at: string | null
  update_at: string | null
}

export interface Video {
  id: string
  title: string
  description: string | null
  url: string
  videoUrl?: string
  viewCount: number
  likesCount: number
  thumbnailUrl: string
  duration: number | null
  premium: boolean
  iframe?: boolean
  trailerUrl?: string | null
  category?: string[]
  creator: string | null
  creatorId?: string | null
  created_at: string | null
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

export interface CreatorsResponse {
  creators: Creator[]
  pagination: Pagination
} 