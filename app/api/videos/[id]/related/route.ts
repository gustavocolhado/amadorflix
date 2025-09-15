import { NextRequest, NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

// Função para formatar tempo relativo
function formatRelativeTime(date: Date | null): string {
  if (!date) return 'recentemente'
  
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'agora mesmo'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} dias atrás`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} meses atrás`
  
  return `${Math.floor(diffInSeconds / 31536000)} anos atrás`
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    const videoId = params.id

    // Buscar vídeos relacionados (excluindo o vídeo atual)
    const relatedVideos = await prismaVideos.video.findMany({
      where: {
        id: {
          not: videoId
        }
      },
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      select: {
        id: true,
        title: true,
        thumbnailUrl: true,
        duration: true,
        creator: true,
        viewCount: true,
        created_at: true
      }
    })

    // Se não encontrar vídeos no banco, retornar dados mock
    if (relatedVideos.length === 0) {
      const mockVideos = [
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
        },
        {
          id: '3',
          title: 'Sexo Oral Intenso com Novinha',
          thumbnailUrl: 'https://medias.cornosbrasilvip.com/uploads/thumb/622a46f7-feba-4157-bc7a-d95c55f18f74.png',
          duration: '4:20',
          creator: 'Cremona',
          viewCount: 1500,
          uploadTime: '6 hours ago'
        },
        {
          id: '4',
          title: 'Boquete Profundo e Molhado',
          thumbnailUrl: 'https://medias.cornosbrasilvip.com/uploads/thumb/622a46f7-feba-4157-bc7a-d95c55f18f74.png',
          duration: '3:15',
          creator: 'Cremona',
          viewCount: 2100,
          uploadTime: '8 hours ago'
        },
        {
          id: '5',
          title: 'Novinha Fazendo Sexo Oral',
          thumbnailUrl: 'https://medias.cornosbrasilvip.com/uploads/thumb/622a46f7-feba-4157-bc7a-d95c55f18f74.png',
          duration: '5:30',
          creator: 'Cremona',
          viewCount: 1800,
          uploadTime: '12 hours ago'
        }
      ]

      return NextResponse.json({
        videos: mockVideos,
        total: mockVideos.length
      })
    }

    // Para cada vídeo, buscar o creatorId se houver creator
    const videosWithCreatorId = await Promise.all(
      relatedVideos.map(async (video) => {
        let creatorId = null
        if (video.creator) {
          const creatorRecord = await prismaVideos.creator.findUnique({
            where: { name: video.creator },
            select: { id: true }
          })
          creatorId = creatorRecord?.id || null
        }
        
        return {
          ...video,
          creatorId: creatorId,
          uploadTime: formatRelativeTime(video.created_at)
        }
      })
    )

    return NextResponse.json({
      videos: videosWithCreatorId,
      total: videosWithCreatorId.length
    })

  } catch (error) {
    console.error('Erro ao buscar vídeos relacionados:', error)
    
    // Fallback com dados mock em caso de erro
    const fallbackVideos = [
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
    ]

    return NextResponse.json({
      videos: fallbackVideos,
      total: fallbackVideos.length
    })
  }
} 