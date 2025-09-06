const { PrismaClient } = require('@prisma/client')
const { PrismaClient: PrismaVideosClient } = require('@prisma/videos-client')

async function migrateToDualDatabase() {
  console.log('🔄 Iniciando migração para dois bancos de dados...\n')

  const prisma = new PrismaClient()
  const prismaVideos = new PrismaVideosClient()

  try {
    // Conectar aos bancos
    await prisma.$connect()
    await prismaVideos.$connect()
    console.log('✅ Conectado aos dois bancos de dados\n')

    // Migrar vídeos
    console.log('🎬 Migrando vídeos...')
    try {
      const videos = await prisma.video.findMany()
      console.log(`📊 Encontrados ${videos.length} vídeos para migrar`)
      
      for (const video of videos) {
        await prismaVideos.video.create({
          data: {
            id: video.id,
            title: video.title,
            title_en: video.title_en,
            title_es: video.title_es,
            category: video.category,
            description: video.description,
            description_en: video.description_en,
            description_es: video.description_es,
            url: video.url,
            url_en: video.url_en,
            url_es: video.url_es,
            viewCount: video.viewCount,
            likesCount: video.likesCount,
            videoUrl: video.videoUrl,
            thumbnailUrl: video.thumbnailUrl,
            duration: video.duration,
            premium: video.premium,
            creator: video.creator,
            iframe: video.iframe,
            trailerUrl: video.trailerUrl,
            created_at: video.created_at,
            updated_at: video.updated_at,
            userId: video.userId
          }
        })
      }
      console.log('✅ Vídeos migrados com sucesso\n')
    } catch (error) {
      console.error('❌ Erro ao migrar vídeos:', error.message)
    }

    // Migrar criadores
    console.log('👥 Migrando criadores...')
    try {
      const creators = await prisma.creator.findMany()
      console.log(`📊 Encontrados ${creators.length} criadores para migrar`)
      
      for (const creator of creators) {
        await prismaVideos.creator.create({
          data: {
            id: creator.id,
            name: creator.name,
            qtd: creator.qtd,
            description: creator.description,
            image: creator.image,
            created_at: creator.created_at,
            update_at: creator.update_at,
            userId: creator.userId
          }
        })
      }
      console.log('✅ Criadores migrados com sucesso\n')
    } catch (error) {
      console.error('❌ Erro ao migrar criadores:', error.message)
    }

    // Migrar categorias
    console.log('📂 Migrando categorias...')
    try {
      const categories = await prisma.category.findMany()
      console.log(`📊 Encontradas ${categories.length} categorias para migrar`)
      
      for (const category of categories) {
        await prismaVideos.category.create({
          data: {
            id: category.id,
            name: category.name,
            qtd: category.qtd,
            images: category.images,
            slug: category.slug,
            created_at: category.created_at,
            updated_at: category.updated_at,
            userId: category.userId
          }
        })
      }
      console.log('✅ Categorias migradas com sucesso\n')
    } catch (error) {
      console.error('❌ Erro ao migrar categorias:', error.message)
    }

    // Migrar tags
    console.log('🏷️ Migrando tags...')
    try {
      const tags = await prisma.tag.findMany()
      console.log(`📊 Encontradas ${tags.length} tags para migrar`)
      
      for (const tag of tags) {
        await prismaVideos.tag.create({
          data: {
            id: tag.id,
            name: tag.name,
            qtd: tag.qtd,
            slug: tag.slug,
            createdAt: tag.createdAt,
            updatedAt: tag.updatedAt
          }
        })
      }
      console.log('✅ Tags migradas com sucesso\n')
    } catch (error) {
      console.error('❌ Erro ao migrar tags:', error.message)
    }

    console.log('🎉 Migração concluída com sucesso!')
    console.log('⚠️  IMPORTANTE: Verifique os dados antes de remover do banco original!')

  } catch (error) {
    console.error('❌ Erro durante a migração:', error)
  } finally {
    await prisma.$disconnect()
    await prismaVideos.$disconnect()
  }
}

// Executar a migração
migrateToDualDatabase().catch(console.error)

