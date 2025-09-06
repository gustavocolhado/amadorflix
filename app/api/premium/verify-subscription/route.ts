import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      );
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        pixPayments: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      );
    }

    // Verificar se a assinatura expirou
    let isPremium = user.premium;
    let isExpired = false;
    let daysUntilExpiration = 0;

    if (user.premium && user.expireDate) {
      const now = new Date();
      const expireDate = new Date(user.expireDate);
      
      if (now > expireDate) {
        // Assinatura expirou
        isPremium = false;
        isExpired = true;
        
        // Atualizar status no banco
        await prisma.user.update({
          where: { id: user.id },
          data: {
            premium: false,
            paymentStatus: 'expired'
          }
        });
      } else {
        // Calcular dias até expiração
        const diffTime = expireDate.getTime() - now.getTime();
        daysUntilExpiration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
    }

    // Buscar último pagamento
    const lastPayment = user.pixPayments[0];

    return NextResponse.json({
      isPremium,
      isExpired,
      daysUntilExpiration,
      expireDate: user.expireDate,
      paymentStatus: user.paymentStatus,
      lastPayment: lastPayment ? {
        planId: lastPayment.planId,
        amount: lastPayment.amount,
        status: lastPayment.status,
        paidAt: lastPayment.paidAt,
        createdAt: lastPayment.createdAt
      } : null,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        premium: isPremium,
        paymentDate: user.paymentDate,
        expireDate: user.expireDate
      }
    });

  } catch (error) {
    console.error('Erro ao verificar assinatura:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 