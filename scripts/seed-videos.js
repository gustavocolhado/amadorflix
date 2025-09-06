const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleVideos = [
  {
    title: "Negrastransando gozando com piroca gostosa atolada na buceta",
    description: "Vídeo amador de sexo explícito",
    url: "https://example.com/video1",
    videoUrl: "https://example.com/video1.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+1",
    trailerUrl: "https://example.com/trailer1.mp4",
    isIframe: true,
    duration: 298, // 4:58 em segundos
    viewCount: 15420,
    likesCount: 1234,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  },
  {
    title: "Negrastransando gozando com plug no cu e consolo na bucetona",
    description: "Vídeo amador explícito",
    url: "https://example.com/video2",
    videoUrl: "https://example.com/video2.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+2",
    trailerUrl: "https://example.com/trailer2.mp4",
    isIframe: true,
    duration: 470, // 7:50 em segundos
    viewCount: 8920,
    likesCount: 567,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  },
  {
    title: "Negrastransando gozando de quatro no pau duro do ficante",
    description: "Vídeo amador de sexo",
    url: "https://example.com/video3",
    videoUrl: "https://example.com/video3.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+3",
    duration: 29, // 0:29 em segundos
    viewCount: 23450,
    likesCount: 1890,
    category: ["amador", "negras", "trans"],
    premium: true,
    creator: "Cremona"
  },
  {
    title: "Negrastransando gozando no cacete com popozão empinado",
    description: "Vídeo amador explícito",
    url: "https://example.com/video4",
    videoUrl: "https://example.com/video4.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+4",
    duration: 754, // 12:34 em segundos
    viewCount: 6780,
    likesCount: 432,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  },
  {
    title: "Negrastransando levando rola no cu com rabo tatuado empinado",
    description: "Vídeo amador de sexo",
    url: "https://example.com/video5",
    videoUrl: "https://example.com/video5.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+5",
    duration: 495, // 8:15 em segundos
    viewCount: 12340,
    likesCount: 890,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  },
  {
    title: "Negrastransando magrinha sentando gostoso na pica dura",
    description: "Vídeo amador explícito",
    url: "https://example.com/video6",
    videoUrl: "https://example.com/video6.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+6",
    duration: 402, // 6:42 em segundos
    viewCount: 9870,
    likesCount: 654,
    category: ["amador", "negras", "trans"],
    premium: true,
    creator: "Cremona"
  },
  {
    title: "Negrastransando magrinha dançando peladinha e safada",
    description: "Vídeo amador de sexo",
    url: "https://example.com/video7",
    videoUrl: "https://example.com/video7.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+7",
    duration: 201, // 3:21 em segundos
    viewCount: 15670,
    likesCount: 1234,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  },
  {
    title: "Negrastransando mamando e tocando a xota com rabo empinado",
    description: "Vídeo amador explícito",
    url: "https://example.com/video8",
    videoUrl: "https://example.com/video8.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+8",
    duration: 558, // 9:18 em segundos
    viewCount: 11230,
    likesCount: 789,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  },
  {
    title: "Negrastransando alisando corpo perfeito molhadinha no banho",
    description: "Vídeo amador de sexo",
    url: "https://example.com/video9",
    videoUrl: "https://example.com/video9.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+9",
    duration: 333, // 5:33 em segundos
    viewCount: 8760,
    likesCount: 543,
    category: ["amador", "negras", "trans"],
    premium: true,
    creator: "Cremona"
  },
  {
    title: "Negrastransando quicando na rola com peitos balançando",
    description: "Vídeo amador explícito",
    url: "https://example.com/video10",
    videoUrl: "https://example.com/video10.mp4",
    thumbnailUrl: "https://via.placeholder.com/320x180/ff0000/ffffff?text=Video+10",
    duration: 687, // 11:27 em segundos
    viewCount: 13450,
    likesCount: 987,
    category: ["amador", "negras", "trans"],
    premium: false,
    creator: "Cremona"
  }
]

async function seedVideos() {
  try {
    console.log('🌱 Iniciando seed de vídeos...')

    // Limpar vídeos existentes
    await prisma.video.deleteMany({})
    console.log('🗑️ Vídeos existentes removidos')

    // Inserir novos vídeos
    for (const video of sampleVideos) {
      await prisma.video.create({
        data: {
          title: video.title,
          description: video.description,
          url: video.url,
          videoUrl: video.videoUrl,
          thumbnailUrl: video.thumbnailUrl,
          trailerUrl: video.trailerUrl,
          isIframe: video.isIframe || false,
          duration: video.duration,
          viewCount: video.viewCount,
          likesCount: video.likesCount,
          category: video.category,
          premium: video.premium,
          creator: video.creator,
          created_at: new Date(),
          updated_at: new Date()
        }
      })
    }

    console.log(`✅ ${sampleVideos.length} vídeos inseridos com sucesso!`)
    
    // Verificar vídeos inseridos
    const count = await prisma.video.count()
    console.log(`📊 Total de vídeos no banco: ${count}`)

  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedVideos() 