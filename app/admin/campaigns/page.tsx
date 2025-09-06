'use client';

import { useEffect, useState } from 'react';
import { FaChartLine, FaUsers, FaMoneyBillWave, FaPercent, FaFilter, FaDownload, FaEye, FaCalendarAlt, FaGlobe, FaTag } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';

interface CampaignData {
  summary: {
    totalUsers: number;
    usersWithReferral: number;
    premiumUsers: number;
    totalPixPayments: number;
    totalRevenue: number;
    period: string;
  };
  campaignStats: any[];
  conversionStats: any[];
  revenueByCampaign: any[];
  topUrls: any[];
  usersWithReferral: any[];
  pixPaymentsWithMetadata: any[];
  pixPaymentsByCampaign: any[];
}

export default function CampaignsPage() {
  const [data, setData] = useState<CampaignData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30');
  const [source, setSource] = useState('');
  const [campaign, setCampaign] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period,
        ...(source && { source }),
        ...(campaign && { campaign })
      });

      const response = await fetch(`/api/admin/campaigns?${params}`);
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        console.error('Erro ao buscar dados:', result.error);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [period, source, campaign]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const exportData = () => {
    if (!data) return;

    const csvContent = [
      ['Fonte', 'Campanha', 'Total Usuários', 'Usuários Premium', 'Taxa Conversão (%)', 'Receita Total'],
      ...data.conversionStats.map((stat: any) => [
        stat.referralSource || 'N/A',
        stat.referralCampaign || 'N/A',
        stat.total_users,
        stat.premium_users,
        stat.conversion_rate,
        formatCurrency(stat.total_revenue || 0)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campanhas-${period}dias.csv`;
    a.click();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!data) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <p className="text-red-500">Erro ao carregar dados das campanhas</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Campanhas e Rastreamento</h1>
            <p className="text-gray-400">Análise de fontes de tráfego e conversões</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            >
              <FaDownload />
              Exportar CSV
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-gray-400" />
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              >
                <option value="7">Últimos 7 dias</option>
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <FaGlobe className="text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por fonte..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaTag className="text-gray-400" />
              <input
                type="text"
                placeholder="Filtrar por campanha..."
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="bg-gray-700 text-white px-3 py-2 rounded border border-gray-600"
              />
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total de Usuários</p>
                <p className="text-2xl font-bold text-white">{data.summary.totalUsers}</p>
              </div>
              <FaUsers className="text-blue-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Com Referência</p>
                <p className="text-2xl font-bold text-white">{data.summary.usersWithReferral}</p>
                <p className="text-green-500 text-sm">
                  {((data.summary.usersWithReferral / data.summary.totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
              <FaChartLine className="text-green-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Usuários Premium</p>
                <p className="text-2xl font-bold text-white">{data.summary.premiumUsers}</p>
                <p className="text-green-500 text-sm">
                  {((data.summary.premiumUsers / data.summary.totalUsers) * 100).toFixed(1)}%
                </p>
              </div>
              <FaPercent className="text-yellow-500 text-2xl" />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Receita Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(data.summary.totalRevenue)}</p>
              </div>
              <FaMoneyBillWave className="text-green-500 text-2xl" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-800 rounded-lg mb-6">
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Visão Geral', icon: FaChartLine },
                { id: 'campaigns', label: 'Campanhas', icon: FaTag },
                { id: 'revenue', label: 'Receita', icon: FaMoneyBillWave },
                { id: 'urls', label: 'URLs Efetivas', icon: FaGlobe },
                { id: 'users', label: 'Usuários', icon: FaUsers }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-red-500 text-red-500'
                      : 'border-transparent text-gray-400 hover:text-gray-300'
                  }`}
                >
                  <tab.icon />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Visão Geral */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Top Campanhas por Conversão</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Fonte</th>
                          <th className="text-left py-2 text-gray-400">Campanha</th>
                          <th className="text-right py-2 text-gray-400">Usuários</th>
                          <th className="text-right py-2 text-gray-400">Premium</th>
                          <th className="text-right py-2 text-gray-400">Conversão</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.conversionStats.slice(0, 10).map((stat: any, index: number) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 text-white">{stat.referralSource || 'N/A'}</td>
                            <td className="py-2 text-gray-300">{stat.referralCampaign || 'N/A'}</td>
                            <td className="py-2 text-right text-white">{stat.total_users}</td>
                            <td className="py-2 text-right text-green-400">{stat.premium_users}</td>
                            <td className="py-2 text-right text-yellow-400">{stat.conversion_rate}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Campanhas */}
            {activeTab === 'campaigns' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Detalhes das Campanhas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Fonte</th>
                          <th className="text-left py-2 text-gray-400">Campanha</th>
                          <th className="text-right py-2 text-gray-400">Usuários</th>
                          <th className="text-right py-2 text-gray-400">Premium</th>
                          <th className="text-right py-2 text-gray-400">Conversão</th>
                          <th className="text-right py-2 text-gray-400">Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.conversionStats.map((stat: any, index: number) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 text-white">{stat.referralSource || 'N/A'}</td>
                            <td className="py-2 text-gray-300">{stat.referralCampaign || 'N/A'}</td>
                            <td className="py-2 text-right text-white">{stat.total_users}</td>
                            <td className="py-2 text-right text-green-400">{stat.premium_users}</td>
                            <td className="py-2 text-right text-yellow-400">{stat.conversion_rate}%</td>
                            <td className="py-2 text-right text-green-400">
                              {formatCurrency(stat.total_revenue || 0)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Receita */}
            {activeTab === 'revenue' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Receita por Campanha</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Fonte</th>
                          <th className="text-left py-2 text-gray-400">Campanha</th>
                          <th className="text-right py-2 text-gray-400">Pagamentos</th>
                          <th className="text-right py-2 text-gray-400">Pagados</th>
                          <th className="text-right py-2 text-gray-400">Receita Total</th>
                          <th className="text-right py-2 text-gray-400">Ticket Médio</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.revenueByCampaign.map((revenue: any, index: number) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 text-white">{revenue.source || 'N/A'}</td>
                            <td className="py-2 text-gray-300">{revenue.campaign || 'N/A'}</td>
                            <td className="py-2 text-right text-white">{revenue.total_payments}</td>
                            <td className="py-2 text-right text-green-400">{revenue.paid_payments}</td>
                            <td className="py-2 text-right text-green-400">{formatCurrency(revenue.total_revenue || 0)}</td>
                            <td className="py-2 text-right text-yellow-400">{formatCurrency(revenue.avg_payment || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* URLs Efetivas */}
            {activeTab === 'urls' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">URLs Mais Efetivas</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">URL</th>
                          <th className="text-left py-2 text-gray-400">Fonte</th>
                          <th className="text-left py-2 text-gray-400">Campanha</th>
                          <th className="text-right py-2 text-gray-400">Conversões</th>
                          <th className="text-right py-2 text-gray-400">Receita</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.topUrls.map((url: any, index: number) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 text-white max-w-xs truncate">{url.url || 'N/A'}</td>
                            <td className="py-2 text-gray-300">{url.source || 'N/A'}</td>
                            <td className="py-2 text-gray-300">{url.campaign || 'N/A'}</td>
                            <td className="py-2 text-right text-white">{url.conversions}</td>
                            <td className="py-2 text-right text-green-400">{formatCurrency(url.revenue || 0)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Usuários */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Usuários com Referência</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-2 text-gray-400">Email</th>
                          <th className="text-left py-2 text-gray-400">Fonte</th>
                          <th className="text-left py-2 text-gray-400">Campanha</th>
                          <th className="text-left py-2 text-gray-400">Premium</th>
                          <th className="text-left py-2 text-gray-400">Criado em</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.usersWithReferral.map((user: any, index: number) => (
                          <tr key={index} className="border-b border-gray-700">
                            <td className="py-2 text-white">{user.email}</td>
                            <td className="py-2 text-gray-300">{user.referralSource || 'N/A'}</td>
                            <td className="py-2 text-gray-300">{user.referralCampaign || 'N/A'}</td>
                            <td className="py-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.premium 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-red-900 text-red-300'
                              }`}>
                                {user.premium ? 'Sim' : 'Não'}
                              </span>
                            </td>
                            <td className="py-2 text-gray-300">{formatDate(user.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
