import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendPaymentConfirmationEmail, PaymentConfirmationEmailData } from '@/lib/email';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface FinalizeAccountRequest {
  userId: string;
  password: string;
  confirmPassword: string;
}

// Função para obter nome do plano
function getPlanName(planId: string): string {
  switch (planId) {
    case '12months':
      return 'Plano Anual (12 meses)';
    case '1month':
      return 'Plano Mensal (1 mês)';
    case '7days':
      return 'Plano Semanal (7 dias)';
    case 'weekly':
      return 'Plano Semanal (7 dias)';
    default:
      return 'Plano Premium';
  }
}

// Função para obter duração do plano em dias
function getPlanDurationInDays(planId: string): number {
  switch (planId) {
    case '12months':
      return 365;
    case '1month':
      return 30;
    case '7days':
    case 'weekly':
      return 7;
    default:
      return 30;
  }
}

// Função para formatar data
function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: FinalizeAccountRequest = await request.json();
    const { userId, password, confirmPassword } = body;

    // Validar dados
    if (!userId || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'As senhas não coincidem' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'A senha deve ter pelo menos 6 caracteres' },
        { status: 400 }
      );
    }

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        pixPayments: {
          where: { status: 'paid' },
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

    // Verificar se o usuário já tem senha definida
    if (user.password && user.password.length > 0) {
      return NextResponse.json(
        { error: 'Conta já foi finalizada' },
        { status: 400 }
      );
    }

    // Verificar se há pagamento confirmado
    const latestPayment = user.pixPayments[0];
    if (!latestPayment || latestPayment.status !== 'paid') {
      return NextResponse.json(
        { error: 'Nenhum pagamento confirmado encontrado' },
        { status: 400 }
      );
    }

    // Criptografar senha
    const hashedPassword = await bcrypt.hash(password, 12);

    // Atualizar usuário com senha
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        paymentStatus: 'paid'
      }
    });

    console.log('✅ Conta finalizada com sucesso:', {
      userId: updatedUser.id,
      email: updatedUser.email,
      planId: latestPayment.planId
    });

    // Enviar email de confirmação
    try {
      const emailData: PaymentConfirmationEmailData = {
        userEmail: user.email || '',
        userName: user.name || 'Usuário',
        userPassword: password, // Senha em texto claro para o email
        planName: getPlanName(latestPayment.planId),
        planDuration: `${getPlanDurationInDays(latestPayment.planId)} dias`,
        expireDate: formatDate(user.expireDate || new Date()),
        telegramChannel: process.env.TELEGRAM_CHANNEL || 'https://t.me/amadorflixvip',
        telegramBot: process.env.TELEGRAM_BOT || 'https://t.me/amadorflixbot',
        loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`
      };

      const emailSent = await sendPaymentConfirmationEmail(emailData);
      
      if (emailSent) {
        console.log('✅ Email de confirmação enviado para:', user.email);
      } else {
        console.error('❌ Falha ao enviar email de confirmação para:', user.email);
      }
    } catch (emailError) {
      console.error('❌ Erro ao enviar email de confirmação:', emailError);
      // Não falhar a finalização por causa do email
    }

    return NextResponse.json({
      success: true,
      message: 'Conta finalizada com sucesso! Verifique seu email para as credenciais.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      }
    });

  } catch (error) {
    console.error('Erro ao finalizar conta:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
