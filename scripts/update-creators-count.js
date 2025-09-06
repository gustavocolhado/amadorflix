const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateCreatorsCount() {
  try {
    console.log('🔄 Atualizando contagem de vídeos dos criadores...')
    
    // Busca todos os criadores
    const creators = await prisma.creator.findMany()
    
    for (const creator of creators) {
      // Conta vídeos para este criador
      const videoCount = await prisma.video.count({
        where: {
          creator: creator.name
        }
      })
      
      // Atualiza a contagem no banco
      await prisma.creator.update({
        where: { id: creator.id },
        data: { qtd: videoCount }
      })
      
      console.log(`✅ ${creator.name}: ${videoCount} vídeos`)
    }
    
    console.log('🎉 Contagem de vídeos atualizada com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao atualizar contagem:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateCreatorsCount() 