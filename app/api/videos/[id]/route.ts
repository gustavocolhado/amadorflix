import { NextRequest, NextResponse } from 'next/server'
import { prismaVideos } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('🔍 Buscando vídeo com ID:', id)

    // Buscar vídeo no banco de dados (usar banco de vídeos)
    const video = await prismaVideos.video.findUnique({
      where: { id }
    })

    console.log('🔍 Resultado da busca:', video ? 'Vídeo encontrado' : 'Vídeo não encontrado')

    if (!video) {
      console.log('❌ Vídeo não encontrado para ID:', id)
      return NextResponse.json(
        { error: 'Vídeo não encontrado' },
        { status: 404 }
      )
    }

    console.log('✅ Vídeo encontrado:', video.title)

    // Buscar creatorId se houver creator
    let creatorId = null
    if (video.creator) {
      const creatorRecord = await prismaVideos.creator.findUnique({
        where: { name: video.creator },
        select: { id: true }
      })
      creatorId = creatorRecord?.id || null
    }

    // Formatar dados para a resposta (versão simplificada)
    const formattedVideo = {
      id: video.id,
      url: video.url,
      title: video.title,
      duration: video.duration ? `${Math.floor(video.duration / 60)}:${Math.floor(video.duration % 60).toString().padStart(2, '0')}` : '0:00',
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      trailerUrl: video.trailerUrl,
      isIframe: video.iframe || false,
      premium: video.premium,
      viewCount: video.viewCount,
      likesCount: video.likesCount,
      dislikesCount: 0,
      category: video.category || [],
      creator: video.creator || 'Desconhecido',
      creatorId: creatorId,
      uploader: null,
      uploadTime: video.created_at ? new Date(video.created_at).toLocaleDateString('pt-BR') : 'Data desconhecida',
      description: video.description || '',
      tags: []
    }

    return NextResponse.json(formattedVideo)
  } catch (error) {
    console.error('Erro ao buscar vídeo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 