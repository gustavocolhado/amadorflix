import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PUSHINPAY_CONFIG } from '@/config/pushinpay';

const prisma = new PrismaClient();

interface CheckStatusRequest {
  pixId: string;
}

interface PushinPayStatusResponse {
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

// Função para ativar o acesso premium
async function activatePremiumAccess(pixId: string, statusData: PushinPayStatusResponse) {
  try {
    // Buscar o pagamento PIX no banco
    const pixPayment = await prisma.pixPayment.findUnique({
      where: { pixId },
      include: { user: true }
    });

    if (!pixPayment) {
      console.error('Pagamento PIX não encontrado:', pixId);
      return false;
    }

    // Verificar se já foi processado
    if (pixPayment.status === 'paid') {
      console.log('Pagamento já foi processado:', pixId);
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
      console.error('userId não encontrado para o pagamento PIX:', pixId);
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

    console.log('Acesso premium ativado:', {
      userId: pixPayment.userId,
      email: pixPayment.userEmail,
      planId: pixPayment.planId,
      expireDate: expireDate,
      pixId: pixId
    });

    return true;
  } catch (error) {
    console.error('Erro ao ativar acesso premium:', error);
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
    const body: CheckStatusRequest = await request.json();
    const { pixId } = body;

    if (!pixId) {
      return NextResponse.json(
        { error: 'ID do PIX é obrigatório' },
        { status: 400 }
      );
    }

    if (!PUSHINPAY_CONFIG.TOKEN) {
      console.error('PUSHINPAY_TOKEN não configurado');
      return NextResponse.json(
        { error: 'Erro de configuração do sistema' },
        { status: 500 }
      );
    }

    // Consultar status na PushinPay
    // URL correta para consulta: https://api.pushinpay.com.br/api/transactions/{ID}
    const baseUrl = PUSHINPAY_CONFIG.API_URL.replace('/api/pix/cashIn', '/api/transactions');
    const statusUrl = `${baseUrl}/${pixId}`;
    
    console.log('Consultando status do PIX:', {
      pixId,
      url: statusUrl
    });

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PUSHINPAY_CONFIG.TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status da resposta: ${response.status} ${response.statusText}`);

    if (response.status === 404) {
      console.log('PIX não encontrado:', pixId);
      return NextResponse.json(
        { error: 'PIX não encontrado', status: 'not_found' },
        { status: 404 }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro ao consultar status:', errorData);
      
      return NextResponse.json(
        { error: 'Erro ao consultar status do pagamento', details: errorData },
        { status: response.status }
      );
    }

    const statusData: PushinPayStatusResponse = await response.json();

    // Se o pagamento foi confirmado, ativar o acesso premium
    if (statusData.status === 'paid') {
      console.log('Pagamento confirmado:', {
        pixId: statusData.id,
        endToEndId: statusData.end_to_end_id,
        payerName: statusData.payer_name,
        payerDocument: statusData.payer_national_registration
      });

      // Ativar acesso premium
      const activated = await activatePremiumAccess(pixId, statusData);
      
      if (!activated) {
        return NextResponse.json(
          { error: 'Erro ao ativar acesso premium' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      status: statusData.status,
      paid: statusData.status === 'paid',
      end_to_end_id: statusData.end_to_end_id,
      payer_name: statusData.payer_name,
      payer_national_registration: statusData.payer_national_registration,
    });

  } catch (error) {
    console.error('Erro ao verificar status:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 