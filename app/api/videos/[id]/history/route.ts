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
    const body = await request.json()
    const { watchDuration } = body

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

    // Incrementar contador de visualizações (usar banco de vídeos)
    await prismaVideos.video.update({
      where: { id: videoId },
      data: {
        viewCount: {
          increment: 1
        }
      }
    })

    // Registrar no histórico (usar banco de vídeos)
    await prismaVideos.userHistory.upsert({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: videoId
        }
      },
      update: {
        watchedAt: new Date(),
        watchDuration: watchDuration || null
      },
      create: {
        userId: user.id,
        videoId: videoId,
        watchDuration: watchDuration || null
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao registrar visualização:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 