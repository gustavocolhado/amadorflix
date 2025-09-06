import { PrismaClient } from '@prisma/client'
import { PrismaClient as PrismaVideosClient } from '@prisma/videos-client'

// Cliente para o banco principal (usuários, pagamentos, etc.)
let prisma: PrismaClient;

if(process.env.NODE_ENV === "production"){
  prisma = new PrismaClient();
}else{
  let globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  }

  if(!globalWithPrisma.prisma){
    globalWithPrisma.prisma = new PrismaClient();
  }

  prisma = globalWithPrisma.prisma;
}

// Cliente para o banco de vídeos e criadores
let prismaVideos: PrismaVideosClient;

if(process.env.NODE_ENV === "production"){
  prismaVideos = new PrismaVideosClient();
}else{
  let globalWithPrismaVideos = global as typeof globalThis & {
    prismaVideos: PrismaVideosClient;
  }

  if(!globalWithPrismaVideos.prismaVideos){
    globalWithPrismaVideos.prismaVideos = new PrismaVideosClient();
  }

  prismaVideos = globalWithPrismaVideos.prismaVideos;
}

export { prisma, prismaVideos }

