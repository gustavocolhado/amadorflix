const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testVideoPage() {
  try {
    console.log('🧪 Testando página de vídeo...')
    
    // Buscar um vídeo que existe
    const video = await prisma.video.findFirst({
      where: {
        url: { not: null },
        videoUrl: { not: null }
      }
    })
    
    if (!video) {
      console.log('❌ Nenhum vídeo encontrado no banco')
      return
    }
    
    console.log('✅ Vídeo encontrado para teste:')
    console.log(`   ID: ${video.id}`)
    console.log(`   URL: ${video.url}`)
    console.log(`   Título: ${video.title}`)
    console.log(`   Video URL: ${video.videoUrl}`)
    console.log(`   Thumbnail: ${video.thumbnailUrl}`)
    console.log(`   Iframe: ${video.iframe}`)
    
    // Simular a lógica da página
    const getVideoUrl = (url, isIframe) => {
      console.log('🎬 Construindo URL do vídeo:', { url, isIframe })
      
      if (isIframe) {
        const embedMatch = url.match(/\/embed\/(\d+)/)
        if (embedMatch) {
          const videoId = embedMatch[1]
          const mediaUrl = 'https://medias.cornosbrasilvip.com'
          const cleanMediaUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl
          
          const m3u8Url = `${cleanMediaUrl}/videos/${videoId}/index.m3u8`
          const mp4Url = `${cleanMediaUrl}/videos/${videoId}/video.mp4`
          
          console.log('🎬 Vídeo iframe detectado, ID:', videoId)
          console.log('🎬 Tentando URL m3u8:', m3u8Url)
          console.log('🎬 Fallback URL mp4:', mp4Url)
          
          return m3u8Url
        }
        
        console.warn('⚠️ Não foi possível extrair ID do embed URL:', url)
        return url
      }
      
      if (url.startsWith('http')) {
        const proxyUrl = `/api/proxy/video?url=${encodeURIComponent(url)}`
        console.log('🎬 URL completa detectada, usando proxy:', proxyUrl)
        return proxyUrl
      }
      
      const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL
      if (!mediaUrl) {
        console.warn('⚠️ NEXT_PUBLIC_MEDIA_URL não está configurada, usando URL original:', url)
        return url
      }
      
      const cleanMediaUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl
      const cleanVideoUrl = url.startsWith('/') ? url : `/${url}`
      const finalUrl = `${cleanMediaUrl}${cleanVideoUrl}`
      
      const proxyUrl = `/api/proxy/video?url=${encodeURIComponent(finalUrl)}`
      console.log('🎬 URL construída com proxy:', proxyUrl)
      return proxyUrl
    }
    
    const getThumbnailUrl = (url, isIframe) => {
      console.log('🖼️ Construindo URL do thumbnail:', { url, isIframe })
      
      if (isIframe) {
        return url
      }
      
      const mediaUrl = 'https://medias.cornosbrasilvip.com'
      const cleanMediaUrl = mediaUrl.endsWith('/') ? mediaUrl.slice(0, -1) : mediaUrl
      const cleanThumbnailUrl = url.startsWith('/') ? url : `/${url}`
      
      const finalUrl = `${cleanMediaUrl}${cleanThumbnailUrl}`
      console.log('🖼️ URL do thumbnail construída:', finalUrl)
      return finalUrl
    }
    
    console.log('\n🔗 Testando construção de URLs:')
    const videoUrl = getVideoUrl(video.videoUrl, video.iframe)
    const thumbnailUrl = getThumbnailUrl(video.thumbnailUrl, video.iframe)
    
    console.log('\n📋 URLs finais:')
    console.log(`   Vídeo: ${videoUrl}`)
    console.log(`   Thumbnail: ${thumbnailUrl}`)
    
    // Testar se as URLs são acessíveis
    console.log('\n🌐 Testando acessibilidade das URLs...')
    
    try {
      const thumbnailResponse = await fetch(thumbnailUrl)
      console.log(`   Thumbnail (${thumbnailResponse.status}): ${thumbnailResponse.ok ? '✅' : '❌'}`)
    } catch (error) {
      console.log(`   Thumbnail: ❌ Erro - ${error.message}`)
    }
    
    // Para o vídeo, vamos apenas verificar se a URL está bem formada
    console.log(`   Vídeo URL: ${videoUrl.startsWith('/api/proxy/') ? '✅ Proxy configurado' : '⚠️ URL direta'}`)
    
  } catch (error) {
    console.error('❌ Erro ao testar página de vídeo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVideoPage() 