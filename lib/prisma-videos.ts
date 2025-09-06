import { PrismaClient } from '@prisma/client'

// Configuração para o banco de vídeos e criadores
let prismaVideos: PrismaClient;

if(process.env.NODE_ENV === "production"){
  prismaVideos = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_VIDEOS
      }
    }
  });
}else{
  let globalWithPrismaVideos = global as typeof globalThis & {
    prismaVideos: PrismaClient;
  }

  if(!globalWithPrismaVideos.prismaVideos){
    globalWithPrismaVideos.prismaVideos = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_VIDEOS
        }
      }
    });
  }

  prismaVideos = globalWithPrismaVideos.prismaVideos;
}

export { prismaVideos }

