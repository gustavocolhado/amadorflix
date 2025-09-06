const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testVideosPagination() {
  try {
    console.log('🧪 Testando paginação de vídeos...')

    // Conta total de vídeos
    const totalVideos = await prisma.video.count()
    console.log(`📊 Total de vídeos no banco: ${totalVideos}`)

    // Testa diferentes páginas
    const pages = [1, 2, 3]
    const limit = 12

    for (const page of pages) {
      const skip = (page - 1) * limit
      const hasMore = page * limit < totalVideos
      
      console.log(`\n📄 Página ${page}:`)
      console.log(`   - Skip: ${skip}`)
      console.log(`   - Limit: ${limit}`)
      console.log(`   - HasMore: ${hasMore}`)

      const videos = await prisma.video.findMany({
        orderBy: { created_at: 'desc' },
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
        console.log(`   - Primeiro vídeo: ${videos[0].title}`)
        console.log(`   - Último vídeo: ${videos[videos.length - 1].title}`)
      }
    }

    // Testa diferentes filtros com paginação
    console.log('\n🔍 Testando filtros com paginação...')
    
    const filters = ['recent', 'popular', 'liked']
    
    for (const filter of filters) {
      console.log(`\n   Filtro: ${filter}`)
      
      let orderBy = {}
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
      }

      const videos = await prisma.video.findMany({
        orderBy,
        skip: 0,
        take: limit,
        select: {
          id: true,
          title: true,
          viewCount: true,
          likesCount: true
        }
      })

      console.log(`   - Vídeos retornados: ${videos.length}`)
      
      if (videos.length > 0) {
        if (filter === 'popular') {
          console.log(`   - Views do primeiro: ${videos[0].viewCount}`)
        } else if (filter === 'liked') {
          console.log(`   - Likes do primeiro: ${videos[0].likesCount}`)
        }
      }
    }

    // Testa busca com paginação
    console.log('\n🔍 Testando busca com paginação...')
    
    const searchTerm = 'video'
    const searchVideos = await prisma.video.findMany({
      where: {
        title: {
          contains: searchTerm,
          mode: 'insensitive'
        }
      },
      orderBy: { created_at: 'desc' },
      skip: 0,
      take: limit,
      select: {
        id: true,
        title: true
      }
    })
    
    console.log(`   - Vídeos com "${searchTerm}" no título: ${searchVideos.length}`)
    if (searchVideos.length > 0) {
      console.log(`   - Primeiro resultado: ${searchVideos[0].title}`)
    }

    // Testa API endpoint
    console.log('\n🔍 Testando API endpoint...')
    
    const testPage = 1
    const response = await fetch(`http://localhost:3000/api/videos?page=${testPage}&limit=${limit}&filter=recent`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ API funcionando`)
      console.log(`   - Vídeos: ${data.videos?.length || 0}`)
      console.log(`   - Paginação:`, data.pagination)
    } else {
      console.log(`   ❌ Erro na API: ${response.status}`)
    }

  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVideosPagination() 