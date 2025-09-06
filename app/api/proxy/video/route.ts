import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const videoUrl = searchParams.get('url')
    
    if (!videoUrl) {
      return NextResponse.json({ error: 'URL do vídeo é obrigatória' }, { status: 400 })
    }

    console.log('🎬 Proxy: Buscando vídeo:', videoUrl)

    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'video/mp4,video/webm,video/*;q=0.9,*/*;q=0.8',
        'Accept-Encoding': 'identity',
        'Range': 'bytes=0-'
      }
    })

    if (!response.ok) {
      console.error('❌ Proxy: Erro ao buscar vídeo:', response.status, response.statusText)
      return NextResponse.json({ error: 'Erro ao buscar vídeo' }, { status: response.status })
    }

    const videoBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'video/mp4'

    console.log('✅ Proxy: Vídeo carregado com sucesso, tamanho:', videoBuffer.byteLength)

    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': videoBuffer.byteLength.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Range',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600'
      }
    })

  } catch (error) {
    console.error('❌ Proxy: Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
} 