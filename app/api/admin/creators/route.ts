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

    // Buscar todos os creators
    const creators = await prismaVideos.creator.findMany({
      orderBy: { created_at: 'desc' }
    });

    // Formatar dados
    const formattedCreators = creators.map(creator => ({
      id: creator.id,
      name: creator.name,
      description: creator.description,
      image: creator.image,
      qtd: creator.qtd || 0,
      created_at: creator.created_at,
      update_at: creator.update_at
    }));

    return NextResponse.json(formattedCreators);

  } catch (error) {
    console.error('Erro ao buscar creators:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { name, description, image } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar se já existe um creator com este nome
    const existingCreator = await prismaVideos.creator.findUnique({
      where: { name }
    });

    if (existingCreator) {
      return NextResponse.json(
        { error: 'Já existe um creator com este nome' },
        { status: 400 }
      );
    }

    // Criar novo creator
    const creator = await prismaVideos.creator.create({
      data: {
        name,
        description,
        image,
        userId: user.id
      }
    });

    return NextResponse.json(creator);

  } catch (error) {
    console.error('Erro ao criar creator:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 