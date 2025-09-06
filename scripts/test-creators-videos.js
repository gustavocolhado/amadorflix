const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testCreatorsVideos() {
  try {
    console.log('🧪 Testando relação entre criadores e vídeos...')
    
    // Busca todos os criadores
    const creators = await prisma.creator.findMany({
      orderBy: { qtd: 'desc' },
      take: 5
    })
    
    console.log(`\n📊 Encontrados ${creators.length} criadores:`)
    
    for (const creator of creators) {
      console.log(`\n👤 ${creator.name}:`)
      console.log(`   - ID: ${creator.id}`)
      console.log(`   - Qtd no banco: ${creator.qtd || 0}`)
      
      // Conta vídeos reais
      const videoCount = await prisma.video.count({
        where: { creator: creator.name }
      })
      
      console.log(`   - Vídeos reais: ${videoCount}`)
      
      // Busca alguns vídeos de exemplo
      const sampleVideos = await prisma.video.findMany({
        where: { creator: creator.name },
        select: { id: true, title: true, url: true },
        take: 3
      })
      
      if (sampleVideos.length > 0) {
        console.log(`   - Exemplos de vídeos:`)
        sampleVideos.forEach(video => {
          console.log(`     • ${video.title} (${video.url})`)
        })
      } else {
        console.log(`   - Nenhum vídeo encontrado`)
      }
      
      // Verifica se há discrepância
      if (creator.qtd !== videoCount) {
        console.log(`   ⚠️  DISCREPÂNCIA: qtd=${creator.qtd}, real=${videoCount}`)
      }
    }
    
    // Testa busca de vídeos por criador
    if (creators.length > 0) {
      const testCreator = creators[0]
      console.log(`\n🔍 Testando API para criador: ${testCreator.name}`)
      
      const videos = await prisma.video.findMany({
        where: { creator: testCreator.name },
        orderBy: { created_at: 'desc' },
        take: 5,
        select: {
          id: true,
          title: true,
          url: true,
          viewCount: true,
          created_at: true
        }
      })
      
      console.log(`   - Encontrados ${videos.length} vídeos`)
      videos.forEach(video => {
        console.log(`     • ${video.title} (${video.viewCount} views)`)
      })
    }
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testCreatorsVideos() 