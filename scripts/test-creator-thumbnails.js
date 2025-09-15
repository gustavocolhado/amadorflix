const { PrismaClient } = require('@prisma/videos-client')

async function testCreatorThumbnails() {
  const prismaVideos = new PrismaClient()
  
  try {
    console.log('🔍 Testando funcionalidade de thumbnails de creators...\n')
    
    // Buscar creators sem imagem
    const creatorsWithoutImage = await prismaVideos.creator.findMany({
      where: {
        image: null
      },
      take: 5
    })
    
    console.log(`📊 Encontrados ${creatorsWithoutImage.length} creators sem imagem:`)
    creatorsWithoutImage.forEach(creator => {
      console.log(`  - ${creator.name} (ID: ${creator.id})`)
    })
    
    console.log('\n🔍 Buscando thumbnails de vídeos para cada creator...\n')
    
    for (const creator of creatorsWithoutImage) {
      const firstVideo = await prismaVideos.video.findFirst({
        where: {
          creator: creator.name
        },
        select: {
          thumbnailUrl: true,
          title: true
        },
        orderBy: {
          created_at: 'desc'
        }
      })
      
      if (firstVideo) {
        console.log(`✅ ${creator.name}:`)
        console.log(`   📹 Vídeo: ${firstVideo.title}`)
        console.log(`   🖼️  Thumbnail: ${firstVideo.thumbnailUrl}`)
      } else {
        console.log(`❌ ${creator.name}: Nenhum vídeo encontrado`)
      }
      console.log('')
    }
    
    // Testar a API
    console.log('🌐 Testando API de creators...')
    const response = await fetch('http://localhost:3000/api/creators?page=1&limit=5')
    
    if (response.ok) {
      const data = await response.json()
      console.log('✅ API funcionando!')
      console.log(`📊 Retornou ${data.creators.length} creators`)
      
      data.creators.forEach(creator => {
        console.log(`  - ${creator.name}: ${creator.image ? '✅ Tem imagem' : '❌ Sem imagem'}`)
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

testCreatorThumbnails()
