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

    // Verificar se já está nos favoritos (usar banco de vídeos)
    const existingFavorite = await prismaVideos.userFavorite.findUnique({
      where: {
        userId_videoId: {
          userId: user.id,
          videoId: videoId
        }
      }
    })

    if (existingFavorite) {
      // Remover dos favoritos (usar banco de vídeos)
      await prismaVideos.userFavorite.delete({
        where: {
          userId_videoId: {
            userId: user.id,
            videoId: videoId
          }
        }
      })

      return NextResponse.json({ favorited: false })
    } else {
      // Adicionar aos favoritos (usar banco de vídeos)
      await prismaVideos.userFavorite.create({
        data: {
          userId: user.id,
          videoId: videoId
        }
      })

      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Erro ao gerenciar favorito:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
} 