// Importar usando import dinâmico para módulos ES6/TypeScript
async function loadEmailModule() {
  try {
    // Tentar importar o módulo compilado
    const emailModule = await import('../lib/email.js');
    return emailModule;
  } catch (error) {
    console.log('❌ Erro ao carregar módulo de email:', error.message);
    console.log('💡 Certifique-se de que o projeto está compilado ou use a API de teste');
    return null;
  }
}

async function testEmailSystem() {
  console.log('🧪 Testando sistema de email...\n');

  // Carregar módulo de email
  const emailModule = await loadEmailModule();
  if (!emailModule) {
    console.log('❌ Não foi possível carregar o módulo de email');
    console.log('💡 Use a API de teste em: http://localhost:3000/api/test-email');
    return;
  }

  const { sendPaymentConfirmationEmail, testEmailConfiguration } = emailModule;

  // Testar configuração de email
  console.log('1. Testando configuração SMTP...');
  try {
    const configOk = await testEmailConfiguration();
    if (configOk) {
      console.log('✅ Configuração SMTP OK');
    } else {
      console.log('❌ Erro na configuração SMTP');
      console.log('Verifique as variáveis de ambiente:');
      console.log('- SMTP_HOST');
      console.log('- SMTP_PORT');
      console.log('- SMTP_USER');
      console.log('- SMTP_PASS');
      return;
    }
  } catch (error) {
    console.log('❌ Erro ao testar configuração:', error.message);
    return;
  }

  // Testar envio de email
  console.log('\n2. Testando envio de email de confirmação...');
  
  const testEmailData = {
    userEmail: 'teste@exemplo.com', // Substitua por um email real para teste
    userName: 'Usuário Teste',
    planName: 'Plano Mensal (1 mês)',
    planDuration: '30 dias',
    expireDate: '15/01/2024',
    telegramChannel: 'https://t.me/amadorflixvip',
    telegramBot: 'https://t.me/amadorflixbot',
    loginUrl: 'http://localhost:3000/login'
  };

  try {
    const emailSent = await sendPaymentConfirmationEmail(testEmailData);
    if (emailSent) {
      console.log('✅ Email de teste enviado com sucesso!');
      console.log('📧 Verifique a caixa de entrada do email:', testEmailData.userEmail);
    } else {
      console.log('❌ Falha ao enviar email de teste');
    }
  } catch (error) {
    console.log('❌ Erro ao enviar email:', error.message);
  }

  console.log('\n📋 Checklist de configuração:');
  console.log('□ SMTP_HOST configurado');
  console.log('□ SMTP_PORT configurado (587 para Gmail)');
  console.log('□ SMTP_USER configurado (seu email)');
  console.log('□ SMTP_PASS configurado (senha de app do Gmail)');
  console.log('□ TELEGRAM_CHANNEL configurado');
  console.log('□ TELEGRAM_BOT configurado');
  console.log('□ NEXTAUTH_URL configurado');
  
  console.log('\n💡 Dicas:');
  console.log('- Para Gmail, use senha de aplicativo, não sua senha normal');
  console.log('- Ative a verificação em 2 etapas no Gmail');
  console.log('- Gere uma senha de aplicativo específica para este projeto');
  console.log('- Teste com um email real para verificar se está funcionando');
}

// Executar teste se chamado diretamente
if (require.main === module) {
  testEmailSystem().catch(console.error);
}

module.exports = { testEmailSystem };
