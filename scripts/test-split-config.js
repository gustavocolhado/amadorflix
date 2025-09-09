// Script para testar a configuração de split
require('dotenv').config();

async function testSplitConfig() {
  try {
    console.log('🧪 Testando configuração de split...\n');
    
    // Importar configuração
    const { getPUSHINPAY_CONFIG, calculateSplitValues, createSplitPayload } = require('../config/pushinpay.ts');
    
    // Obter configuração
    const config = getPUSHINPAY_CONFIG();
    
    console.log('📊 Configuração atual:');
    console.log('SPLIT_ACCOUNTS:', config.SPLIT_ACCOUNTS);
    console.log('MAIN_PERCENTAGE:', config.MAIN_PERCENTAGE);
    console.log('');
    
    // Testar com R$ 100,00
    const testValue = 10000; // R$ 100,00 em centavos
    console.log(`💰 Teste com R$ ${testValue / 100}:`);
    
    const splitResult = calculateSplitValues(testValue);
    console.log('Resultado do split:');
    console.log('- Total:', splitResult.totalValue);
    console.log('- Conta Principal:', splitResult.mainValue);
    console.log('- Split Values:', splitResult.splitValues);
    console.log('- Total Split:', splitResult.totalSplitValue);
    console.log('');
    
    // Testar payload
    const payload = createSplitPayload(testValue);
    console.log('📦 Payload para PushinPay:');
    console.log(JSON.stringify(payload, null, 2));
    
  } catch (error) {
    console.error('❌ Erro ao testar configuração:', error.message);
  }
}

testSplitConfig();
