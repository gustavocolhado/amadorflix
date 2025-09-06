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

    // Buscar estatísticas
    const [
      totalUsers,
      totalVideos,
      totalCreators,
      totalCategories,
      premiumUsers,
      totalViews
    ] = await Promise.all([
      prisma.user.count(),
      prismaVideos.video.count(),
      prismaVideos.creator.count(),
      prismaVideos.category.count(),
      prisma.user.count({ where: { premium: true } }),
      prismaVideos.video.aggregate({
        _sum: { viewCount: true }
      })
    ]);

    return NextResponse.json({
      totalUsers,
      totalVideos,
      totalCreators,
      totalCategories,
      premiumUsers,
      totalViews: totalViews._sum.viewCount || 0
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 