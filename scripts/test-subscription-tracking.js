const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSubscriptionTracking() {
  console.log('🧪 Testando sistema de rastreamento de assinaturas...\n');

  try {
    // 1. Verificar usuários com dados de referência
    console.log('1. Verificando usuários com dados de referência:');
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
        created_at: true,
        premium: true
      },
      orderBy: { created_at: 'desc' },
      take: 10
    });

    if (usersWithReferral.length > 0) {
      console.log(`✅ Encontrados ${usersWithReferral.length} usuários com dados de referência:`);
      usersWithReferral.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Source: ${user.referralSource || 'N/A'}`);
        console.log(`      Campaign: ${user.referralCampaign || 'N/A'}`);
        console.log(`      Referrer: ${user.referralReferrer || 'N/A'}`);
        console.log(`      Premium: ${user.premium ? 'Sim' : 'Não'}`);
        console.log(`      Criado em: ${user.created_at}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum usuário com dados de referência encontrado.');
    }

    // 2. Verificar pagamentos PIX com metadados de referência
    console.log('2. Verificando pagamentos PIX com metadados de referência:');
    const pixPaymentsWithMetadata = await prisma.pixPayment.findMany({
      where: {
        metadata: { not: null }
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
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    if (pixPaymentsWithMetadata.length > 0) {
      console.log(`✅ Encontrados ${pixPaymentsWithMetadata.length} pagamentos PIX com metadados:`);
      pixPaymentsWithMetadata.forEach((payment, index) => {
        console.log(`   ${index + 1}. PIX ID: ${payment.pixId}`);
        console.log(`      Email: ${payment.userEmail}`);
        console.log(`      Plano: ${payment.planId}`);
        console.log(`      Valor: R$ ${payment.amount}`);
        console.log(`      Status: ${payment.status}`);
        console.log(`      Metadados:`, payment.metadata);
        console.log(`      Criado em: ${payment.createdAt}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum pagamento PIX com metadados encontrado.');
    }

    // 3. Estatísticas de fontes de referência
    console.log('3. Estatísticas de fontes de referência:');
    const referralStats = await prisma.user.groupBy({
      by: ['referralSource'],
      _count: {
        referralSource: true
      },
      where: {
        referralSource: { not: null }
      },
      orderBy: {
        _count: {
          referralSource: 'desc'
        }
      }
    });

    if (referralStats.length > 0) {
      console.log('✅ Fontes de referência mais comuns:');
      referralStats.forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.referralSource}: ${stat._count.referralSource} usuários`);
      });
    } else {
      console.log('❌ Nenhuma estatística de referência disponível.');
    }

    // 4. Estatísticas de campanhas
    console.log('\n4. Estatísticas de campanhas:');
    const campaignStats = await prisma.user.groupBy({
      by: ['referralCampaign'],
      _count: {
        referralCampaign: true
      },
      where: {
        referralCampaign: { not: null }
      },
      orderBy: {
        _count: {
          referralCampaign: 'desc'
        }
      }
    });

    if (campaignStats.length > 0) {
      console.log('✅ Campanhas mais comuns:');
      campaignStats.forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.referralCampaign}: ${stat._count.referralCampaign} usuários`);
      });
    } else {
      console.log('❌ Nenhuma estatística de campanha disponível.');
    }

    // 5. Verificar URLs específicas mencionadas
    console.log('\n5. Verificando URLs específicas (vzdx-01, trafficstars):');
    const specificReferrals = await prisma.user.findMany({
      where: {
        OR: [
          { referralSource: { contains: 'vzdx' } },
          { referralCampaign: { contains: 'trafficstars' } },
          { referralSource: { contains: 'trafficstars' } },
          { referralCampaign: { contains: 'vzdx' } }
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

    if (specificReferrals.length > 0) {
      console.log(`✅ Encontrados ${specificReferrals.length} usuários com URLs específicas:`);
      specificReferrals.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Source: ${user.referralSource || 'N/A'}`);
        console.log(`      Campaign: ${user.referralCampaign || 'N/A'}`);
        console.log(`      Referrer: ${user.referralReferrer || 'N/A'}`);
        console.log(`      Premium: ${user.premium ? 'Sim' : 'Não'}`);
        console.log(`      Criado em: ${user.created_at}`);
        console.log('');
      });
    } else {
      console.log('❌ Nenhum usuário com URLs específicas encontrado.');
    }

    // 6. Resumo geral
    console.log('\n6. Resumo geral:');
    const totalUsers = await prisma.user.count();
    const usersWithReferralCount = await prisma.user.count({
      where: {
        OR: [
          { referralSource: { not: null } },
          { referralCampaign: { not: null } },
          { referralReferrer: { not: null } }
        ]
      }
    });
    const premiumUsers = await prisma.user.count({
      where: { premium: true }
    });
    const totalPixPayments = await prisma.pixPayment.count();

    console.log(`   Total de usuários: ${totalUsers}`);
    console.log(`   Usuários com referência: ${usersWithReferralCount} (${((usersWithReferralCount / totalUsers) * 100).toFixed(1)}%)`);
    console.log(`   Usuários premium: ${premiumUsers} (${((premiumUsers / totalUsers) * 100).toFixed(1)}%)`);
    console.log(`   Total de pagamentos PIX: ${totalPixPayments}`);

  } catch (error) {
    console.error('❌ Erro ao testar sistema de rastreamento:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testSubscriptionTracking();
