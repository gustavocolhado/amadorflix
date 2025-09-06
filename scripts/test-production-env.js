require('dotenv').config();
const fetch = require('node-fetch');

console.log('🧪 Testando sistema com ambiente de produção...\n');

// Forçar ambiente de produção
process.env.NODE_ENV = 'production';

// Recarregar configuração
const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

async function testProductionEnvironment() {
  try {
    console.log('📋 Configuração de Produção:');
    console.log(`   NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`   API_URL: ${PUSHINPAY_CONFIG.API_URL}`);
    console.log(`   Token: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);
    
    if (!PUSHINPAY_CONFIG.TOKEN) {
      console.error('❌ Token não configurado!');
      return;
    }

    console.log(`   Token (primeiros 10 chars): ${PUSHINPAY_CONFIG.TOKEN.substring(0, 10)}...\n`);

    // Teste 1: Criar PIX simples
    console.log('📝 Teste 1: Criando PIX simples (R$ 1,00)...');
    
    const simplePayload = {
      value: 100, // R$ 1,00 em centavos
    };

    const response = await fetch(PUSHINPAY_CONFIG.API_URL, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(simplePayload),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API:', errorData);
      return;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);

    // Teste 2: Criar PIX com split
    console.log('\n📝 Teste 2: Criando PIX com split (R$ 2,00)...');
    
    const splitPayload = {
      value: 200, // R$ 2,00 em centavos
      split_rules: [
        {
          value: 60, // 30% de R$ 2,00 = R$ 0,60
          account_id: PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID
        }
      ]
    };

    const splitResponse = await fetch(PUSHINPAY_CONFIG.API_URL, {
      method: 'POST',
      headers: PUSHINPAY_CONFIG.HEADERS,
      body: JSON.stringify(splitPayload),
    });

    console.log(`   Status: ${splitResponse.status} ${splitResponse.statusText}`);

    if (!splitResponse.ok) {
      const errorData = await splitResponse.json();
      console.error('❌ Erro na API com split:', errorData);
      return;
    }

    const splitPixData = await splitResponse.json();
    console.log('✅ PIX com split criado com sucesso!');
    console.log(`   ID: ${splitPixData.id}`);
    console.log(`   Status: ${splitPixData.status}`);

    console.log('\n🎉 Todos os testes passaram na produção!');
    console.log('✅ Token funciona na API de produção');
    console.log('✅ Split funciona na API de produção');
    console.log('\n💡 Para usar em desenvolvimento:');
    console.log('   1. Solicite liberação do sandbox ao suporte');
    console.log('   2. Ou use a API de produção em desenvolvimento');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar teste
testProductionEnvironment(); 