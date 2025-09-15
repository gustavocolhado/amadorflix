import { NextRequest, NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Usar o banco de vídeos para buscar criadores
    const [creators, total] = await Promise.all([
      prismaVideos.creator.findMany({
        skip,
        take: limit,
        orderBy: {
          created_at: 'desc'
        }
      }),
      prismaVideos.creator.count()
    ])

    // Para cada creator, buscar a thumbnail do primeiro vídeo se não tiver imagem
    const creatorsWithThumbnails = await Promise.all(
      creators.map(async (creator) => {
        if (!creator.image) {
          // Buscar o primeiro vídeo do creator
          const firstVideo = await prismaVideos.video.findFirst({
            where: {
              creator: creator.name
            },
            select: {
              thumbnailUrl: true
            },
            orderBy: {
              created_at: 'desc'
            }
          })
          
          return {
            ...creator,
            image: firstVideo?.thumbnailUrl || null
          }
        }
        return creator
      })
    )

    const totalPages = Math.ceil(total / limit)
    const hasMore = page < totalPages

    const response = {
      creators: creatorsWithThumbnails,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao buscar criadores:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Usar o banco de vídeos para criar um novo criador
    const creator = await prismaVideos.creator.create({
      data: body
    })

    return NextResponse.json(creator)
  } catch (error) {
    console.error('Erro ao criar criador:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}