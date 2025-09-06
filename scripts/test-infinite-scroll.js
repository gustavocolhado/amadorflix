const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testInfiniteScroll() {
  try {
    console.log('🧪 Testando infinite scroll de criadores...')

    // Conta total de criadores
    const totalCreators = await prisma.creator.count()
    console.log(`📊 Total de criadores no banco: ${totalCreators}`)

    // Testa diferentes páginas
    const pages = [1, 2, 3]
    const limit = 12

    for (const page of pages) {
      const skip = (page - 1) * limit
      const hasMore = page * limit < totalCreators
      
      console.log(`\n📄 Página ${page}:`)
      console.log(`   - Skip: ${skip}`)
      console.log(`   - Limit: ${limit}`)
      console.log(`   - HasMore: ${hasMore}`)

      const creators = await prisma.creator.findMany({
        orderBy: { qtd: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          qtd: true
        }
      })

      console.log(`   - Criadores retornados: ${creators.length}`)
      
      if (creators.length > 0) {
        console.log(`   - Primeiro criador: ${creators[0].name} (${creators[0].qtd} vídeos)`)
        console.log(`   - Último criador: ${creators[creators.length - 1].name} (${creators[creators.length - 1].qtd} vídeos)`)
      }
    }

    // Testa API endpoint
    console.log('\n🔍 Testando API endpoint...')
    
    const testPage = 1
    const response = await fetch(`http://localhost:3000/api/creators?page=${testPage}&limit=${limit}`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`   ✅ API funcionando`)
      console.log(`   - Criadores: ${data.creators?.length || 0}`)
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

testInfiniteScroll() 