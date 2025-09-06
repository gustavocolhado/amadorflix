const PUSHINPAY_CONFIG = {
  API_URL: process.env.PUSHINPAY_API_URL || 'https://api.pushinpay.com/api/pix/cashIn',
  TOKEN: process.env.PUSHINPAY_TOKEN,
  WEBHOOK_URL: process.env.PUSHINPAY_WEBHOOK_URL || 'http://localhost:3000/api/premium/webhook'
};

// Test different webhook payload formats
async function testWebhookFormats() {
  console.log('🧪 Testando diferentes formatos de webhook...\n');
  
  const testPayloads = [
    // JSON format (expected)
    {
      name: 'JSON Format',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: 'test-pix-id-123',
        status: 'paid',
        value: 990,
        end_to_end_id: 'E12345678202301011234567890123456',
        payer_name: 'João Silva',
        payer_national_registration: '12345678901'
      })
    },
    // Form data format (possible)
    {
      name: 'Form Data Format',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        id: 'test-pix-id-456',
        status: 'paid',
        value: '990',
        end_to_end_id: 'E12345678202301011234567890123456',
        payer_name: 'João Silva',
        payer_national_registration: '12345678901'
      }).toString()
    },
    // Raw text format (what might be causing the error)
    {
      name: 'Raw Text Format',
      headers: { 'Content-Type': 'text/plain' },
      body: 'invalid json content that starts with i'
    }
  ];

  for (const test of testPayloads) {
    console.log(`📝 Testando: ${test.name}`);
    
    try {
      const response = await fetch(PUSHINPAY_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: test.headers,
        body: test.body,
      });

      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Sucesso:', data);
      } else {
        const error = await response.text();
        console.log('   ❌ Erro:', error);
      }
    } catch (error) {
      console.log('   ❌ Exceção:', error.message);
    }
    
    console.log('');
  }
}

// Test with actual PushinPay webhook format
async function testPushinPayWebhook() {
  console.log('🔍 Testando formato real do PushinPay...\n');
  
  // Create a test PIX first
  try {
    const pixResponse = await fetch('http://localhost:3000/api/premium/create-pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        planId: '3days',
        value: 9.9
      }),
    });

    if (pixResponse.ok) {
      const pixData = await pixResponse.json();
      console.log('✅ PIX criado:', pixData.id);
      
      // Now test webhook with this PIX ID
      const webhookPayload = {
        id: pixData.id,
        status: 'paid',
        value: 990,
        end_to_end_id: 'E12345678202301011234567890123456',
        payer_name: 'Test User',
        payer_national_registration: '12345678901'
      };

      console.log('📝 Enviando webhook...');
      const webhookResponse = await fetch(PUSHINPAY_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      console.log(`   Status: ${webhookResponse.status} ${webhookResponse.statusText}`);
      
      if (webhookResponse.ok) {
        const data = await webhookResponse.json();
        console.log('   ✅ Webhook processado:', data);
      } else {
        const error = await webhookResponse.text();
        console.log('   ❌ Erro no webhook:', error);
      }
    } else {
      console.log('❌ Falha ao criar PIX para teste');
    }
  } catch (error) {
    console.log('❌ Erro no teste:', error.message);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Iniciando testes de webhook...\n');
  
  await testWebhookFormats();
  await testPushinPayWebhook();
  
  console.log('✅ Testes concluídos!');
}

// Check if running directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testWebhookFormats, testPushinPayWebhook }; 