import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // dias
    const source = searchParams.get('source');
    const campaign = searchParams.get('campaign');

    // Calcular data de início baseada no período
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Construir filtros
    const whereClause: any = {
      created_at: {
        gte: startDate
      }
    };

    if (source) {
      whereClause.referralSource = { contains: source };
    }

    if (campaign) {
      whereClause.referralCampaign = { contains: campaign };
    }

    // 1. Estatísticas gerais de campanhas
    const campaignStats = await prisma.user.groupBy({
      by: ['referralSource', 'referralCampaign'],
      _count: {
        id: true
      },
      where: {
        ...whereClause,
        OR: [
          { referralSource: { not: null } },
          { referralCampaign: { not: null } }
        ]
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    });

    // 2. Pagamentos PIX por campanha
    const pixPaymentsByCampaign = await prisma.pixPayment.groupBy({
      by: ['planId'],
      _count: {
        id: true
      },
      _sum: {
        amount: true
      },
      where: {
        createdAt: {
          gte: startDate
        },
        metadata: {
          not: null
        }
      }
    });

    // 3. Dados detalhados de usuários com referência
    const usersWithReferral = await prisma.user.findMany({
      where: {
        ...whereClause,
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
        referralTimestamp: true,
        premium: true,
        created_at: true,
        paymentDate: true,
        expireDate: true
      },
      orderBy: {
        created_at: 'desc'
      },
      take: 100
    });

    // 4. Pagamentos PIX com metadados
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
        createdAt: true,
        paidAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    // 5. Estatísticas de conversão - usando findMany em vez de queryRaw para MongoDB
    const allUsersWithReferral = await prisma.user.findMany({
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
        referralSource: true,
        referralCampaign: true,
        premium: true
      }
    });

    // Agrupar dados manualmente
    const conversionStatsMap = allUsersWithReferral.reduce((acc: any, user) => {
      const key = `${user.referralSource || 'N/A'}|${user.referralCampaign || 'N/A'}`;
      if (!acc[key]) {
        acc[key] = {
          referralSource: user.referralSource,
          referralCampaign: user.referralCampaign,
          total_users: 0,
          premium_users: 0
        };
      }
      acc[key].total_users++;
      if (user.premium) {
        acc[key].premium_users++;
      }
      return acc;
    }, {});

    const conversionStats = Object.values(conversionStatsMap).map((stat: any) => ({
      ...stat,
      conversion_rate: stat.total_users > 0 ? ((stat.premium_users / stat.total_users) * 100).toFixed(2) : 0
    })).sort((a: any, b: any) => b.total_users - a.total_users);

    // 6. Receita por campanha - usando findMany
    const allPixPayments = await prisma.pixPayment.findMany({
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

    const revenueByCampaignMap = allPixPayments.reduce((acc: any, payment) => {
      const metadata = payment.metadata as any;
      const source = metadata?.referralSource || 'N/A';
      const campaign = metadata?.referralCampaign || 'N/A';
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

    const revenueByCampaign = Object.values(revenueByCampaignMap).map((item: any) => ({
      ...item,
      avg_payment: item.total_payments > 0 ? item.total_revenue / item.total_payments : 0
    })).sort((a: any, b: any) => b.total_revenue - a.total_revenue);

    // 7. URLs mais efetivas
    const topUrlsMap = allPixPayments.reduce((acc: any, payment) => {
      const metadata = payment.metadata as any;
      const url = metadata?.currentUrl;
      const source = metadata?.referralSource;
      const campaign = metadata?.referralCampaign;
      
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

    const topUrls = Object.values(topUrlsMap)
      .sort((a: any, b: any) => b.conversions - a.conversions)
      .slice(0, 20);

    // 8. Resumo geral
    const totalUsers = await prisma.user.count({
      where: {
        created_at: {
          gte: startDate
        }
      }
    });

    const usersWithReferralCount = await prisma.user.count({
      where: {
        ...whereClause,
        OR: [
          { referralSource: { not: null } },
          { referralCampaign: { not: null } }
        ]
      }
    });

    const premiumUsers = await prisma.user.count({
      where: {
        ...whereClause,
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

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          usersWithReferral: usersWithReferralCount,
          premiumUsers,
          totalPixPayments,
          totalRevenue: totalRevenue._sum.amount || 0,
          period: `${period} dias`
        },
        campaignStats,
        conversionStats,
        revenueByCampaign,
        topUrls,
        usersWithReferral,
        pixPaymentsWithMetadata,
        pixPaymentsByCampaign
      }
    });

  } catch (error) {
    console.error('Erro ao buscar dados de campanhas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
