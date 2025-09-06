require('dotenv').config();
const fetch = require('node-fetch');

console.log('🧪 Testando sistema com configuração corrigida...\n');

// Testar configuração
const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

console.log('📋 Configuração Atual:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`   API_URL: ${PUSHINPAY_CONFIG.API_URL}`);
console.log(`   Token: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);

if (PUSHINPAY_CONFIG.TOKEN) {
  console.log(`   Token (primeiros 10 chars): ${PUSHINPAY_CONFIG.TOKEN.substring(0, 10)}...`);
}
console.log('');

// Teste 1: Criar PIX simples
async function testSimplePix() {
  console.log('📝 Teste 1: Criando PIX simples (R$ 1,00)...');
  
  try {
    const payload = {
      value: 100, // R$ 1,00 em centavos
    };

    const response = await fetch(PUSHINPAY_CONFIG.API_URL, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(payload),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API:', errorData);
      return false;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);
    return true;

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    return false;
  }
}

// Teste 2: Criar PIX com split
async function testSplitPix() {
  console.log('\n📝 Teste 2: Criando PIX com split (R$ 2,00)...');
  
  try {
    const { calculateSplitValues, createSplitPayload } = require('../config/pushinpay.js');
    
    const value = 200; // R$ 2,00 em centavos
    const { splitValue } = calculateSplitValues(value);
    
    const payload = createSplitPayload(value);

    console.log('   Payload do split:');
    console.log(`   - Valor total: R$ ${(value / 100).toFixed(2)}`);
    console.log(`   - Split (30%): R$ ${(splitValue / 100).toFixed(2)}`);
    console.log(`   - Principal (70%): R$ ${((value - splitValue) / 100).toFixed(2)}`);

    const response = await fetch(PUSHINPAY_CONFIG.API_URL, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(payload),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API com split:', errorData);
      return false;
    }

    const pixData = await response.json();
    console.log('✅ PIX com split criado com sucesso!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);
    console.log(`   Split rules: ${pixData.split_rules.length} regras`);
    return true;

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    return false;
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes...\n');
  
  const test1Result = await testSimplePix();
  const test2Result = await testSplitPix();
  
  console.log('\n🎯 Resultados:');
  console.log(`   PIX Simples: ${test1Result ? '✅ Passou' : '❌ Falhou'}`);
  console.log(`   PIX com Split: ${test2Result ? '✅ Passou' : '❌ Falhou'}`);
  
  if (test1Result && test2Result) {
    console.log('\n🎉 Todos os testes passaram!');
    console.log('✅ Sistema funcionando corretamente');
    console.log('✅ Token válido na API de produção');
    console.log('✅ Split funcionando perfeitamente');
  } else {
    console.log('\n❌ Alguns testes falharam');
    console.log('💡 Verifique os logs acima para mais detalhes');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests();
} 