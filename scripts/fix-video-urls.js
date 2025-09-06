const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function fixVideoUrls() {
  try {
    console.log('🔧 Corrigindo URLs dos vídeos...')
    
    // Buscar vídeos com URLs corrompidas
    const videos = await prisma.video.findMany({
      where: {
        videoUrl: {
          contains: 'ttps://medias.cornosbrasilvip.com'
        }
      },
      take: 10
    })
    
    console.log(`📊 Encontrados ${videos.length} vídeos com URLs corrompidas`)
    
    for (const video of videos) {
      console.log(`\n🔍 Corrigindo vídeo: ${video.title}`)
      console.log(`   URL atual: ${video.videoUrl}`)
      
      // Extrair a parte correta da URL
      const urlMatch = video.videoUrl.match(/ttps:\/\/medias\.cornosbrasilvip\.com\/vips\/([^\/]+)\/([^\/]+)/)
      
      if (urlMatch) {
        const [, folder, filename] = urlMatch
        const correctedUrl = `https://medias.cornosbrasilvip.com/vips/${folder}/${filename}`
        
        console.log(`   URL corrigida: ${correctedUrl}`)
        
        // Atualizar no banco
        await prisma.video.update({
          where: { id: video.id },
          data: { videoUrl: correctedUrl }
        })
        
        console.log(`   ✅ Vídeo atualizado`)
      } else {
        console.log(`   ❌ Não foi possível corrigir a URL`)
      }
    }
    
    console.log('\n✅ Processo concluído!')
    
  } catch (error) {
    console.error('❌ Erro ao corrigir URLs:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixVideoUrls() 