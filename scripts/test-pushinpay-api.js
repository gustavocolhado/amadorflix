const fetch = require('node-fetch');
const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

console.log('🧪 Testando API do PushinPay diretamente...\n');

async function testPushinPayAPI() {
  try {
    console.log('📋 Configuração atual:');
    console.log(`   Ambiente: ${process.env.NODE_ENV || 'development'}`);
    console.log(`   API URL: ${PUSHINPAY_CONFIG.API_URL}`);
    console.log(`   Token: ${PUSHINPAY_CONFIG.TOKEN ? 'Configurado' : 'NÃO CONFIGURADO'}`);
    
    if (!PUSHINPAY_CONFIG.TOKEN) {
      console.error('❌ Token não configurado!');
      return;
    }

    console.log(`   Token (primeiros 10 chars): ${PUSHINPAY_CONFIG.TOKEN.substring(0, 10)}...\n`);

    // Teste 1: Criar PIX simples (sem split)
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
      
      if (response.status === 401) {
        console.log('🔍 Possíveis causas:');
        console.log('   - Token inválido ou expirado');
        console.log('   - Token não tem permissão para criar PIX');
        console.log('   - Ambiente incorreto (sandbox vs produção)');
      }
      
      return;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);
    console.log(`   QR Code: ${pixData.qr_code.substring(0, 50)}...`);

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
      
      if (errorData.message?.includes('split')) {
        console.log('🔍 Possíveis causas do erro de split:');
        console.log('   - Conta de split não encontrada');
        console.log('   - Conta de split não aprovada');
        console.log('   - Valor do split inválido');
      }
      
      return;
    }

    const splitPixData = await splitResponse.json();
    console.log('✅ PIX com split criado com sucesso!');
    console.log(`   ID: ${splitPixData.id}`);
    console.log(`   Status: ${splitPixData.status}`);
    console.log(`   Split Rules: ${JSON.stringify(splitPixData.split_rules)}`);

    console.log('\n🎉 Todos os testes passaram!');
    console.log('✅ Token está funcionando corretamente');
    console.log('✅ API está respondendo');
    console.log('✅ Split está configurado');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
    
    if (error.code === 'ENOTFOUND') {
      console.log('🔍 Possível problema de conectividade com a API');
    }
  }
}

// Executar teste
testPushinPayAPI(); 