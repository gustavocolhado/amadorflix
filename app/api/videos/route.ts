import { NextRequest, NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Usar o banco de vídeos para buscar vídeos
    const videos = await prismaVideos.video.findMany({
      take: 20,
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(videos)
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