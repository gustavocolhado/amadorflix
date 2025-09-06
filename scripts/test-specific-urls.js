const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSpecificUrls() {
  console.log('🧪 Testando URLs específicas de rastreamento de assinaturas...\n');

  // URLs de teste baseadas no exemplo fornecido
  const testUrls = [
    'https://vazadex.com/c?source=vzdx-01&campaign=trafficstars',
    'https://vazadex.com/c?source=vzdx-02&campaign=trafficstars',
    'https://vazadex.com/c?source=vzdx-03&campaign=trafficstars',
    'https://vazadex.com/c?source=vzdx-01&campaign=facebook',
    'https://vazadex.com/c?source=vzdx-02&campaign=google',
    'https://vazadex.com/c?source=trafficstars&campaign=vzdx-01',
    'https://vazadex.com/c?ref=vzdx-01&utm_campaign=trafficstars',
    'https://vazadex.com/c?utm_source=vzdx-01&utm_campaign=trafficstars'
  ];

  console.log('📋 URLs de teste que serão simuladas:');
  testUrls.forEach((url, index) => {
    console.log(`   ${index + 1}. ${url}`);
  });
  console.log('');

  // Simular extração de parâmetros
  console.log('🔍 Simulando extração de parâmetros de URL:');
  testUrls.forEach((url, index) => {
    const urlObj = new URL(url);
    const params = urlObj.searchParams;
    
    const source = params.get('source') || params.get('ref') || params.get('utm_source');
    const campaign = params.get('campaign') || params.get('utm_campaign') || params.get('xclickads');
    
    console.log(`   ${index + 1}. URL: ${url}`);
    console.log(`      Source: ${source || 'N/A'}`);
    console.log(`      Campaign: ${campaign || 'N/A'}`);
    console.log(`      Todos os parâmetros:`, Object.fromEntries(params.entries()));
    console.log('');
  });

  // Verificar se existem usuários com essas fontes específicas
  console.log('🔍 Verificando usuários existentes com fontes específicas:');
  
  const specificSources = ['vzdx-01', 'vzdx-02', 'vzdx-03', 'trafficstars'];
  
  for (const source of specificSources) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { referralSource: { contains: source } },
          { referralCampaign: { contains: source } }
        ]
      },
      select: {
        id: true,
        email: true,
        referralSource: true,
        referralCampaign: true,
        referralReferrer: true,
        premium: true,
        created_at: true
      },
      orderBy: { created_at: 'desc' }
    });

    if (users.length > 0) {
      console.log(`✅ Encontrados ${users.length} usuários com fonte "${source}":`);
      users.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Source: ${user.referralSource || 'N/A'}`);
        console.log(`      Campaign: ${user.referralCampaign || 'N/A'}`);
        console.log(`      Premium: ${user.premium ? 'Sim' : 'Não'}`);
        console.log(`      Criado em: ${user.created_at}`);
      });
    } else {
      console.log(`❌ Nenhum usuário encontrado com fonte "${source}"`);
    }
    console.log('');
  }

  // Verificar pagamentos PIX com essas fontes
  console.log('🔍 Verificando pagamentos PIX com fontes específicas:');
  
  for (const source of specificSources) {
    const payments = await prisma.pixPayment.findMany({
      where: {
        metadata: {
          path: ['referralSource'],
          string_contains: source
        }
      },
      select: {
        id: true,
        pixId: true,
        userEmail: true,
        planId: true,
        amount: true,
        status: true,
        metadata: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (payments.length > 0) {
      console.log(`✅ Encontrados ${payments.length} pagamentos PIX com fonte "${source}":`);
      payments.forEach((payment, index) => {
        console.log(`   ${index + 1}. PIX ID: ${payment.pixId}`);
        console.log(`      Email: ${payment.userEmail}`);
        console.log(`      Plano: ${payment.planId}`);
        console.log(`      Valor: R$ ${payment.amount}`);
        console.log(`      Status: ${payment.status}`);
        console.log(`      Metadados:`, payment.metadata);
      });
    } else {
      console.log(`❌ Nenhum pagamento PIX encontrado com fonte "${source}"`);
    }
    console.log('');
  }

  // Estatísticas de conversão
  console.log('📊 Estatísticas de conversão por fonte:');
  
  for (const source of specificSources) {
    const totalUsers = await prisma.user.count({
      where: {
        OR: [
          { referralSource: { contains: source } },
          { referralCampaign: { contains: source } }
        ]
      }
    });

    const premiumUsers = await prisma.user.count({
      where: {
        AND: [
          {
            OR: [
              { referralSource: { contains: source } },
              { referralCampaign: { contains: source } }
            ]
          },
          { premium: true }
        ]
      }
    });

    const conversionRate = totalUsers > 0 ? ((premiumUsers / totalUsers) * 100).toFixed(1) : 0;

    console.log(`   ${source}:`);
    console.log(`      Total de usuários: ${totalUsers}`);
    console.log(`      Usuários premium: ${premiumUsers}`);
    console.log(`      Taxa de conversão: ${conversionRate}%`);
    console.log('');
  }

  // Verificar se há dados de URL completa
  console.log('🔍 Verificando dados de URL completa nos metadados:');
  const paymentsWithUrl = await prisma.pixPayment.findMany({
    where: {
      metadata: {
        path: ['currentUrl'],
        not: null
      }
    },
    select: {
      id: true,
      pixId: true,
      userEmail: true,
      metadata: true,
      createdAt: true
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  if (paymentsWithUrl.length > 0) {
    console.log(`✅ Encontrados ${paymentsWithUrl.length} pagamentos com URL completa:`);
    paymentsWithUrl.forEach((payment, index) => {
      console.log(`   ${index + 1}. PIX ID: ${payment.pixId}`);
      console.log(`      Email: ${payment.userEmail}`);
      console.log(`      URL: ${payment.metadata.currentUrl}`);
      console.log(`      Source: ${payment.metadata.referralSource}`);
      console.log(`      Campaign: ${payment.metadata.referralCampaign}`);
    });
  } else {
    console.log('❌ Nenhum pagamento com URL completa encontrado.');
  }

  console.log('\n✅ Teste de URLs específicas concluído!');
}

// Executar o teste
testSpecificUrls().catch(console.error).finally(() => prisma.$disconnect());
