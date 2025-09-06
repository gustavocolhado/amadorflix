require('dotenv').config();
const fetch = require('node-fetch');

console.log('🧪 Testando sistema completo com webhook...\n');

// Configuração
const { PUSHINPAY_CONFIG } = require('../config/pushinpay.js');

// Função para criar PIX
async function createPix() {
  console.log('📝 Criando PIX...');
  
  try {
    const payload = {
      value: 100, // R$ 1,00 em centavos
      email: 'teste@exemplo.com',
      planId: '1month'
    };

    const response = await fetch('http://localhost:3000/api/premium/create-pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro ao criar PIX:', error);
      return null;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Valor: R$ ${(pixData.value / 100).toFixed(2)}`);
    console.log(`   Status: ${pixData.status}`);
    
    return pixData;

  } catch (error) {
    console.error('❌ Erro ao criar PIX:', error.message);
    return null;
  }
}

// Função para simular webhook
async function simulateWebhook(pixId) {
  console.log('\n📝 Simulando webhook de pagamento...');
  
  try {
    const webhookPayload = {
      id: pixId,
      status: 'paid',
      value: 100,
      end_to_end_id: 'E12345678202301011234567890123456',
      payer_name: 'João Silva',
      payer_national_registration: '12345678901'
    };

    const response = await fetch('http://localhost:3000/api/premium/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(webhookPayload),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Webhook processado com sucesso!');
      console.log('   Resposta:', data);
      return true;
    } else {
      const error = await response.json();
      console.error('❌ Erro no webhook:', error);
      return false;
    }

  } catch (error) {
    console.error('❌ Erro ao simular webhook:', error.message);
    return false;
  }
}

// Função para verificar status no banco local
async function checkLocalStatus(pixId) {
  console.log('\n📝 Verificando status no banco local...');
  
  try {
    const response = await fetch(`http://localhost:3000/api/premium/check-payment-status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pixId }),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Status verificado com sucesso!');
      console.log(`   Pago: ${data.paid}`);
      console.log(`   Status: ${data.status}`);
      return data;
    } else {
      const error = await response.json();
      console.error('❌ Erro ao verificar status:', error);
      return null;
    }

  } catch (error) {
    console.error('❌ Erro ao verificar status:', error.message);
    return null;
  }
}

// Função para verificar status na PushinPay
async function checkPushinPayStatus(pixId) {
  console.log('\n📝 Verificando status na PushinPay...');
  
  try {
    const baseUrl = PUSHINPAY_CONFIG.API_URL.replace('/api/pix/cashIn', '/api/transactions');
    const statusUrl = `${baseUrl}/${pixId}`;

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
      console.log('✅ Status na PushinPay:');
      console.log(`   Status: ${data.status}`);
      console.log(`   Valor: R$ ${(data.value / 100).toFixed(2)}`);
      return data;
    } else {
      console.log('❌ Erro ao consultar PushinPay');
      return null;
    }

  } catch (error) {
    console.error('❌ Erro ao consultar PushinPay:', error.message);
    return null;
  }
}

// Função principal de teste
async function runWebhookTest() {
  console.log('🚀 Iniciando teste do sistema com webhook...\n');

  // 1. Criar PIX
  const pixData = await createPix();
  if (!pixData) {
    console.log('❌ Falha ao criar PIX. Teste interrompido.');
    return;
  }

  // 2. Verificar status inicial na PushinPay
  const initialStatus = await checkPushinPayStatus(pixData.id);
  console.log(`   Status inicial na PushinPay: ${initialStatus?.status || 'N/A'}`);

  // 3. Simular webhook de pagamento
  const webhookSuccess = await simulateWebhook(pixData.id);
  if (!webhookSuccess) {
    console.log('❌ Falha no webhook. Teste interrompido.');
    return;
  }

  // 4. Verificar status no banco local (deve estar pago)
  const localStatus = await checkLocalStatus(pixData.id);
  
  // 5. Verificar status na PushinPay (pode ainda estar created)
  const pushinPayStatus = await checkPushinPayStatus(pixData.id);

  console.log('\n🎯 Resultados:');
  console.log(`   Webhook processado: ${webhookSuccess ? '✅ Sim' : '❌ Não'}`);
  console.log(`   Status local: ${localStatus?.status || 'N/A'}`);
  console.log(`   Status PushinPay: ${pushinPayStatus?.status || 'N/A'}`);

  if (localStatus && localStatus.paid) {
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('✅ PIX criado');
    console.log('✅ Webhook processado');
    console.log('✅ Status atualizado no banco local');
    console.log('✅ Sistema funcionando perfeitamente');
    console.log('\n💡 Nota: O status na PushinPay pode ainda mostrar "created"');
    console.log('   porque o webhook simulado não atualiza a API externa.');
  } else {
    console.log('\n❌ Teste falhou');
    console.log('💡 Verifique os logs acima para mais detalhes');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runWebhookTest();
}

module.exports = { createPix, simulateWebhook, checkLocalStatus, checkPushinPayStatus }; 