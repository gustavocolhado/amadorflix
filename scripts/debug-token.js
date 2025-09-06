require('dotenv').config();

console.log('🔍 Diagnosticando configuração do token PushinPay...\n');

// Verificar variáveis de ambiente
console.log('📋 Variáveis de Ambiente:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   PUSHINPAY_TOKEN: ${process.env.PUSHINPAY_TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);

if (process.env.PUSHINPAY_TOKEN) {
  console.log(`   Token (primeiros 10 chars): ${process.env.PUSHINPAY_TOKEN.substring(0, 10)}...`);
  console.log(`   Comprimento do token: ${process.env.PUSHINPAY_TOKEN.length} caracteres`);
} else {
  console.log('   ❌ PUSHINPAY_TOKEN não encontrado no .env');
}

console.log(`   PUSHINPAY_WEBHOOK_URL: ${process.env.PUSHINPAY_WEBHOOK_URL || 'Não configurado'}`);
console.log(`   PUSHINPAY_SPLIT_ACCOUNT_ID: ${process.env.PUSHINPAY_SPLIT_ACCOUNT_ID || 'Usando padrão'}`);
console.log(`   PUSHINPAY_SPLIT_ACCOUNT_ID2: ${process.env.PUSHINPAY_SPLIT_ACCOUNT_ID2 || 'Usando padrão'}\n`);

// Testar configuração do módulo
try {
  const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');
  
  console.log('📋 Configuração do Módulo:');
  console.log(`   TOKEN: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);
  console.log(`   API_URL: ${PUSHINPAY_CONFIG.API_URL}`);
  console.log(`   SPLIT_ACCOUNT_ID: ${PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID}`);
  console.log(`   SPLIT_ACCOUNT_ID2: ${PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID2}`);
  console.log(`   SPLIT_PERCENTAGE: ${PUSHINPAY_CONFIG.SPLIT_PERCENTAGE * 100}%`);
  console.log(`   SPLIT_PERCENTAGE2: ${PUSHINPAY_CONFIG.SPLIT_PERCENTAGE2 * 100}%`);
  console.log(`   MAIN_PERCENTAGE: ${PUSHINPAY_CONFIG.MAIN_PERCENTAGE * 100}%`);
  
  if (PUSHINPAY_CONFIG.TOKEN) {
    console.log(`   HEADERS Authorization: ${PUSHINPAY_CONFIG.HEADERS.Authorization.substring(0, 20)}...`);
  } else {
    console.log('   ❌ Token não está sendo carregado no módulo');
  }
  
} catch (error) {
  console.error('❌ Erro ao carregar configuração:', error.message);
}

console.log('\n🔧 Soluções possíveis:');
console.log('   1. Verifique se o arquivo .env existe na raiz do projeto');
console.log('   2. Certifique-se de que PUSHINPAY_TOKEN está definido no .env');
console.log('   3. Reinicie o servidor após modificar o .env');
console.log('   4. Verifique se não há espaços extras no token');
console.log('   5. Certifique-se de que o token é válido no PushinPay');

console.log('\n📝 Exemplo de .env correto:');
console.log('   PUSHINPAY_TOKEN=seu_token_aqui_sem_aspas');
console.log('   PUSHINPAY_WEBHOOK_URL=https://seu-dominio.com/api/premium/webhook');
console.log('   PUSHINPAY_SPLIT_ACCOUNT_ID=9F64A5B8-47CB-4969-A85C-D380100225F9');
console.log('   PUSHINPAY_SPLIT_ACCOUNT_ID2=9F905070-C4F0-42D7-B399-566226D0808D'); 