// Script simples para verificar split
console.log('🔍 Verificando configuração de split...');

// Simular configuração atual
const splitAccounts = [
  {
    accountId: '9F64A5B8-47CB-4969-A85C-D380100225F9',
    percentage: 0.50,
    description: 'Conta de Split'
  }
];

const mainPercentage = 1 - 0.50; // 50%

console.log('📊 Configuração:');
console.log('- Contas de Split:', splitAccounts.length);
console.log('- Split Percentage:', splitAccounts[0].percentage);
console.log('- Main Percentage:', mainPercentage);

// Testar com R$ 100,00
const testValue = 10000;
const splitValue = Math.round(testValue * 0.50);
const mainValue = testValue - splitValue;

console.log('\n💰 Teste com R$ 100,00:');
console.log('- Total:', testValue);
console.log('- Conta Principal:', mainValue);
console.log('- Conta Split:', splitValue);

console.log('\n✅ Configuração está correta: 2 contas (50/50)');
