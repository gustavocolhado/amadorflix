const { PrismaClient } = require('@prisma/client')
const { PrismaClient: PrismaVideosClient } = require('@prisma/videos-client')

async function testDatabases() {
  console.log('🧪 Testando configuração de dois bancos de dados...\n')

  // Teste do banco principal
  console.log('📊 Testando banco principal (DATABASE_URL)...')
  try {
    const prisma = new PrismaClient()
    
    // Teste de conexão
    await prisma.$connect()
    console.log('✅ Conexão com banco principal estabelecida')
    
    // Teste de query simples
    const userCount = await prisma.user.count()
    console.log(`✅ Usuários encontrados: ${userCount}`)
    
    await prisma.$disconnect()
    console.log('✅ Banco principal funcionando corretamente\n')
  } catch (error) {
    console.error('❌ Erro no banco principal:', error.message)
  }

  // Teste do banco de vídeos
  console.log('🎬 Testando banco de vídeos (DATABASE_VIDEOS)...')
  try {
    const prismaVideos = new PrismaVideosClient()
    
    // Teste de conexão
    await prismaVideos.$connect()
    console.log('✅ Conexão com banco de vídeos estabelecida')
    
    // Teste de query simples
    const videoCount = await prismaVideos.video.count()
    console.log(`✅ Vídeos encontrados: ${videoCount}`)
    
    const creatorCount = await prismaVideos.creator.count()
    console.log(`✅ Criadores encontrados: ${creatorCount}`)
    
    await prismaVideos.$disconnect()
    console.log('✅ Banco de vídeos funcionando corretamente\n')
  } catch (error) {
    console.error('❌ Erro no banco de vídeos:', error.message)
  }

  console.log('🎉 Teste de configuração concluído!')
}

// Executar o teste
testDatabases().catch(console.error)

