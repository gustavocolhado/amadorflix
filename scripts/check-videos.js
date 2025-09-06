const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkVideos() {
  try {
    console.log('🔍 Verificando vídeos no banco de dados...')
    
    // Contar vídeos
    const videoCount = await prisma.video.count()
    console.log(`📊 Total de vídeos no banco: ${videoCount}`)
    
    if (videoCount === 0) {
      console.log('❌ Nenhum vídeo encontrado no banco')
      return
    }
    
    // Buscar alguns vídeos de exemplo
    const sampleVideos = await prisma.video.findMany({
      take: 5,
      select: {
        id: true,
        url: true,
        title: true,
        videoUrl: true,
        thumbnailUrl: true,
        iframe: true,
        trailerUrl: true
      }
    })
    
    console.log('\n🎬 Exemplos de vídeos no banco:')
    sampleVideos.forEach((video, index) => {
      console.log(`\n${index + 1}. Vídeo:`)
      console.log(`   ID: ${video.id}`)
      console.log(`   URL: ${video.url}`)
      console.log(`   Título: ${video.title}`)
      console.log(`   Video URL: ${video.videoUrl}`)
      console.log(`   Thumbnail: ${video.thumbnailUrl}`)
      console.log(`   Iframe: ${video.iframe}`)
      console.log(`   Trailer: ${video.trailerUrl || 'N/A'}`)
    })
    
    // Verificar se existe um vídeo com a URL específica que está sendo testada
    const testUrl = '67bbf4fa4ad322e57cef257f'
    const testVideo = await prisma.video.findUnique({
      where: { url: testUrl }
    })
    
    console.log(`\n🔍 Buscando vídeo com URL: ${testUrl}`)
    if (testVideo) {
      console.log('✅ Vídeo encontrado!')
      console.log(`   Título: ${testVideo.title}`)
      console.log(`   Video URL: ${testVideo.videoUrl}`)
    } else {
      console.log('❌ Vídeo não encontrado')
      
      // Tentar buscar por ID
      const testVideoById = await prisma.video.findUnique({
        where: { id: testUrl }
      })
      
      if (testVideoById) {
        console.log('✅ Vídeo encontrado por ID!')
        console.log(`   URL: ${testVideoById.url}`)
        console.log(`   Título: ${testVideoById.title}`)
      } else {
        console.log('❌ Vídeo também não encontrado por ID')
      }
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar vídeos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVideos() 