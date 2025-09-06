const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailSystem() {
  console.log('🧪 Testando sistema de email...\n');

  // Verificar variáveis de ambiente
  console.log('1. Verificando variáveis de ambiente...');
  const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.log('❌ Variáveis de ambiente faltando:');
    missingVars.forEach(varName => console.log(`   - ${varName}`));
    console.log('\n💡 Configure essas variáveis no arquivo .env');
    return;
  }
  
  console.log('✅ Todas as variáveis de ambiente estão configuradas');
  console.log(`   - SMTP_HOST: ${process.env.SMTP_HOST}`);
  console.log(`   - SMTP_PORT: ${process.env.SMTP_PORT}`);
  console.log(`   - SMTP_USER: ${process.env.SMTP_USER}`);
  console.log(`   - SMTP_PASS: ${process.env.SMTP_PASS ? '***configurado***' : 'não configurado'}`);

  // Criar transporter
  console.log('\n2. Criando transporter SMTP...');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Testar configuração
  console.log('3. Testando configuração SMTP...');
  try {
    await transporter.verify();
    console.log('✅ Configuração SMTP OK - Conexão estabelecida com sucesso!');
  } catch (error) {
    console.log('❌ Erro na configuração SMTP:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('   - Verifique se a senha de app está correta');
    console.log('   - Confirme se a verificação em 2 etapas está ativa');
    console.log('   - Teste com credenciais diferentes');
    return;
  }

  // Perguntar email de teste
  console.log('\n4. Preparando email de teste...');
  const testEmail = process.argv[2]; // Email passado como argumento
  
  if (!testEmail) {
    console.log('❌ Email de teste não fornecido');
    console.log('💡 Use: node scripts/test-email-simple.js seu-email@exemplo.com');
    return;
  }

  console.log(`📧 Enviando email de teste para: ${testEmail}`);

  // Dados do email de teste
  const emailData = {
    userEmail: testEmail,
    userName: 'Usuário Teste',
    planName: 'Plano Mensal (1 mês)',
    planDuration: '30 dias',
    expireDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR'),
    telegramChannel: process.env.TELEGRAM_CHANNEL || 'https://t.me/amadorflixvip',
    telegramBot: process.env.TELEGRAM_BOT || 'https://t.me/amadorflixbot',
    loginUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000/login'
  };

  // Template HTML simples
  const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Teste de Email - AmadorFlix</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; border-bottom: 3px solid #dc2626; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        .title { color: #059669; font-size: 24px; margin: 20px 0; }
        .info-box { background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .telegram-section { background: linear-gradient(135deg, #0088cc, #229ed9); color: white; padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; }
        .telegram-link { display: inline-block; background-color: #ffffff; color: #0088cc; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 10px 5px; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🔥 AmadorFlix</div>
        <p>Teste de Email - Sistema Funcionando!</p>
    </div>

    <h1 class="title">✅ Email de Teste Enviado com Sucesso!</h1>
    
    <p>Olá <strong>${emailData.userName}</strong>,</p>
    
    <p>Este é um email de teste para verificar se o sistema de email está funcionando corretamente.</p>

    <div class="info-box">
        <h3 style="margin-top: 0; color: #1f2937;">📋 Dados de Teste</h3>
        <p><strong>Plano:</strong> ${emailData.planName}</p>
        <p><strong>Duração:</strong> ${emailData.planDuration}</p>
        <p><strong>Válido até:</strong> ${emailData.expireDate}</p>
        <p><strong>Email:</strong> ${emailData.userEmail}</p>
    </div>

    <div class="telegram-section">
        <div style="font-size: 20px; margin-bottom: 15px; font-weight: bold;">📱 Links do Telegram</div>
        <p>Links para teste do sistema:</p>
        
        <a href="${emailData.telegramChannel}" class="telegram-link" target="_blank">
            📺 Canal Principal
        </a>
        <a href="${emailData.telegramBot}" class="telegram-link" target="_blank">
            🤖 Bot de Acesso
        </a>
    </div>

    <div style="text-align: center; margin: 30px 0;">
        <a href="${emailData.loginUrl}" style="display: inline-block; background-color: #dc2626; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
            🚀 Acessar AmadorFlix
        </a>
    </div>

    <div class="footer">
        <p><strong>AmadorFlix</strong> - Sistema de Email Testado com Sucesso!</p>
        <p>Este é um email de teste automático.</p>
    </div>
</body>
</html>
  `;

  // Configurar email
  const mailOptions = {
    from: `"AmadorFlix Teste" <${process.env.SMTP_USER}>`,
    to: testEmail,
    subject: '🧪 Teste de Email - AmadorFlix',
    html: htmlTemplate,
    text: `
Olá ${emailData.userName},

Este é um email de teste para verificar se o sistema está funcionando.

Dados de Teste:
- Plano: ${emailData.planName}
- Duração: ${emailData.planDuration}
- Válido até: ${emailData.expireDate}
- Email: ${emailData.userEmail}

Links do Telegram:
- Canal: ${emailData.telegramChannel}
- Bot: ${emailData.telegramBot}

Acesse o site: ${emailData.loginUrl}

AmadorFlix - Sistema de Email Testado com Sucesso!
    `
  };

  // Enviar email
  console.log('5. Enviando email...');
  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email enviado com sucesso!');
    console.log(`📧 Message ID: ${result.messageId}`);
    console.log(`📬 Verifique a caixa de entrada de: ${testEmail}`);
    console.log('📱 Verifique também a pasta de spam/lixo eletrônico');
  } catch (error) {
    console.log('❌ Erro ao enviar email:', error.message);
    console.log('\n💡 Possíveis soluções:');
    console.log('   - Verifique se o email de destino é válido');
    console.log('   - Confirme se as credenciais SMTP estão corretas');
    console.log('   - Teste com um email diferente');
  }

  console.log('\n🎉 Teste concluído!');
}

// Executar teste
if (require.main === module) {
  testEmailSystem().catch(console.error);
}

module.exports = { testEmailSystem };


