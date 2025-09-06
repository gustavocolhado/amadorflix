const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkVideosStatus() {
  try {
    console.log('🔍 Verificando status dos vídeos no banco...\n')

    // Estatísticas gerais
    const totalVideos = await prisma.video.count()
    const iframeVideos = await prisma.video.count({
      where: { iframe: true }
    })
    const videosWithTrailer = await prisma.video.count({
      where: {
        trailerUrl: {
          not: null
        }
      }
    })
    const videosWithoutTrailer = await prisma.video.count({
      where: {
        OR: [
          { trailerUrl: null },
          { trailerUrl: '' }
        ]
      }
    })

    console.log('📊 Estatísticas Gerais:')
    console.log(`📹 Total de vídeos: ${totalVideos.toLocaleString()}`)
    console.log(`🎬 Vídeos iframe: ${iframeVideos.toLocaleString()} (${((iframeVideos/totalVideos)*100).toFixed(1)}%)`)
    console.log(`🎥 Vídeos com trailer: ${videosWithTrailer.toLocaleString()} (${((videosWithTrailer/totalVideos)*100).toFixed(1)}%)`)
    console.log(`❌ Vídeos sem trailer: ${videosWithoutTrailer.toLocaleString()} (${((videosWithoutTrailer/totalVideos)*100).toFixed(1)}%)`)

    // Verificar alguns vídeos de exemplo
    console.log('\n📋 Exemplos de vídeos:')
    
    const sampleVideos = await prisma.video.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        iframe: true,
        trailerUrl: true,
        premium: true
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    sampleVideos.forEach((video, index) => {
      console.log(`\n${index + 1}. ${video.title}`)
      console.log(`   ID: ${video.id}`)
      console.log(`   Iframe: ${video.iframe ? '✅ Sim' : '❌ Não'}`)
      console.log(`   Trailer: ${video.trailerUrl ? '✅ Sim' : '❌ Não'}`)
      console.log(`   Premium: ${video.premium ? '✅ Sim' : '❌ Não'}`)
      if (video.trailerUrl) {
        console.log(`   URL Trailer: ${video.trailerUrl.substring(0, 50)}...`)
      }
    })

    // Verificar vídeos iframe sem trailer
    const iframeWithoutTrailer = await prisma.video.count({
      where: {
        iframe: true,
        OR: [
          { trailerUrl: null },
          { trailerUrl: '' }
        ]
      }
    })

    if (iframeWithoutTrailer > 0) {
      console.log(`\n⚠️  ATENÇÃO: ${iframeWithoutTrailer} vídeos iframe sem trailer!`)
    }

    // Verificar vídeos com trailer mas não iframe
    const trailerWithoutIframe = await prisma.video.count({
      where: {
        iframe: false,
        trailerUrl: {
          not: null
        }
      }
    })

    if (trailerWithoutIframe > 0) {
      console.log(`⚠️  ATENÇÃO: ${trailerWithoutIframe} vídeos com trailer mas não são iframe!`)
    }

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVideosStatus() 