import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface WebhookPayload {
  id: string;
  status: string;
  value: number;
  end_to_end_id?: string;
  payer_name?: string;
  payer_national_registration?: string;
}

// Função para calcular a data de expiração da assinatura
function calculateExpirationDate(planId: string): Date {
  const now = new Date();
  let daysToAdd = 30; // padrão 1 mês

  switch (planId) {
    case '12months':
      daysToAdd = 365; // 12 meses
      break;
    case '1month':
      daysToAdd = 30; // 1 mês
      break;
    case '7days':
      daysToAdd = 7; // 7 dias
      break;
  }

  return new Date(now.getTime() + daysToAdd * 24 * 60 * 60 * 1000);
}

// Função para ativar o acesso premium via webhook
async function activatePremiumAccessViaWebhook(pixId: string, statusData: WebhookPayload) {
  try {
    // Buscar o pagamento PIX no banco
    const pixPayment = await prisma.pixPayment.findUnique({
      where: { pixId },
      include: { user: true }
    });

    if (!pixPayment) {
      console.error('Pagamento PIX não encontrado no webhook:', pixId);
      return false;
    }

    // Verificar se já foi processado
    if (pixPayment.status === 'paid') {
      console.log('Pagamento já foi processado via webhook:', pixId);
      return true;
    }

    // Calcular data de expiração da assinatura
    const expireDate = calculateExpirationDate(pixPayment.planId);

    // Atualizar o pagamento PIX
    await prisma.pixPayment.update({
      where: { pixId },
      data: {
        status: 'paid',
        endToEndId: statusData.end_to_end_id,
        payerName: statusData.payer_name,
        payerDocument: statusData.payer_national_registration,
        paidAt: new Date(),
      }
    });

    // Verificar se userId existe
    if (!pixPayment.userId) {
      console.error('userId não encontrado para o pagamento PIX no webhook:', pixId);
      return false;
    }

    // Atualizar o usuário para premium
    await prisma.user.update({
      where: { id: pixPayment.userId },
      data: {
        premium: true,
        paymentStatus: 'paid',
        paymentDate: new Date(),
        expireDate: expireDate,
        paymentId: parseInt(pixId.replace(/-/g, '').substring(0, 8), 16),
      }
    });

    // Criar registro no modelo Payment para histórico
    await prisma.payment.create({
      data: {
        userId: pixPayment.userId,
        plan: pixPayment.planId,
        amount: pixPayment.amount,
        userEmail: pixPayment.userEmail,
        status: 'paid',
        paymentId: parseInt(pixId.replace(/-/g, '').substring(0, 8), 16),
        duration: getPlanDurationInDays(pixPayment.planId),
      }
    });

    console.log('Acesso premium ativado via webhook:', {
      userId: pixPayment.userId,
      email: pixPayment.userEmail,
      planId: pixPayment.planId,
      expireDate: expireDate,
      pixId: pixId
    });

    return true;
  } catch (error) {
    console.error('Erro ao ativar acesso premium via webhook:', error);
    return false;
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
      return 7;
    default:
      return 30;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Log the raw request details for debugging
    console.log('Webhook request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Webhook request method:', request.method);
    
    // Get the raw body as text first
    const rawBody = await request.text();
    console.log('Raw webhook body:', rawBody);
    
    let body: WebhookPayload;
    
    // Try to parse as JSON
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('Failed to parse webhook body as JSON:', parseError);
      console.error('Raw body that failed to parse:', rawBody);
      
      // Try to handle different content types
      const contentType = request.headers.get('content-type');
      console.log('Content-Type header:', contentType);
      
      // If it's form data, try to parse it
      if (contentType?.includes('application/x-www-form-urlencoded')) {
        const urlParams = new URLSearchParams(rawBody);
        body = {
          id: urlParams.get('id') || '',
          status: urlParams.get('status') || '',
          value: parseInt(urlParams.get('value') || '0'),
          end_to_end_id: urlParams.get('end_to_end_id') || undefined,
          payer_name: urlParams.get('payer_name') || undefined,
          payer_national_registration: urlParams.get('payer_national_registration') || undefined,
        };
      } else {
        // Return error for unparseable data
        return NextResponse.json(
          { error: 'Invalid webhook payload format' },
          { status: 400 }
        );
      }
    }

    const { id, status, value, end_to_end_id, payer_name, payer_national_registration } = body;

    console.log('Webhook recebido:', {
      pixId: id,
      status,
      value,
      endToEndId: end_to_end_id,
      payerName: payer_name,
      payerDocument: payer_national_registration
    });

    // Verificar se o pagamento foi confirmado
    if (status === 'paid') {
      console.log('Pagamento confirmado via webhook:', id);
      
      // Ativar acesso premium
      const activated = await activatePremiumAccessViaWebhook(id, {
        id,
        status,
        value,
        end_to_end_id,
        payer_name,
        payer_national_registration
      });

      if (!activated) {
        console.error('Falha ao ativar acesso premium via webhook:', id);
        return NextResponse.json(
          { error: 'Erro ao processar pagamento' },
          { status: 500 }
        );
      }
    }

    // Retornar sucesso para a PushinPay
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 