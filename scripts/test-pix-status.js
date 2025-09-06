require('dotenv').config();
const fetch = require('node-fetch');

console.log('🧪 Testando consulta de status do PIX...\n');

// Configuração
const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

// Função para consultar status do PIX
async function checkPixStatus(pixId) {
  try {
    console.log(`📝 Consultando status do PIX: ${pixId}`);
    
    // URL correta para consulta
    const baseUrl = PUSHINPAY_CONFIG.API_URL.replace('/api/pix/cashIn', '/api/transactions');
    const statusUrl = `${baseUrl}/${pixId}`;
    
    console.log(`   URL: ${statusUrl}`);
    console.log(`   Token: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PUSHINPAY_CONFIG.TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.status === 404) {
      console.log('❌ PIX não encontrado (404)');
      return { found: false, status: 'not_found' };
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na consulta:', errorData);
      return { found: false, error: errorData };
    }

    const pixData = await response.json();
    console.log('✅ PIX encontrado!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);
    console.log(`   Valor: R$ ${(pixData.value / 100).toFixed(2)}`);
    
    if (pixData.end_to_end_id) {
      console.log(`   End-to-End ID: ${pixData.end_to_end_id}`);
    }
    
    if (pixData.payer_name) {
      console.log(`   Pagador: ${pixData.payer_name}`);
    }

    return { found: true, data: pixData };

  } catch (error) {
    console.error('❌ Erro durante a consulta:', error.message);
    return { found: false, error: error.message };
  }
}

// Função para testar diferentes cenários
async function runTests() {
  console.log('🚀 Iniciando testes de consulta de status...\n');

  // Teste 1: PIX válido (usar um ID que foi criado recentemente)
  console.log('📋 Teste 1: PIX válido');
  const validPixId = '9f8efc3a-4b9b-490f-9c76-e98512654ec9'; // ID do teste anterior
  const result1 = await checkPixStatus(validPixId);
  
  console.log('');

  // Teste 2: PIX inválido
  console.log('📋 Teste 2: PIX inválido');
  const invalidPixId = '00000000-0000-0000-0000-000000000000';
  const result2 = await checkPixStatus(invalidPixId);
  
  console.log('');

  // Teste 3: PIX com formato inválido
  console.log('📋 Teste 3: Formato inválido');
  const malformedPixId = 'invalid-id';
  const result3 = await checkPixStatus(malformedPixId);

  console.log('\n🎯 Resultados:');
  console.log(`   PIX Válido: ${result1.found ? '✅ Encontrado' : '❌ Não encontrado'}`);
  console.log(`   PIX Inválido: ${result2.found ? '❌ Encontrado (erro)' : '✅ Não encontrado (correto)'}`);
  console.log(`   Formato Inválido: ${result3.found ? '❌ Encontrado (erro)' : '✅ Não encontrado (correto)'}`);

  if (result1.found) {
    console.log('\n🎉 Consulta de status funcionando corretamente!');
    console.log('✅ Endpoint configurado corretamente');
    console.log('✅ Token válido');
    console.log('✅ URL correta');
  } else {
    console.log('\n❌ Problemas na consulta de status');
    console.log('💡 Verifique os logs acima para mais detalhes');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { checkPixStatus }; 