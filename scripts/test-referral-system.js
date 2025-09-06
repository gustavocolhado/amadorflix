const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testReferralSystem() {
  try {
    console.log('🧪 Testando sistema de referência...\n');

    // Simular diferentes cenários de referência
    const testScenarios = [
      {
        name: 'Site externo com parâmetro xclickads',
        url: 'https://vazadex.com/?source=pornocarioca.com&campaign=xclickads&utm_source=google',
        referrer: 'https://pornocarioca.com/alguma-pagina'
      },
      {
        name: 'Busca orgânica do Google',
        url: 'https://vazadex.com/?utm_source=google&utm_medium=organic&utm_campaign=search',
        referrer: 'https://www.google.com/search?q=vazadex'
      },
      {
        name: 'Rede social (Instagram)',
        url: 'https://vazadex.com/?source=instagram&campaign=story',
        referrer: 'https://www.instagram.com/stories/algum-perfil'
      },
      {
        name: 'Acesso direto (sem referência)',
        url: 'https://vazadex.com/',
        referrer: ''
      }
    ];

    for (const scenario of testScenarios) {
      console.log(`📊 Cenário: ${scenario.name}`);
      console.log(`URL: ${scenario.url}`);
      console.log(`Referrer: ${scenario.referrer || 'Nenhum'}`);
      
      // Simular captura de dados de referência
      const urlParams = new URLSearchParams(scenario.url.split('?')[1] || '');
      const source = urlParams.get('source') || urlParams.get('ref') || urlParams.get('utm_source');
      const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign') || urlParams.get('xclickads');
      const referrerDomain = scenario.referrer ? new URL(scenario.referrer).hostname : null;
      
      const finalSource = source || referrerDomain || 'direct';
      const finalCampaign = campaign || 'organic';
      const finalReferrer = scenario.referrer || 'direct';
      
      console.log(`📈 Dados capturados:`);
      console.log(`  - Source: ${finalSource}`);
      console.log(`  - Campaign: ${finalCampaign}`);
      console.log(`  - Referrer: ${finalReferrer}`);
      console.log('---\n');
    }

    // Verificar dados salvos no banco
    console.log('🗄️ Verificando dados salvos no banco...\n');

    // Verificar usuários com dados de referência
    const usersWithReferral = await prisma.user.findMany({
      where: {
        OR: [
          { referralSource: { not: null } },
          { referralCampaign: { not: null } },
          { referralReferrer: { not: null } }
        ]
      },
      select: {
        id: true,
        email: true,
        referralSource: true,
        referralCampaign: true,
        referralReferrer: true,
        referralTimestamp: true,
        created_at: true
      },
      take: 5
    });

    console.log(`👥 Usuários com dados de referência encontrados: ${usersWithReferral.length}`);
    usersWithReferral.forEach((user, index) => {
      console.log(`\n${index + 1}. Usuário: ${user.email}`);
      console.log(`   - Source: ${user.referralSource || 'N/A'}`);
      console.log(`   - Campaign: ${user.referralCampaign || 'N/A'}`);
      console.log(`   - Referrer: ${user.referralReferrer || 'N/A'}`);
      console.log(`   - Timestamp: ${user.referralTimestamp || 'N/A'}`);
      console.log(`   - Criado em: ${user.created_at}`);
    });

    // Verificar pagamentos PIX com metadados
    const pixPaymentsWithMetadata = await prisma.pixPayment.findMany({
      where: {
        metadata: { not: null }
      },
      select: {
        id: true,
        userEmail: true,
        metadata: true,
        createdAt: true
      },
      take: 5
    });

    console.log(`\n💰 Pagamentos PIX com metadados encontrados: ${pixPaymentsWithMetadata.length}`);
    pixPaymentsWithMetadata.forEach((payment, index) => {
      console.log(`\n${index + 1}. Pagamento: ${payment.userEmail}`);
      console.log(`   - Metadata: ${JSON.stringify(payment.metadata, null, 2)}`);
      console.log(`   - Criado em: ${payment.createdAt}`);
    });

    // Estatísticas gerais
    console.log('\n📊 Estatísticas gerais:');
    
    const totalUsers = await prisma.user.count();
    const usersWithReferralCount = await prisma.user.count({
      where: {
        referralSource: { not: null }
      }
    });
    
    const totalPixPayments = await prisma.pixPayment.count();
    const pixPaymentsWithMetadataCount = await prisma.pixPayment.count({
      where: {
        metadata: { not: null }
      }
    });

    console.log(`   - Total de usuários: ${totalUsers}`);
    console.log(`   - Usuários com referência: ${usersWithReferralCount} (${((usersWithReferralCount/totalUsers)*100).toFixed(1)}%)`);
    console.log(`   - Total de pagamentos PIX: ${totalPixPayments}`);
    console.log(`   - PIX com metadados: ${pixPaymentsWithMetadataCount} (${((pixPaymentsWithMetadataCount/totalPixPayments)*100).toFixed(1)}%)`);

  } catch (error) {
    console.error('❌ Erro ao testar sistema de referência:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testReferralSystem(); 