const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const creators = [
  {
    name: 'Catarina Paolino',
    qtd: 45,
    description: 'Criadora de conteúdo digital',
    image: '/creators/catarina-paolino.jpg'
  },
  {
    name: 'MC Pipokinha',
    qtd: 32,
    description: 'Cantora e influenciadora',
    image: '/creators/mc-pipokinha.jpg'
  },
  {
    name: 'Kinechan',
    qtd: 28,
    description: 'Streamer e criadora de conteúdo',
    image: '/creators/kinechan.jpg'
  },
  {
    name: 'Juliana Bonde',
    qtd: 56,
    description: 'Influenciadora digital',
    image: '/creators/juliana-bonde.jpg'
  },
  {
    name: 'Professora Cibelly',
    qtd: 23,
    description: 'Criadora de conteúdo educacional',
    image: '/creators/professora-cibelly.jpg'
  },
  {
    name: 'Belle Belinha',
    qtd: 41,
    description: 'Influenciadora e criadora',
    image: '/creators/belle-belinha.jpg'
  },
  {
    name: 'Kerolay Chaves',
    qtd: 19,
    description: 'Criadora de conteúdo',
    image: '/creators/kerolay-chaves.jpg'
  },
  {
    name: 'Andressa Urach',
    qtd: 67,
    description: 'Influenciadora e modelo',
    image: '/creators/andressa-urach.jpg'
  },
  {
    name: 'MC Mirella',
    qtd: 34,
    description: 'Cantora e influenciadora',
    image: '/creators/mc-mirella.jpg'
  },
  {
    name: 'Cibelly Ferreira',
    qtd: 29,
    description: 'Criadora de conteúdo',
    image: '/creators/cibelly-ferreira.jpg'
  }
]

async function seedCreators() {
  try {
    console.log('🌱 Iniciando seed de criadores...')
    
    for (const creator of creators) {
      const existingCreator = await prisma.creator.findUnique({
        where: { name: creator.name }
      })
      
      if (!existingCreator) {
        await prisma.creator.create({
          data: creator
        })
        console.log(`✅ Criador "${creator.name}" criado com sucesso`)
      } else {
        console.log(`⏭️ Criador "${creator.name}" já existe, pulando...`)
      }
    }
    
    console.log('🎉 Seed de criadores concluído!')
  } catch (error) {
    console.error('❌ Erro durante o seed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedCreators() 