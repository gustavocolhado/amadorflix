const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCampaignsPage() {
  console.log('🧪 Testando página de campanhas...\n');

  try {
    // Simular dados que a API de campanhas retorna
    const period = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    console.log(`📅 Período de análise: ${period} dias (desde ${startDate.toLocaleDateString('pt-BR')})`);

    // 1. Resumo geral
    console.log('\n1. 📊 Resumo Geral:');
    const totalUsers = await prisma.user.count({
      where: {
        created_at: {
          gte: startDate
        }
      }
    });

    const usersWithReferral = await prisma.user.count({
      where: {
        created_at: {
          gte: startDate
        },
        OR: [
          { referralSource: { not: null } },
          { referralCampaign: { not: null } }
        ]
      }
    });

    const premiumUsers = await prisma.user.count({
      where: {
        created_at: {
          gte: startDate
        },
        premium: true
      }
    });

    const totalPixPayments = await prisma.pixPayment.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    const totalRevenue = await prisma.pixPayment.aggregate({
      where: {
        createdAt: {
          gte: startDate
        },
        status: 'paid'
      },
      _sum: {
        amount: true
      }
    });

    console.log(`   Total de usuários: ${totalUsers}`);
    console.log(`   Usuários com referência: ${usersWithReferral} (${((usersWithReferral / totalUsers) * 100).toFixed(1)}%)`);
    console.log(`   Usuários premium: ${premiumUsers} (${((premiumUsers / totalUsers) * 100).toFixed(1)}%)`);
    console.log(`   Total de pagamentos PIX: ${totalPixPayments}`);
    console.log(`   Receita total: R$ ${(totalRevenue._sum.amount || 0).toFixed(2)}`);

    // 2. Estatísticas de conversão por fonte
    console.log('\n2. 🎯 Estatísticas de Conversão por Fonte:');
    const conversionStats = await prisma.user.groupBy({
      by: ['referralSource', 'referralCampaign'],
      _count: {
        id: true
      },
      where: {
        created_at: {
          gte: startDate
        },
        referralSource: { not: null }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // Calcular conversão para cada grupo
    const conversionStatsWithRates = await Promise.all(
      conversionStats.map(async (stat) => {
        const premiumUsers = await prisma.user.count({
          where: {
            created_at: { gte: startDate },
            referralSource: stat.referralSource,
            referralCampaign: stat.referralCampaign,
            premium: true
          }
        });
        
        return {
          referralSource: stat.referralSource,
          referralCampaign: stat.referralCampaign,
          total_users: stat._count.id,
          premium_users: premiumUsers,
          conversion_rate: ((premiumUsers / stat._count.id) * 100).toFixed(2)
        };
      })
    );

    if (conversionStatsWithRates.length > 0) {
      console.log('   Top 10 campanhas por conversão:');
      conversionStatsWithRates.slice(0, 10).forEach((stat, index) => {
        console.log(`   ${index + 1}. ${stat.referralSource} | ${stat.referralCampaign}`);
        console.log(`      Usuários: ${stat.total_users} | Premium: ${stat.premium_users} | Conversão: ${stat.conversion_rate}%`);
      });
    } else {
      console.log('   ❌ Nenhuma estatística de conversão disponível.');
    }

    // 3. Receita por campanha
    console.log('\n3. 💰 Receita por Campanha:');
    const pixPaymentsForRevenue = await prisma.pixPayment.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        metadata: {
          not: null
        }
      },
      select: {
        amount: true,
        status: true,
        metadata: true
      }
    });

    // Agrupar por fonte e campanha
    const revenueByCampaign = pixPaymentsForRevenue.reduce((acc, payment) => {
      const source = payment.metadata?.referralSource || 'unknown';
      const campaign = payment.metadata?.referralCampaign || 'unknown';
      const key = `${source}|${campaign}`;
      
      if (!acc[key]) {
        acc[key] = {
          source,
          campaign,
          total_payments: 0,
          total_revenue: 0,
          paid_payments: 0
        };
      }
      
      acc[key].total_payments++;
      acc[key].total_revenue += payment.amount;
      if (payment.status === 'paid') {
        acc[key].paid_payments++;
      }
      
      return acc;
    }, {});

    const revenueByCampaignArray = Object.values(revenueByCampaign)
      .map(item => ({
        ...item,
        avg_payment: item.total_payments > 0 ? item.total_revenue / item.total_payments : 0
      }))
      .sort((a, b) => b.total_revenue - a.total_revenue);

    if (revenueByCampaignArray.length > 0) {
      console.log('   Top 10 campanhas por receita:');
      revenueByCampaignArray.slice(0, 10).forEach((revenue, index) => {
        console.log(`   ${index + 1}. ${revenue.source} | ${revenue.campaign}`);
        console.log(`      Pagamentos: ${revenue.total_payments} | Pagos: ${revenue.paid_payments}`);
        console.log(`      Receita: R$ ${(revenue.total_revenue || 0).toFixed(2)} | Ticket médio: R$ ${(revenue.avg_payment || 0).toFixed(2)}`);
      });
    } else {
      console.log('   ❌ Nenhuma receita por campanha disponível.');
    }

    // 4. URLs mais efetivas
    console.log('\n4. 🌐 URLs Mais Efetivas:');
    const pixPaymentsWithUrls = await prisma.pixPayment.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        metadata: {
          not: null
        }
      },
      select: {
        amount: true,
        metadata: true
      }
    });

    // Agrupar por URL
    const topUrls = pixPaymentsWithUrls.reduce((acc, payment) => {
      const url = payment.metadata?.currentUrl;
      const source = payment.metadata?.referralSource;
      const campaign = payment.metadata?.referralCampaign;
      
      if (!url) return acc;
      
      const key = `${url}|${source}|${campaign}`;
      
      if (!acc[key]) {
        acc[key] = {
          url,
          source,
          campaign,
          conversions: 0,
          revenue: 0
        };
      }
      
      acc[key].conversions++;
      acc[key].revenue += payment.amount;
      
      return acc;
    }, {});

    const topUrlsArray = Object.values(topUrls)
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10);

    if (topUrlsArray.length > 0) {
      console.log('   Top 10 URLs por conversões:');
      topUrlsArray.forEach((url, index) => {
        console.log(`   ${index + 1}. ${url.url}`);
        console.log(`      Fonte: ${url.source} | Campanha: ${url.campaign}`);
        console.log(`      Conversões: ${url.conversions} | Receita: R$ ${(url.revenue || 0).toFixed(2)}`);
      });
    } else {
      console.log('   ❌ Nenhuma URL efetiva encontrada.');
    }

    // 5. Usuários com referência
    console.log('\n5. 👥 Usuários com Referência (últimos 10):');
    const usersWithReferralData = await prisma.user.findMany({
      where: {
        created_at: {
          gte: startDate
        },
        OR: [
          { referralSource: { not: null } },
          { referralCampaign: { not: null } }
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
      orderBy: {
        created_at: 'desc'
      },
      take: 10
    });

    if (usersWithReferralData.length > 0) {
      usersWithReferralData.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Fonte: ${user.referralSource || 'N/A'} | Campanha: ${user.referralCampaign || 'N/A'}`);
        console.log(`      Premium: ${user.premium ? 'Sim' : 'Não'} | Criado: ${user.created_at.toLocaleDateString('pt-BR')}`);
      });
    } else {
      console.log('   ❌ Nenhum usuário com referência encontrado.');
    }

    // 6. Pagamentos PIX com metadados
    console.log('\n6. 💳 Pagamentos PIX com Metadados (últimos 10):');
    const pixPaymentsWithMetadata = await prisma.pixPayment.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        metadata: {
          not: null
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
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    if (pixPaymentsWithMetadata.length > 0) {
      pixPaymentsWithMetadata.forEach((payment, index) => {
        console.log(`   ${index + 1}. PIX ID: ${payment.pixId}`);
        console.log(`      Email: ${payment.userEmail} | Plano: ${payment.planId} | Valor: R$ ${payment.amount}`);
        console.log(`      Status: ${payment.status} | Fonte: ${payment.metadata?.referralSource || 'N/A'}`);
        console.log(`      Campanha: ${payment.metadata?.referralCampaign || 'N/A'}`);
      });
    } else {
      console.log('   ❌ Nenhum pagamento PIX com metadados encontrado.');
    }

    // 7. Verificar URLs específicas mencionadas
    console.log('\n7. 🎯 Verificando URLs Específicas (vzdx-01, trafficstars):');
    const specificReferrals = await prisma.user.findMany({
      where: {
        created_at: {
          gte: startDate
        },
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
      console.log(`   ✅ Encontrados ${specificReferrals.length} usuários com URLs específicas:`);
      specificReferrals.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email}`);
        console.log(`      Source: ${user.referralSource || 'N/A'} | Campaign: ${user.referralCampaign || 'N/A'}`);
        console.log(`      Premium: ${user.premium ? 'Sim' : 'Não'} | Criado: ${user.created_at.toLocaleDateString('pt-BR')}`);
      });
    } else {
      console.log('   ❌ Nenhum usuário com URLs específicas encontrado.');
    }

    console.log('\n✅ Teste da página de campanhas concluído!');
    console.log('\n📋 Próximos passos:');
    console.log('   1. Acesse /admin/campaigns no painel administrativo');
    console.log('   2. Use os filtros para analisar diferentes períodos');
    console.log('   3. Exporte os dados em CSV para análise externa');
    console.log('   4. Monitore as URLs específicas (vzdx-01, trafficstars)');

  } catch (error) {
    console.error('❌ Erro ao testar página de campanhas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar o teste
testCampaignsPage();
