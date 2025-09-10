// Script para testar a criação de PIX e verificar se o QR code está sendo retornado
require('dotenv').config();

async function testPixCreation() {
  try {
    console.log('🧪 Testando criação de PIX...\n');
    
    const testData = {
      value: 1490, // R$ 14,90
      email: 'teste@exemplo.com',
      planId: 'weekly',
      referralData: {
        source: 'direct',
        campaign: 'test',
        referrer: 'test'
      }
    };

    console.log('📤 Enviando dados:', testData);

    const response = await fetch('http://localhost:3000/api/premium/create-pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log(`📊 Status da resposta: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro na resposta:', errorText);
      return;
    }

    const pixData = await response.json();
    
    console.log('\n✅ PIX criado com sucesso!');
    console.log('📋 Dados retornados:');
    console.log('- ID:', pixData.id);
    console.log('- Status:', pixData.status);
    console.log('- Valor:', pixData.value);
    console.log('- Tem QR Code:', !!pixData.qr_code);
    console.log('- Tem QR Code Base64:', !!pixData.qr_code_base64);
    console.log('- Tamanho QR Code:', pixData.qr_code?.length || 0);
    console.log('- Tamanho QR Code Base64:', pixData.qr_code_base64?.length || 0);
    
    if (pixData.qr_code_base64) {
      console.log('- Preview QR Code Base64:', pixData.qr_code_base64.substring(0, 50) + '...');
      console.log('\n🎯 QR Code Base64 está presente!');
    } else {
      console.log('\n❌ QR Code Base64 não está presente!');
    }

  } catch (error) {
    console.error('❌ Erro ao testar criação de PIX:', error.message);
  }
}

testPixCreation();
