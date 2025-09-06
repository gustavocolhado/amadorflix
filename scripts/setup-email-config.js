const fs = require('fs');
const path = require('path');

function setupEmailConfig() {
  console.log('📧 Configurando sistema de email...\n');

  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), 'env.example');

  // Verificar se .env existe
  if (!fs.existsSync(envPath)) {
    console.log('❌ Arquivo .env não encontrado');
    console.log('📋 Copie o arquivo env.example para .env e configure as variáveis');
    return;
  }

  // Ler arquivo .env atual
  let envContent = fs.readFileSync(envPath, 'utf8');

  // Verificar se as variáveis de email já existem
  const emailVars = [
    'SMTP_HOST',
    'SMTP_PORT', 
    'SMTP_SECURE',
    'SMTP_USER',
    'SMTP_PASS',
    'TELEGRAM_CHANNEL',
    'TELEGRAM_BOT'
  ];

  let missingVars = [];
  let existingVars = [];

  emailVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      existingVars.push(varName);
    } else {
      missingVars.push(varName);
    }
  });

  console.log('📊 Status das variáveis de email:');
  existingVars.forEach(varName => {
    console.log(`✅ ${varName} - já configurada`);
  });
  missingVars.forEach(varName => {
    console.log(`❌ ${varName} - não configurada`);
  });

  if (missingVars.length === 0) {
    console.log('\n🎉 Todas as variáveis de email já estão configuradas!');
    return;
  }

  console.log('\n📝 Variáveis que precisam ser configuradas:');
  console.log('\n# Email Configuration (SMTP)');
  console.log('SMTP_HOST=smtp.gmail.com');
  console.log('SMTP_PORT=587');
  console.log('SMTP_SECURE=false');
  console.log('SMTP_USER=seu-email@gmail.com');
  console.log('SMTP_PASS=sua-senha-de-app');
  console.log('\n# Telegram Configuration');
  console.log('TELEGRAM_CHANNEL=https://t.me/amadorflixvip');
  console.log('TELEGRAM_BOT=https://t.me/amadorflixbot');

  console.log('\n💡 Instruções para configurar Gmail:');
  console.log('1. Ative a verificação em 2 etapas na sua conta Google');
  console.log('2. Gere uma senha de aplicativo:');
  console.log('   - Acesse: https://myaccount.google.com/apppasswords');
  console.log('   - Selecione "Aplicativo" e "Outro (nome personalizado)"');
  console.log('   - Digite "AmadorFlix" como nome');
  console.log('   - Copie a senha gerada para SMTP_PASS');
  console.log('3. Use seu email Gmail para SMTP_USER');

  console.log('\n🔧 Para testar a configuração:');
  console.log('npm run test:email');
  console.log('ou acesse: http://localhost:3000/api/test-email');
}

// Executar se chamado diretamente
if (require.main === module) {
  setupEmailConfig();
}

module.exports = { setupEmailConfig };


