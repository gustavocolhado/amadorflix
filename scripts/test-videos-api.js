const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testVideosAPI() {
  try {
    console.log('🧪 Testando API de vídeos com filtros...')

    // Conta total de vídeos
    const totalVideos = await prisma.video.count()
    console.log(`📊 Total de vídeos no banco: ${totalVideos}`)

    // Testa diferentes filtros
    const filters = ['recent', 'popular', 'liked', 'long', 'random']
    const limit = 12

    for (const filter of filters) {
      console.log(`\n🔍 Testando filtro: ${filter}`)
      
      const skip = 0
      let whereClause = {}
      let orderBy = {}

      // Aplicar filtros específicos
      switch (filter) {
        case 'recent':
          orderBy = { created_at: 'desc' }
          break
        case 'popular':
          orderBy = { viewCount: 'desc' }
          break
        case 'liked':
          orderBy = { likesCount: 'desc' }
          break
        case 'long':
          whereClause = { duration: { gte: 600 } }
          orderBy = { duration: 'desc' }
          break
        case 'random':
          // Para teste, vamos pegar todos e embaralhar
          const allVideos = await prisma.video.findMany({
            take: 20,
            select: { id: true, title: true, viewCount: true, likesCount: true, duration: true }
          })
          console.log(`   - Vídeos encontrados: ${allVideos.length}`)
          if (allVideos.length > 0) {
            console.log(`   - Primeiro: ${allVideos[0].title}`)
            console.log(`   - Último: ${allVideos[allVideos.length - 1].title}`)
          }
          continue
      }

      const videos = await prisma.video.findMany({
        where: whereClause,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          viewCount: true,
          likesCount: true,
          duration: true,
          created_at: true
        }
      })

      console.log(`   - Vídeos retornados: ${videos.length}`)
      
      if (videos.length > 0) {
        console.log(`   - Primeiro: ${videos[0].title}`)
        console.log(`   - Último: ${videos[videos.length - 1].title}`)
        
        if (filter === 'popular') {
          console.log(`   - Views do primeiro: ${videos[0].viewCount}`)
        } else if (filter === 'liked') {
          console.log(`   - Likes do primeiro: ${videos[0].likesCount}`)
        } else if (filter === 'long') {
          console.log(`   - Duração do primeiro: ${videos[0].duration}s`)
        }
      }
    }

    // Testa busca por texto
    console.log('\n🔍 Testando busca por texto...')
    const searchVideos = await prisma.video.findMany({
      where: {
        title: {
          contains: 'video',
          mode: 'insensitive'
        }
      },
      take: 5,
      select: { id: true, title: true }
    })
    
    console.log(`   - Vídeos com "video" no título: ${searchVideos.length}`)
    searchVideos.forEach(video => {
      console.log(`     • ${video.title}`)
    })

    // Testa vídeos longos
    console.log('\n🔍 Testando vídeos longos...')
    const longVideos = await prisma.video.findMany({
      where: {
        duration: {
          gte: 600 // 10 minutos
        }
      },
      take: 5,
      select: { id: true, title: true, duration: true }
    })
    
    console.log(`   - Vídeos longos encontrados: ${longVideos.length}`)
    longVideos.forEach(video => {
      const minutes = Math.floor(video.duration / 60)
      const seconds = video.duration % 60
      console.log(`     • ${video.title} (${minutes}:${seconds.toString().padStart(2, '0')})`)
    })

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVideosAPI() 