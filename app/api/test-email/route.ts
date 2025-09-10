import { NextRequest, NextResponse } from 'next/server';
import { sendPaymentConfirmationEmail, testEmailConfiguration } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Testar configuração de email
    const configOk = await testEmailConfiguration();
    
    if (!configOk) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Configuração SMTP inválida',
          message: 'Verifique as variáveis de ambiente SMTP_*'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Configuração de email OK',
      smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? 'configurado' : 'não configurado'
      }
    });
  } catch (error) {
    console.error('Erro ao testar configuração de email:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { success: false, error: 'Email de teste não fornecido' },
        { status: 400 }
      );
    }

    // Dados de teste para o email
    const testEmailData = {
      userEmail: testEmail,
      userName: 'Usuário Teste',
      userPassword: 'senha123',
      planName: 'Plano Mensal (1 mês)',
      planDuration: '30 dias',
      expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
      telegramChannel: process.env.TELEGRAM_CHANNEL || 'https://t.me/amadorflixvip',
      telegramBot: process.env.TELEGRAM_BOT || 'https://t.me/amadorflixbot',
      loginUrl: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/login`
    };

    const emailSent = await sendPaymentConfirmationEmail(testEmailData);

    if (emailSent) {
      return NextResponse.json({
        success: true,
        message: 'Email de teste enviado com sucesso',
        email: testEmail
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Falha ao enviar email de teste' 
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erro ao enviar email de teste:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}


