require('dotenv').config();
const fetch = require('node-fetch');

console.log('🧪 Testando token na API de produção...\n');

async function testProductionToken() {
  try {
    const token = process.env.PUSHINPAY_TOKEN;
    
    if (!token) {
      console.error('❌ Token não configurado!');
      return;
    }

    console.log('📋 Configuração:');
    console.log(`   Token: ${token.substring(0, 10)}...`);
    console.log(`   Comprimento: ${token.length} caracteres\n`);

    // Testar na API de produção
    const productionUrl = 'https://api.pushinpay.com.br/api/pix/cashIn';
    
    console.log('📝 Testando na API de produção...');
    
    const payload = {
      value: 100, // R$ 1,00 em centavos
    };

    const response = await fetch(productionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ Erro na API de produção:', errorData);
      
      if (response.status === 401) {
        console.log('\n🔍 Análise do erro 401:');
        console.log('   - Token pode estar inválido ou expirado');
        console.log('   - Token pode não ter permissão para criar PIX');
        console.log('   - Conta pode não estar aprovada');
      }
      
      return;
    }

    const pixData = await response.json();
    console.log('✅ PIX criado com sucesso na produção!');
    console.log(`   ID: ${pixData.id}`);
    console.log(`   Status: ${pixData.status}`);

    console.log('\n🎉 Token funciona na API de produção!');
    console.log('💡 Isso indica que o problema pode ser:');
    console.log('   1. Token não tem acesso ao sandbox');
    console.log('   2. Conta não foi liberada para sandbox');
    console.log('   3. Precisa solicitar liberação do sandbox ao suporte');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error.message);
  }
}

// Executar teste
testProductionToken(); 