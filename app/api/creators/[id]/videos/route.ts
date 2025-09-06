import { NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Primeiro, busca o criador para obter o nome (usar banco de vídeos)
    const creator = await prismaVideos.creator.findUnique({
      where: { id },
      select: { name: true }
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'Criador não encontrado' },
        { status: 404 }
      )
    }

    // Busca vídeos do criador
    const videos = await prismaVideos.video.findMany({
      where: {
        creator: creator.name
      },
      orderBy: {
        created_at: 'desc'
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        videoUrl: true,
        viewCount: true,
        likesCount: true,
        thumbnailUrl: true,
        duration: true,
        premium: true,
        iframe: true,
        trailerUrl: true,
        category: true,
        creator: true,
        created_at: true
      }
    })

    // Conta total de vídeos do criador
    const totalVideos = await prismaVideos.video.count({
      where: {
        creator: creator.name
      }
    })

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total: totalVideos,
        totalPages: Math.ceil(totalVideos / limit)
      },
      creator: {
        name: creator.name
      }
    })
  } catch (error) {
    console.error('Erro ao buscar vídeos do criador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 