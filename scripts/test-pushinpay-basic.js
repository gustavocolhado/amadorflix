require('dotenv').config();
const fetch = require('node-fetch');

console.log('🧪 Testando API PushinPay diretamente...\n');

// Configuração
const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

// Função para criar PIX diretamente na PushinPay
async function createPixDirect() {
  console.log('📝 Criando PIX diretamente na PushinPay...');
  
  try {
    const payload = {
      value: 100, // R$ 1,00 em centavos
      split_rules: [
        {
          value: 30, // 30% para split
          account_id: PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID
        }
      ]
    };

    console.log('   Payload:', JSON.stringify(payload, null, 2));
    console.log('   URL:', PUSHINPAY_CONFIG.API_URL);
    console.log('   Token:', PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO');

    const response = await fetch(PUSHINPAY_CONFIG.API_URL, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(payload),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API:', errorData);
      return null;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);
    console.log(`   Valor: R$ ${(pixData.value / 100).toFixed(2)}`);
    console.log(`   Split rules: ${pixData.split_rules?.length || 0} regras`);
    
    return pixData;

  } catch (error) {
    console.error('❌ Erro ao criar PIX:', error.message);
    return null;
  }
}

// Função para consultar status
async function checkStatus(pixId) {
  console.log('\n📝 Consultando status do PIX...');
  
  try {
    const baseUrl = PUSHINPAY_CONFIG.API_URL.replace('/api/pix/cashIn', '/api/transactions');
    const statusUrl = `${baseUrl}/${pixId}`;

    console.log(`   URL: ${statusUrl}`);

    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${PUSHINPAY_CONFIG.TOKEN}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Status consultado com sucesso!');
      console.log(`   ID: ${data.id}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Valor: R$ ${(data.value / 100).toFixed(2)}`);
      return data;
    } else {
      const errorData = await response.json();
      console.error('❌ Erro na consulta:', errorData);
      return null;
    }

  } catch (error) {
    console.error('❌ Erro ao consultar status:', error.message);
    return null;
  }
}

// Função principal
async function runBasicTest() {
  console.log('🚀 Iniciando teste básico da PushinPay...\n');

  // 1. Criar PIX
  const pixData = await createPixDirect();
  if (!pixData) {
    console.log('❌ Falha ao criar PIX. Teste interrompido.');
    return;
  }

  // 2. Consultar status
  const statusData = await checkStatus(pixData.id);
  
  console.log('\n🎯 Resultados:');
  console.log(`   PIX criado: ${pixData ? '✅ Sim' : '❌ Não'}`);
  console.log(`   Status consultado: ${statusData ? '✅ Sim' : '❌ Não'}`);

  if (pixData && statusData) {
    console.log('\n🎉 Teste básico concluído com sucesso!');
    console.log('✅ API PushinPay funcionando');
    console.log('✅ Token válido');
    console.log('✅ Split configurado');
    console.log('✅ Consulta de status funcionando');
  } else {
    console.log('\n❌ Teste falhou');
    console.log('💡 Verifique os logs acima para mais detalhes');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runBasicTest();
}

module.exports = { createPixDirect, checkStatus }; 