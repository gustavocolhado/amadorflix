const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function updateVideosWithTrailer() {
  try {
    console.log('🔄 Iniciando atualização dos vídeos existentes...')

    // Buscar todos os vídeos que não têm trailerUrl definida
    const videosWithoutTrailer = await prisma.video.findMany({
      where: {
        OR: [
          { trailerUrl: null },
          { trailerUrl: '' }
        ]
      },
      select: {
        id: true,
        title: true,
        iframe: true,
        trailerUrl: true
      }
    })

    console.log(`📊 Encontrados ${videosWithoutTrailer.length} vídeos sem trailer`)

    // Atualizar vídeos com trailerUrl padrão (exemplo)
    let updatedCount = 0
    for (const video of videosWithoutTrailer) {
      // Exemplo: definir alguns vídeos como iframe com trailer
      // Você pode personalizar essa lógica conforme necessário
      const shouldBeIframe = Math.random() < 0.3 // 30% dos vídeos serão iframe
      
      let trailerUrl = null
             if (shouldBeIframe) {
         // Exemplo de URL de trailer (substitua pelos seus vídeos reais)
         trailerUrl = "https://example.com/trailer.mp4"
       }

      await prisma.video.update({
        where: { id: video.id },
        data: {
          iframe: shouldBeIframe,
          trailerUrl: trailerUrl
        }
      })

      updatedCount++
      if (updatedCount % 100 === 0) {
        console.log(`✅ Atualizados ${updatedCount} vídeos...`)
      }
    }

    console.log(`✅ Total de ${updatedCount} vídeos atualizados com sucesso!`)

    // Estatísticas finais
    const totalVideos = await prisma.video.count()
    const iframeVideos = await prisma.video.count({
      where: { iframe: true }
    })
    const videosWithTrailer = await prisma.video.count({
      where: {
        trailerUrl: {
          not: null
        }
      }
    })

    console.log('\n📊 Estatísticas finais:')
    console.log(`📹 Total de vídeos: ${totalVideos}`)
    console.log(`🎬 Vídeos iframe: ${iframeVideos}`)
    console.log(`🎥 Vídeos com trailer: ${videosWithTrailer}`)

  } catch (error) {
    console.error('❌ Erro ao atualizar vídeos:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Função para definir trailers personalizados
async function setCustomTrailers() {
  try {
    console.log('🎬 Definindo trailers personalizados...')

    // Exemplo: definir trailers para vídeos específicos
         const customTrailers = [
       {
         title: "Negrastransando",
         trailerUrl: "https://example.com/trailer-negrastransando.mp4"
       },
       // Adicione mais vídeos conforme necessário
     ]

    for (const trailer of customTrailers) {
      const updated = await prisma.video.updateMany({
        where: {
          title: {
            contains: trailer.title,
            mode: 'insensitive'
          }
        },
        data: {
          iframe: true,
          trailerUrl: trailer.trailerUrl
        }
      })

      console.log(`✅ ${updated.count} vídeos com "${trailer.title}" atualizados`)
    }

  } catch (error) {
    console.error('❌ Erro ao definir trailers personalizados:', error)
  }
}

// Executar as funções
async function main() {
  console.log('🚀 Iniciando atualização do banco de dados...\n')
  
  await updateVideosWithTrailer()
  console.log('\n' + '='.repeat(50) + '\n')
  await setCustomTrailers()
  
  console.log('\n🎉 Atualização concluída!')
}

main() 