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

    // Buscar vídeos curtidos pelo usuário (usar banco de vídeos)
    const likedVideos = await prismaVideos.userLike.findMany({
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
        id: 'desc' // Mais recentes primeiro
      }
    })

    // Extrair apenas os vídeos da resposta e adicionar creatorId
    const videos = await Promise.all(
      likedVideos.map(async (like) => {
        const video = like.video
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
    console.error('Erro ao buscar vídeos curtidos:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 