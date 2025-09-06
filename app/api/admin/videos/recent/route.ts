import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';
import { prisma, prismaVideos } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Verificar se tem acesso admin (access = 1)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.access !== 1) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      );
    }

    // Buscar vídeos recentes
    const recentVideos = await prismaVideos.video.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        title: true,
        viewCount: true,
        likesCount: true,
        premium: true,
        created_at: true,
        thumbnailUrl: true,
        creator: true
      }
    });

    return NextResponse.json(recentVideos);

  } catch (error) {
    console.error('Erro ao buscar vídeos recentes:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 