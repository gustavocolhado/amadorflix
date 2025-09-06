import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import { prisma, prismaVideos } from '@/lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const videoId = params.id

    // Verificar se o vídeo existe (usar banco de vídeos)
    const video = await prismaVideos.video.findUnique({
      where: { id: videoId }
    })

    if (!video) {
      return NextResponse.json({ error: 'Vídeo não encontrado' }, { status: 404 })
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se já curtiu (usar banco de vídeos)
    const existingLike = await prismaVideos.userLike.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: videoId
        }
      }
    })

    if (existingLike) {
      // Remover like (usar banco de vídeos)
      await prismaVideos.userLike.delete({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId: videoId
          }
        }
      })

      // Decrementar contador de likes (usar banco de vídeos)
      await prismaVideos.video.update({
        where: { id: videoId },
        data: {
          likesCount: {
            decrement: 1
          }
        }
      })

      return NextResponse.json({ liked: false })
    } else {
      // Adicionar like (usar banco de vídeos)
      await prismaVideos.userLike.create({
        data: {
          userId: user.id,
          videoId: videoId
        }
      })

      // Incrementar contador de likes (usar banco de vídeos)
      await prismaVideos.video.update({
        where: { id: videoId },
        data: {
          likesCount: {
            increment: 1
          }
        }
      })

      return NextResponse.json({ liked: true })
    }
  } catch (error) {
    console.error('Erro ao gerenciar like:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 