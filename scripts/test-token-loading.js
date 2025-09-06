require('dotenv').config();

console.log('🧪 Testando carregamento do token...\n');

// Teste 1: Variáveis de ambiente diretas
console.log('📋 Teste 1: Variáveis de ambiente diretas');
console.log(`   PUSHINPAY_TOKEN: ${process.env.PUSHINPAY_TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);
if (process.env.PUSHINPAY_TOKEN) {
  console.log(`   Token (primeiros 10 chars): ${process.env.PUSHINPAY_TOKEN.substring(0, 10)}...`);
  console.log(`   Comprimento: ${process.env.PUSHINPAY_TOKEN.length} caracteres`);
}
console.log('');

// Teste 2: Arquivo JavaScript
console.log('📋 Teste 2: Arquivo JavaScript (config/pushinpay.js)');
try {
  const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');
  console.log(`   TOKEN: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  if (PUSHINPAY_CONFIG.TOKEN) {
    console.log(`   Token (primeiros 10 chars): ${PUSHINPAY_CONFIG.TOKEN.substring(0, 10)}...`);
    console.log(`   API_URL: ${PUSHINPAY_CONFIG.API_URL}`);
  }
} catch (error) {
  console.error('   ❌ Erro ao carregar config/pushinpay.js:', error.message);
}
console.log('');

// Teste 3: Arquivo TypeScript (simulado)
console.log('📋 Teste 3: Arquivo TypeScript (config/pushinpay.ts)');
try {
  // Simular carregamento do TypeScript
  const tsConfig = require('../config/pushinpay.ts');
  console.log(`   TOKEN: ${tsConfig.PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  if (tsConfig.PUSHINPAY_CONFIG.TOKEN) {
    console.log(`   Token (primeiros 10 chars): ${tsConfig.PUSHINPAY_CONFIG.TOKEN.substring(0, 10)}...`);
    console.log(`   API_URL: ${tsConfig.PUSHINPAY_CONFIG.API_URL}`);
  }
} catch (error) {
  console.error('   ❌ Erro ao carregar config/pushinpay.ts:', error.message);
}
console.log('');

// Teste 4: Verificar arquivo .env
console.log('📋 Teste 4: Verificar arquivo .env');
const fs = require('fs');
const path = require('path');
const envPath = path.join(__dirname, '..', '.env');

if (fs.existsSync(envPath)) {
  console.log('   ✅ Arquivo .env existe');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasToken = envContent.includes('PUSHINPAY_TOKEN');
  console.log(`   PUSHINPAY_TOKEN configurado: ${hasToken ? 'Sim' : 'Não'}`);
  
  if (hasToken) {
    const tokenLine = envContent.split('\n').find(line => line.startsWith('PUSHINPAY_TOKEN='));
    if (tokenLine) {
      const tokenValue = tokenLine.split('=')[1];
      console.log(`   Token no .env: ${tokenValue ? 'Configurado' : 'Vazio'}`);
    }
  }
} else {
  console.log('   ❌ Arquivo .env não existe');
}
console.log('');

// Teste 5: Comparar tokens
console.log('📋 Teste 5: Comparar tokens entre fontes');
const envToken = process.env.PUSHINPAY_TOKEN;
const jsConfig = require('../config/pushinpay.js');
const jsToken = jsConfig.PUSHINPAY_CONFIG.TOKEN;

console.log(`   Token do process.env: ${envToken ? 'Configurado' : 'NÃO CONFIGURADO'}`);
console.log(`   Token do config.js: ${jsToken ? 'Configurado' : 'NÃO CONFIGURADO'}`);

if (envToken && jsToken) {
  const tokensMatch = envToken === jsToken;
  console.log(`   Tokens são iguais: ${tokensMatch ? '✅ Sim' : '❌ Não'}`);
  
  if (!tokensMatch) {
    console.log(`   process.env: ${envToken.substring(0, 10)}...`);
    console.log(`   config.js: ${jsToken.substring(0, 10)}...`);
  }
} else {
  console.log('   ❌ Um ou ambos os tokens não estão configurados');
}

console.log('\n🎯 Resumo:');
if (envToken && jsToken && envToken === jsToken) {
  console.log('✅ Token carregado corretamente em todas as fontes');
} else {
  console.log('❌ Problema no carregamento do token');
  console.log('💡 Soluções:');
  console.log('   1. Verifique se o arquivo .env existe');
  console.log('   2. Verifique se PUSHINPAY_TOKEN está definido no .env');
  console.log('   3. Reinicie o servidor após modificar o .env');
  console.log('   4. Verifique se não há espaços extras no token');
} 