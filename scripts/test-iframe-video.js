const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testIframeVideo() {
  try {
    console.log('🧪 Testando vídeo com iframe...')
    
    // Buscar um vídeo que seja iframe
    const video = await prisma.video.findFirst({
      where: {
        iframe: true,
        videoUrl: { not: '' }
      }
    })
    
    if (!video) {
      console.log('❌ Nenhum vídeo iframe encontrado no banco')
      return
    }
    
    console.log('✅ Vídeo iframe encontrado para teste:')
    console.log(`   ID: ${video.id}`)
    console.log(`   URL: ${video.url}`)
    console.log(`   Título: ${video.title}`)
    console.log(`   Video URL: ${video.videoUrl}`)
    console.log(`   Thumbnail: ${video.thumbnailUrl}`)
    console.log(`   Iframe: ${video.iframe}`)
    
    // Verificar se a URL é do formato esperado
    const isVazadexEmbed = video.videoUrl.includes('videos.vazadex.com/embed/')
    console.log(`\n🔗 Verificação da URL:`)
    console.log(`   É embed do Vazadex: ${isVazadexEmbed ? '✅' : '❌'}`)
    
    if (isVazadexEmbed) {
      const embedMatch = video.videoUrl.match(/\/embed\/(\d+)/)
      if (embedMatch) {
        const videoId = embedMatch[1]
        console.log(`   ID do vídeo extraído: ${videoId}`)
        console.log(`   URL completa: ${video.videoUrl}`)
      }
    }
    
    // Testar acessibilidade da URL
    console.log('\n🌐 Testando acessibilidade da URL...')
    try {
      const response = await fetch(video.videoUrl)
      console.log(`   Status: ${response.status}`)
      console.log(`   OK: ${response.ok ? '✅' : '❌'}`)
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        console.log(`   Content-Type: ${contentType}`)
      }
    } catch (error) {
      console.log(`   ❌ Erro ao acessar URL: ${error.message}`)
    }
    
    // Simular como seria renderizado na página
    console.log('\n📋 Simulação da página:')
    console.log(`   isIframe: ${video.iframe}`)
    console.log(`   videoUrl: ${video.videoUrl}`)
    console.log(`   poster: ${video.thumbnailUrl}`)
    
  } catch (error) {
    console.error('❌ Erro ao testar vídeo iframe:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testIframeVideo() 