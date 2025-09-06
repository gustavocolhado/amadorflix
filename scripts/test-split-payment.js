require('dotenv').config();
const fetch = require('node-fetch');

// Configurações
const API_URL = 'http://localhost:3000/api/premium/create-pix';
const PUSHINPAY_TOKEN = process.env.PUSHINPAY_TOKEN;

// Verificar ambiente
const NODE_ENV = process.env.NODE_ENV || 'development';
const PUSHINPAY_API_URL = NODE_ENV === 'development' 
  ? 'https://api-sandbox.pushinpay.com.br'
  : 'https://api.pushinpay.com.br';

console.log(`🌍 Ambiente: ${NODE_ENV}`);
console.log(`🔗 API PushinPay: ${PUSHINPAY_API_URL}`);
console.log(`🔑 Token configurado: ${PUSHINPAY_TOKEN ? 'Sim' : 'Não'}\n`);

// Dados de teste
const testData = {
  value: 1990, // R$ 19,90 (plano de 3 meses)
  email: 'teste@exemplo.com',
  planId: '3months'
};

async function testSplitPayment() {
  console.log('🧪 Testando sistema de split do PushinPay...\n');
  
  try {
    // Teste 1: Criar PIX com split
    console.log('📝 Teste 1: Criando PIX com split...');
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Erro ao criar PIX:', error);
      return;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso!');
    console.log('📊 Dados do PIX:');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Valor: R$ ${(pixData.value / 100).toFixed(2)}`);
    console.log(`   Status: ${pixData.status}`);
    console.log(`   QR Code: ${pixData.qr_code.substring(0, 50)}...`);
    
    // Calcular valores do split
    const totalValue = pixData.value;
    const splitValue = Math.round(totalValue * 0.30);
    const mainValue = totalValue - splitValue;
    
    console.log('\n💰 Divisão do Split:');
    console.log(`   Valor Total: R$ ${(totalValue / 100).toFixed(2)}`);
    console.log(`   Conta Principal (70%): R$ ${(mainValue / 100).toFixed(2)}`);
    console.log(`   Conta de Split (30%): R$ ${(splitValue / 100).toFixed(2)}`);
    
    // Teste 2: Verificar status do pagamento
    console.log('\n📝 Teste 2: Verificando status do pagamento...');
    const statusResponse = await fetch('http://localhost:3000/api/premium/check-payment-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pixId: pixData.id }),
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      console.log('✅ Status verificado com sucesso!');
      console.log(`   Status: ${statusData.status}`);
      console.log(`   Pago: ${statusData.paid}`);
    } else {
      console.log('⚠️  Status ainda pendente (normal para PIX recém-criado)');
    }
    
    console.log('\n🎉 Teste concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Use o QR Code para fazer o pagamento');
    console.log('   2. Aguarde a confirmação automática');
    console.log('   3. Verifique se o acesso premium foi ativado');
    
  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
  }
}

// Função para testar diferentes valores
async function testDifferentValues() {
  console.log('\n🧪 Testando diferentes valores...\n');
  
  const testValues = [
    { value: 990, plan: '3days', description: '3 dias - R$ 9,90' },
    { value: 1490, plan: '1month', description: '1 mês - R$ 14,90' },
    { value: 1990, plan: '3months', description: '3 meses - R$ 19,90' },
    { value: 3990, plan: '12months', description: '12 meses - R$ 39,90' },
    { value: 9990, plan: 'lifetime', description: 'Vitalício - R$ 99,90' }
  ];
  
  for (const test of testValues) {
    console.log(`📝 Testando: ${test.description}`);
    
    const splitValue = Math.round(test.value * 0.30);
    const mainValue = test.value - splitValue;
    
    console.log(`   Split: R$ ${(mainValue / 100).toFixed(2)} (70%) + R$ ${(splitValue / 100).toFixed(2)} (30%)`);
    
    // Validar se o valor mínimo é respeitado
    if (test.value < 50) {
      console.log('   ❌ Valor abaixo do mínimo (50 centavos)');
    } else {
      console.log('   ✅ Valor válido');
    }
    
    console.log('');
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes do sistema de split...\n');
  
  // Verificar se o token está configurado
  if (!PUSHINPAY_TOKEN) {
    console.error('❌ PUSHINPAY_TOKEN não configurado!');
    console.log('   Configure a variável de ambiente PUSHINPAY_TOKEN');
    return;
  }
  
  await testDifferentValues();
  await testSplitPayment();
}

// Executar se chamado diretamente
if (require.main === module) {
  runTests();
}

module.exports = { testSplitPayment, testDifferentValues }; 