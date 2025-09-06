const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function checkSpecificVideo() {
  try {
    const videoId = '67bbf4fa4ad322e57cef257f'
    
    console.log('🔍 Verificando vídeo específico...')
    
    const video = await prisma.video.findUnique({
      where: { id: videoId },
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
    
    if (video) {
      console.log('✅ Vídeo encontrado!')
      console.log('📋 Dados do vídeo:')
      console.log(`   ID: ${video.id}`)
      console.log(`   URL: ${video.url}`)
      console.log(`   Título: ${video.title}`)
      console.log(`   Video URL: ${video.videoUrl}`)
      console.log(`   Thumbnail: ${video.thumbnailUrl}`)
      console.log(`   Iframe: ${video.iframe}`)
      console.log(`   Trailer: ${video.trailerUrl || 'N/A'}`)
      console.log(`   Duration: ${video.duration}`)
      console.log(`   View Count: ${video.viewCount}`)
      console.log(`   Likes Count: ${video.likesCount}`)
      console.log(`   Premium: ${video.premium}`)
      console.log(`   Creator: ${video.creator}`)
      console.log(`   Categories: ${video.category.join(', ')}`)
      console.log(`   Tags: ${video.videoTags.map(vt => vt.tag.name).join(', ')}`)
      console.log(`   Uploader: ${video.User?.name || 'N/A'}`)
      console.log(`   Created: ${video.created_at}`)
      
      // Verificar se as URLs são válidas
      console.log('\n🔗 Verificação de URLs:')
      console.log(`   Video URL válida: ${video.videoUrl && video.videoUrl.length > 0 ? '✅' : '❌'}`)
      console.log(`   Thumbnail URL válida: ${video.thumbnailUrl && video.thumbnailUrl.length > 0 ? '✅' : '❌'}`)
      
      // Verificar se precisa de NEXT_PUBLIC_MEDIA_URL
      const needsMediaUrl = !video.iframe && (video.videoUrl.startsWith('/') || video.thumbnailUrl.startsWith('/'))
      console.log(`   Precisa de NEXT_PUBLIC_MEDIA_URL: ${needsMediaUrl ? '✅' : '❌'}`)
      
    } else {
      console.log('❌ Vídeo não encontrado')
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar vídeo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkSpecificVideo() 