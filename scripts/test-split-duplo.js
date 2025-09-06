require('dotenv').config();

const { 
  PUSHINPAY_CONFIG, 
  getPUSHINPAY_CONFIG, 
  calculateSplitValues, 
  createSplitPayload 
} = require('../config/pushinpay.js');

console.log('🧪 Testando configuração de split duplo...\n');

// Obter configuração atualizada
const config = getPUSHINPAY_CONFIG();

console.log('📋 Configuração atual:');
console.log(`   SPLIT_ACCOUNT_ID: ${config.SPLIT_ACCOUNT_ID}`);
console.log(`   SPLIT_ACCOUNT_ID2: ${config.SPLIT_ACCOUNT_ID2}`);
console.log(`   SPLIT_PERCENTAGE: ${config.SPLIT_PERCENTAGE * 100}%`);
console.log(`   SPLIT_PERCENTAGE2: ${config.SPLIT_PERCENTAGE2 * 100}%`);
console.log(`   MAIN_PERCENTAGE: ${config.MAIN_PERCENTAGE * 100}%`);
console.log(`   Total Split: ${(config.SPLIT_PERCENTAGE + config.SPLIT_PERCENTAGE2) * 100}%\n`);

// Testar com diferentes valores
const testValues = [1000, 5000, 10000, 50000]; // em centavos

testValues.forEach(value => {
  console.log(`💰 Testando valor: R$ ${(value / 100).toFixed(2)} (${value} centavos)`);
  
  // Calcular valores do split
  const { totalValue, mainValue, splitValue, splitValue2, splitPercentage, splitPercentage2, mainPercentage } = calculateSplitValues(value);
  
  console.log(`   Valor total: ${totalValue} centavos`);
  console.log(`   Valor principal: ${mainValue} centavos (${mainPercentage * 100}%)`);
  console.log(`   Split 1: ${splitValue} centavos (${splitPercentage * 100}%)`);
  console.log(`   Split 2: ${splitValue2} centavos (${splitPercentage2 * 100}%)`);
  console.log(`   Total split: ${splitValue + splitValue2} centavos (${(splitPercentage + splitPercentage2) * 100}%)`);
  
  // Verificar se os valores somam corretamente
  const totalCalculated = mainValue + splitValue + splitValue2;
  const isValid = totalCalculated === totalValue;
  console.log(`   ✅ Validação: ${isValid ? 'CORRETO' : 'ERRO'} (${totalCalculated} = ${totalValue})`);
  
  // Criar payload
  const payload = createSplitPayload(value);
  console.log(`   Payload split_rules:`, payload.split_rules);
  console.log('');
});

console.log('🎯 Resumo da configuração:');
console.log(`   - Conta principal recebe: ${config.MAIN_PERCENTAGE * 100}%`);
console.log(`   - Conta 1 (${config.SPLIT_ACCOUNT_ID.substring(0, 8)}...) recebe: ${config.SPLIT_PERCENTAGE * 100}%`);
console.log(`   - Conta 2 (${config.SPLIT_ACCOUNT_ID2.substring(0, 8)}...) recebe: ${config.SPLIT_PERCENTAGE2 * 100}%`);
console.log(`   - Total dividido: ${(config.SPLIT_PERCENTAGE + config.SPLIT_PERCENTAGE2) * 100}%`);

console.log('\n✅ Teste de split duplo concluído!');
console.log('📝 Para testar com a API real, use: node scripts/test-pushinpay-api.js');
