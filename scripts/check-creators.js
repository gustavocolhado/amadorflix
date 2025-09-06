const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkCreators() {
  try {
    console.log('🔍 Verificando criadores no banco de dados...')
    
    const creators = await prisma.creator.findMany({
      orderBy: {
        qtd: 'desc'
      },
      take: 10
    })
    
    if (creators.length === 0) {
      console.log('❌ Nenhum criador encontrado no banco de dados.')
      console.log('💡 Execute o script seed-creators.js para popular o banco.')
    } else {
      console.log(`✅ Encontrados ${creators.length} criadores:`)
      creators.forEach((creator, index) => {
        console.log(`${index + 1}. ${creator.name} - ${creator.qtd || 0} vídeos`)
      })
    }
  } catch (error) {
    console.error('❌ Erro ao verificar criadores:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkCreators() 