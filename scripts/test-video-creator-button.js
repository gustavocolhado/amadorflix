const { PrismaClient } = require('@prisma/videos-client')

async function testVideoCreatorButton() {
  const prismaVideos = new PrismaClient()
  
  try {
    console.log('🔍 Testando funcionalidade do botão "Ver criador" nos vídeos...\n')
    
    // Buscar alguns vídeos
    const videos = await prismaVideos.video.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        creator: true
      }
    })
    
    console.log(`📊 Encontrados ${videos.length} vídeos:`)
    
    for (const video of videos) {
      console.log(`\n📹 Vídeo: ${video.title}`)
      console.log(`   Creator: ${video.creator || 'Nenhum'}`)
      
      if (video.creator) {
        // Buscar o creator
        const creator = await prismaVideos.creator.findUnique({
          where: { name: video.creator },
          select: { id: true, name: true }
        })
        
        if (creator) {
          console.log(`   ✅ Creator encontrado: ${creator.name} (ID: ${creator.id})`)
          console.log(`   🔗 URL do creator: /creators/${creator.id}`)
        } else {
          console.log(`   ❌ Creator não encontrado no banco`)
        }
      } else {
        console.log(`   ⚠️  Vídeo sem creator`)
      }
    }
    
    // Testar a API de vídeos
    console.log('\n🌐 Testando API de vídeos...')
    const response = await fetch('http://localhost:3000/api/videos?page=1&limit=3')
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API funcionando!')
      console.log(`📊 Retornou ${data.videos.length} vídeos`)
      
      data.videos.forEach(video => {
        console.log(`\n📹 ${video.title}`)
        console.log(`   Creator: ${video.creator || 'Nenhum'}`)
        console.log(`   CreatorId: ${video.creatorId || 'Nenhum'}`)
        if (video.creatorId) {
          console.log(`   🔗 Botão "Ver criador" disponível`)
        } else {
          console.log(`   ⚠️  Botão "Ver criador" não disponível`)
        }
      })
    } else {
      console.log('❌ Erro na API:', response.status)
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    await prismaVideos.$disconnect()
  }
}

testVideoCreatorButton()
