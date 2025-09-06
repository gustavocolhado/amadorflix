import { NextRequest, NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const filter = searchParams.get('filter') || 'recent'
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    
    const skip = (page - 1) * limit

    // Construir where clause baseado nos filtros
    let whereClause: any = {}
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (category) {
      whereClause.category = { has: category }
    }

    // Construir orderBy baseado no filtro
    let orderBy: any = { created_at: 'desc' }
    
    switch (filter) {
      case 'popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'liked':
        orderBy = { likesCount: 'desc' }
        break
      case 'long':
        whereClause.duration = { gte: 600 } // 10 minutos em segundos
        orderBy = { duration: 'desc' }
        break
      case 'random':
        // Para random, vamos usar created_at mas com skip aleatório
        break
    }

    // Buscar vídeos
    const videos = await prismaVideos.video.findMany({
      where: whereClause,
      orderBy,
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

    // Contar total de vídeos
    const total = await prismaVideos.video.count({
      where: whereClause
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      videos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    console.error('Erro ao buscar vídeos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Usar o banco de vídeos para criar um novo vídeo
    const video = await prismaVideos.video.create({
      data: body
    })

    return NextResponse.json(video)
  } catch (error) {
    console.error('Erro ao criar vídeo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}