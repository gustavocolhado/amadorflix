import { NextRequest, NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    // Usar o banco de vídeos para buscar criadores
    const creators = await prismaVideos.creator.findMany({
      take: 20,
      orderBy: {
        created_at: 'desc'
      }
    })

    return NextResponse.json(creators)
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