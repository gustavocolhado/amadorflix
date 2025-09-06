const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const mercadopago = require('mercadopago');

// Configurar Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

async function testStripeIntegration() {
  console.log('🧪 Testando integração Stripe...\n');

  try {
    // Testar criação de produto
    const product = await stripe.products.create({
      name: 'Premium Mensal',
      description: 'Assinatura premium mensal',
    });
    console.log('✅ Produto criado:', product.id);

    // Testar criação de preço
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 1990, // R$ 19,90 em centavos
      currency: 'brl',
      recurring: {
        interval: 'month',
      },
    });
    console.log('✅ Preço criado:', price.id);

    // Testar criação de sessão de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: 'http://localhost:3000/premium/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000/premium/cancel',
      customer_email: 'test@example.com',
    });
    console.log('✅ Sessão de checkout criada:', session.id);
    console.log('🔗 URL de checkout:', session.url);

    return { product, price, session };
  } catch (error) {
    console.error('❌ Erro no Stripe:', error.message);
    throw error;
  }
}

async function testMercadoPagoIntegration() {
  console.log('\n🧪 Testando integração Mercado Pago...\n');

  try {
    // Testar criação de preferência
    const preference = {
      items: [
        {
          title: 'Assinatura Premium - Mensal',
          unit_price: 19.90,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: 'test@example.com',
      },
      back_urls: {
        success: 'http://localhost:3000/premium/success',
        failure: 'http://localhost:3000/premium/cancel',
        pending: 'http://localhost:3000/premium/pending',
      },
      auto_return: 'approved',
      external_reference: 'test_user_monthly',
      notification_url: 'http://localhost:3000/api/mercado-pago/webhook',
    };

    const response = await mercadopago.preferences.create(preference);
    console.log('✅ Preferência criada:', response.body.id);
    console.log('🔗 URL de checkout:', response.body.init_point);

    return response.body;
  } catch (error) {
    console.error('❌ Erro no Mercado Pago:', error.message);
    throw error;
  }
}

async function testAPIs() {
  console.log('\n🧪 Testando APIs da aplicação...\n');

  try {
    // Testar API de criação de assinatura
    const createResponse = await fetch('http://localhost:3000/api/premium/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId: 'monthly',
        paymentMethod: 'stripe',
        stripePriceId: 'price_test',
        mercadoPagoId: 'premium_monthly_mp'
      }),
    });

    if (createResponse.ok) {
      const data = await createResponse.json();
      console.log('✅ API de criação de assinatura funcionando');
      console.log('📊 Resposta:', data);
    } else {
      console.log('⚠️ API de criação retornou status:', createResponse.status);
    }

  } catch (error) {
    console.error('❌ Erro ao testar APIs:', error.message);
  }
}

async function main() {
  console.log('🚀 Iniciando testes da integração premium...\n');

  try {
    // Verificar variáveis de ambiente
    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('⚠️ STRIPE_SECRET_KEY não configurada');
    }
    if (!process.env.MERCADO_PAGO_ACCESS_TOKEN) {
      console.log('⚠️ MERCADO_PAGO_ACCESS_TOKEN não configurada');
    }

    // Testar Stripe
    await testStripeIntegration();

    // Testar Mercado Pago
    await testMercadoPagoIntegration();

    // Testar APIs (se o servidor estiver rodando)
    await testAPIs();

    console.log('\n✅ Todos os testes concluídos!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente no .env');
    console.log('2. Inicie o servidor com: npm run dev');
    console.log('3. Acesse: http://localhost:3000/premium');
    console.log('4. Teste o fluxo de pagamento');

  } catch (error) {
    console.error('\n❌ Erro durante os testes:', error.message);
    console.log('\n💡 Dicas:');
    console.log('- Verifique se as chaves de API estão corretas');
    console.log('- Confirme se está usando ambiente de teste');
    console.log('- Verifique a documentação: docs/premium-integration.md');
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  testStripeIntegration,
  testMercadoPagoIntegration,
  testAPIs
}; 