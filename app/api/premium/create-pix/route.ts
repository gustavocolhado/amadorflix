import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { 
  PUSHINPAY_CONFIG, 
  calculateSplitValues, 
  validateValue, 
  createSplitPayload 
} from '@/config/pushinpay';

const prisma = new PrismaClient();

interface CreatePixRequest {
  value: number;
  email: string;
  planId: string;
  referralData?: {
    source: string;
    campaign: string;
    referrer: string;
    timestamp?: string;
    currentUrl?: string;
    planSelected?: string;
    planPrice?: number;
    userAgent?: string;
    screenResolution?: string;
    language?: string;
    timezone?: string;
    subscriptionTimestamp?: string;
  };
}

interface PushinPayResponse {
  id: string;
  qr_code: string;
  status: string;
  value: number;
  webhook_url?: string;
  qr_code_base64: string;
  webhook?: string | null;
  split_rules: any[];
  end_to_end_id?: string | null;
  payer_name?: string | null;
  payer_national_registration?: string | null;
}

// Função para calcular a data de expiração (15 minutos)
function getExpirationDate(): Date {
  return new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
}

// Função para calcular a duração do plano em dias
function getPlanDuration(planId: string): number {
  switch (planId) {
    case '12months':
      return 365; // 12 meses
    case '1month':
      return 30; // 1 mês
    case '7days':
      return 7; // 7 dias
    default:
      return 30; // padrão 1 mês
  }
}

// Função para verificar se usuário existe ou criar se não existir
async function checkUserExists(email: string) {
  try {
    let user = await prisma.user.findUnique({
      where: { email }
    });

    // Se usuário não existe, criar sem senha
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: email,
          name: email.split('@')[0], // Usar parte antes do @ como nome
          password: '', // Senha vazia, será definida após pagamento
          premium: false,
          paymentStatus: 'pending',
          paymentType: 'pix'
        }
      });
      console.log('✅ Usuário criado sem senha:', { id: user.id, email: user.email });
    }

    return user;
  } catch (error) {
    console.error('Erro ao verificar/criar usuário:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CreatePixRequest = await request.json();
    const { value, email, planId, referralData } = body;

    // Log específico para tracking de assinaturas
    if (referralData?.source || referralData?.campaign) {
      console.log('🎯 Subscription tracking - PIX creation:', {
        email,
        planId,
        value: value / 100,
        referralSource: referralData.source,
        referralCampaign: referralData.campaign,
        referralReferrer: referralData.referrer,
        currentUrl: referralData.currentUrl,
        timestamp: new Date().toISOString()
      });
    }

    // Validar dados de entrada
    const valueValidation = validateValue(value);
    if (!valueValidation.isValid) {
      return NextResponse.json(
        { error: valueValidation.error },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: 'Email é obrigatório' },
        { status: 400 }
      );
    }

    // Configuração da PushinPay
    if (!PUSHINPAY_CONFIG.TOKEN) {
      console.error('PUSHINPAY_TOKEN não configurado');
      return NextResponse.json(
        { error: 'Erro de configuração do sistema' },
        { status: 500 }
      );
    }

    // Calcular valores do split
    const { mainValue, splitValues, totalSplitValue, totalSplitPercentage } = calculateSplitValues(value);
    
    // Preparar payload para PushinPay
    const pushinPayPayload = createSplitPayload(value, PUSHINPAY_CONFIG.WEBHOOK_URL);

    // Log do payload para debug
    console.log('Payload PushinPay com split configurado:', {
      value,
      split_rules: pushinPayPayload.split_rules,
      split_accounts: PUSHINPAY_CONFIG.SPLIT_ACCOUNTS,
      main_value: mainValue,
      split_values: splitValues,
      total_split_value: totalSplitValue,
      total_split_percentage: totalSplitPercentage
    });

    // Fazer requisição para PushinPay
    const pushinPayResponse = await fetch(PUSHINPAY_CONFIG.API_URL, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(pushinPayPayload),
    });

    if (!pushinPayResponse.ok) {
      const errorData = await pushinPayResponse.json();
      console.error('Erro PushinPay:', errorData);
      
      // Tratamento específico de erros de split
      if (pushinPayResponse.status === 400) {
        if (errorData.message?.includes('split')) {
          return NextResponse.json(
            { error: 'Erro na configuração do split de pagamento. Tente novamente.' },
            { status: 400 }
          );
        }
        if (errorData.message?.includes('limite')) {
          return NextResponse.json(
            { error: 'Valor excede o limite permitido para sua conta.' },
            { status: 400 }
          );
        }
      }
      
      return NextResponse.json(
        { error: 'Erro ao processar pagamento com PushinPay' },
        { status: pushinPayResponse.status }
      );
    }

    const pixData: PushinPayResponse = await pushinPayResponse.json();

    // Log da resposta da PushinPay
    console.log('✅ PIX criado pela PushinPay:', {
      id: pixData.id,
      status: pixData.status,
      value: pixData.value,
      hasQrCode: !!pixData.qr_code,
      hasQrCodeBase64: !!pixData.qr_code_base64
    });

    // Verificar se usuário existe ou criar se não existir
    const existingUser = await checkUserExists(email);

    // Salvar dados do PIX no banco de dados
    const pixPayment = await prisma.pixPayment.create({
      data: {
        pixId: pixData.id,
        userId: existingUser?.id || null, // Usar userId se usuário existir
        userEmail: email,
        planId: planId,
        amount: value / 100, // Converter centavos para reais
        status: 'pending',
        qrCode: pixData.qr_code,
        qrCodeBase64: pixData.qr_code_base64,
        expiresAt: getExpirationDate(),
        // Salvar dados de referência como metadados
        metadata: referralData ? {
          referralSource: referralData.source,
          referralCampaign: referralData.campaign,
          referralReferrer: referralData.referrer,
          referralTimestamp: referralData.timestamp || new Date().toISOString(),
          currentUrl: referralData.currentUrl,
          planSelected: referralData.planSelected,
          planPrice: referralData.planPrice,
          userAgent: referralData.userAgent,
          screenResolution: referralData.screenResolution,
          language: referralData.language,
          timezone: referralData.timezone,
          subscriptionTimestamp: referralData.subscriptionTimestamp
        } : undefined
      }
    });

    // Se o usuário existir, atualizar com informações do pagamento
    if (existingUser) {
      await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          paymentStatus: 'pending',
          paymentType: 'pix',
          paymentId: parseInt(pixData.id.replace(/-/g, '').substring(0, 8), 16),
          chavePix: pixData.id,
        }
      });
    }

    console.log('PIX criado com split simples e salvo no banco:', {
      pixId: pixData.id,
      userId: existingUser.id,
      email,
      planId,
      value: value / 100,
      mainValue: mainValue / 100,
      splitValue: totalSplitValue / 100,
      splitAccountId: PUSHINPAY_CONFIG.SPLIT_ACCOUNTS[0]?.accountId || '',
      status: 'pending',
      splitRules: pixData.split_rules,
      referralData: referralData ? {
        source: referralData.source,
        campaign: referralData.campaign,
        referrer: referralData.referrer,
        currentUrl: referralData.currentUrl
      } : 'sem dados de referência'
    });


    // Retornar dados do PIX para o frontend
    return NextResponse.json({
      id: pixData.id,
      qr_code: pixData.qr_code,
      status: pixData.status,
      value: pixData.value,
      qr_code_base64: pixData.qr_code_base64,
      userId: existingUser.id,
    });

  } catch (error) {
    console.error('Erro ao criar PIX:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
} 