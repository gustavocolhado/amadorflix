const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testando conexão com o banco de dados...')
    
    // Testar conexão
    await prisma.$connect()
    console.log('✅ Conexão estabelecida com sucesso!')
    
    // Contar vídeos
    const videoCount = await prisma.video.count()
    console.log(`📊 Total de vídeos no banco: ${videoCount}`)
    
    // Buscar um vídeo de exemplo
    const sampleVideo = await prisma.video.findFirst({
      include: {
        User: {
          select: {
            id: true,
            name: true,
            username: true
          }
        },
        videoTags: {
          include: {
            tag: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })
    
    if (sampleVideo) {
      console.log('🎬 Vídeo de exemplo encontrado:')
      console.log('- ID:', sampleVideo.id)
      console.log('- Título:', sampleVideo.title)
      console.log('- URL:', sampleVideo.url)
      console.log('- Categorias:', sampleVideo.category)
      console.log('- Tags:', sampleVideo.videoTags.map(vt => vt.tag.name))
      console.log('- Uploader:', sampleVideo.User?.name || 'N/A')
    } else {
      console.log('❌ Nenhum vídeo encontrado no banco')
    }
    
  } catch (error) {
    console.error('❌ Erro ao testar banco de dados:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase() 