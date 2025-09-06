const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

console.log('🧪 Testando configuração dos ambientes PushinPay\n');

// Simular diferentes ambientes
const environments = [
  { NODE_ENV: 'development', expected: 'https://api-sandbox.pushinpay.com.br' },
  { NODE_ENV: 'production', expected: 'https://api.pushinpay.com.br' },
  { NODE_ENV: 'test', expected: 'https://api-sandbox.pushinpay.com.br' }
];

console.log('📋 Configuração atual:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   API_URL: ${PUSHINPAY_CONFIG.API_URL}`);
console.log(`   TOKEN: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'Não configurado'}`);
console.log(`   SPLIT_ACCOUNT_ID: ${PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID}`);
console.log(`   SPLIT_PERCENTAGE: ${PUSHINPAY_CONFIG.SPLIT_PERCENTAGE * 100}%`);
console.log(`   MAIN_PERCENTAGE: ${PUSHINPAY_CONFIG.MAIN_PERCENTAGE * 100}%\n`);

console.log('🔍 Testando URLs por ambiente:');
environments.forEach(env => {
  // Simular mudança de ambiente
  const originalEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = env.NODE_ENV;
  
  // Recarregar configuração
  delete require.cache[require.resolve('../config/pushinpay.js')];
  const { PUSHINPAY_CONFIG: config } = require('../config/pushinpay.js');
  
  const isCorrect = config.API_URL.includes(env.expected.split('//')[1]);
  console.log(`   ${env.NODE_ENV}: ${config.API_URL} ${isCorrect ? '✅' : '❌'}`);
  
  // Restaurar ambiente original
  process.env.NODE_ENV = originalEnv;
});

console.log('\n📝 Testando cálculo de split:');
const testValue = 1990; // R$ 19,90
const splitValue = Math.round(testValue * PUSHINPAY_CONFIG.SPLIT_PERCENTAGE);
const mainValue = testValue - splitValue;

console.log(`   Valor total: R$ ${(testValue / 100).toFixed(2)}`);
console.log(`   Conta principal (70%): R$ ${(mainValue / 100).toFixed(2)}`);
console.log(`   Conta de split (30%): R$ ${(splitValue / 100).toFixed(2)}`);

console.log('\n✅ Teste de configuração concluído!'); 