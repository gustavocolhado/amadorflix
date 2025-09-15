import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma, prismaVideos } from '@/lib/database'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Buscar histórico de visualização do usuário (usar banco de vídeos)
    const historyVideos = await prismaVideos.userHistory.findMany({
      where: { userId: user.id },
      include: {
        video: {
          select: {
            id: true,
            title: true,
            description: true,
            url: true,
            thumbnailUrl: true,
            viewCount: true,
            likesCount: true,
            duration: true,
            premium: true,
            creator: true,
            created_at: true
          }
        }
      },
      orderBy: {
        watchedAt: 'desc' // Mais recentes primeiro
      }
    })

    // Extrair apenas os vídeos da resposta e adicionar creatorId
    const videos = await Promise.all(
      historyVideos.map(async (history) => {
        const video = history.video
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
          creatorId: creatorId
        }
      })
    )

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Erro ao buscar histórico:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 