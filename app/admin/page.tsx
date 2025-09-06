'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaUsers, FaVideo, FaTags, FaUserPlus, FaChartBar, FaCog, FaStar, FaShieldAlt, FaBell, FaArrowUp } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';
// import DashboardStats from '@/components/admin/DashboardStats';
import RecentUsers from '@/components/admin/RecentUsers';
import RecentVideos from '@/components/admin/RecentVideos';

// Componente temporário para testar
function TempDashboardStats({ stats }: any) {
  const statCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers.toLocaleString('pt-BR'),
      icon: FaUsers,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-500/10 to-blue-600/10',
      borderColor: 'border-blue-500/20',
      change: '+12%',
      changeType: 'positive' as const,
      description: 'Usuários registrados'
    },
    {
      title: 'Vídeos Cadastrados',
      value: stats.totalVideos.toLocaleString('pt-BR'),
      icon: FaVideo,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-500/10 to-green-600/10',
      borderColor: 'border-green-500/20',
      change: '+8%',
      changeType: 'positive' as const,
      description: 'Vídeos na plataforma'
    },
    {
      title: 'Creators',
      value: stats.totalCreators.toLocaleString('pt-BR'),
      icon: FaUserPlus,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-500/10 to-purple-600/10',
      borderColor: 'border-purple-500/20',
      change: '+5%',
      changeType: 'positive' as const,
      description: 'Creators ativos'
    },
    {
      title: 'Categorias',
      value: stats.totalCategories.toLocaleString('pt-BR'),
      icon: FaTags,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-500/10 to-orange-600/10',
      borderColor: 'border-orange-500/20',
      change: '+3%',
      changeType: 'positive' as const,
      description: 'Categorias disponíveis'
    },
    {
      title: 'Usuários Premium',
      value: stats.premiumUsers.toLocaleString('pt-BR'),
      icon: FaUsers,
      gradient: 'from-yellow-500 to-yellow-600',
      bgGradient: 'from-yellow-500/10 to-yellow-600/10',
      borderColor: 'border-yellow-500/20',
      change: '+15%',
      changeType: 'positive' as const,
      description: 'Assinantes premium'
    },
    {
      title: 'Total de Visualizações',
      value: stats.totalViews.toLocaleString('pt-BR'),
      icon: FaVideo,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20',
      change: '+22%',
      changeType: 'positive' as const,
      description: 'Visualizações totais'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div 
            key={index} 
            className={`relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-xl p-4 border ${stat.borderColor} hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-black/20`}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex-1">
                  <p className="text-neutral-300 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-white text-2xl font-bold mb-1">{stat.value}</p>
                  <p className="text-neutral-400 text-xs">{stat.description}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {IconComponent && <IconComponent size={20} className="text-white" />}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaArrowUp className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`} />
                  <span className={`text-sm font-semibold ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <span className="text-neutral-400 text-xs">vs mês anterior</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalCreators: 0,
    totalCategories: 0,
    premiumUsers: 0,
    totalViews: 0
  });

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    // Verificar se é admin
    checkAdminStatus();
    fetchDashboardStats();
  }, [session, status, router]);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/check-status');
      if (!response.ok) {
        router.push('/');
        return;
      }
    } catch (error) {
      console.error('Erro ao verificar status admin:', error);
      router.push('/');
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <div className="text-white text-xl">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header Section */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-red-600/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Dashboard Admin
                </h1>
                <p className="text-neutral-300 mb-3">
                  Bem-vindo ao painel de administração da plataforma
                </p>
                <div className="flex items-center gap-4 text-sm text-neutral-400">
                  <div className="flex items-center gap-2">
                    <FaShieldAlt className="text-red-400" />
                    <span>Acesso Administrativo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaBell className="text-yellow-400" />
                    <span>Sistema Ativo</span>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-4 rounded-xl border border-red-500/30">
                  <FaStar className="text-red-400 text-3xl" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Estatísticas Gerais</h2>
            <p className="text-neutral-400 text-sm">Visão geral dos dados da plataforma</p>
          </div>
          <TempDashboardStats stats={stats} />
        </div>

        {/* Recent Activity Section */}
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Atividade Recente</h2>
            <p className="text-neutral-400 text-sm">Últimas atividades da plataforma</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentUsers />
            <RecentVideos />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-1">Ações Rápidas</h2>
            <p className="text-neutral-400 text-sm">Ferramentas de administração</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Management Actions */}
            <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-2 rounded-lg">
                  <FaCog className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Gerenciamento</h3>
                  <p className="text-neutral-400 text-xs">Criar e editar</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin/creators/create')}
                  className="w-full bg-gradient-to-r from-red-600/20 to-red-500/20 hover:from-red-600/30 hover:to-red-500/30 text-red-400 py-2 px-3 rounded-lg transition-all duration-300 border border-red-500/30 hover:border-red-500/50 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaUserPlus size={14} />
                  Criar Creator
                </button>
                <button
                  onClick={() => router.push('/admin/categories/create')}
                  className="w-full bg-gradient-to-r from-blue-600/20 to-blue-500/20 hover:from-blue-600/30 hover:to-blue-500/30 text-blue-400 py-2 px-3 rounded-lg transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaTags size={14} />
                  Criar Categoria
                </button>
                <button
                  onClick={() => router.push('/admin/videos/create')}
                  className="w-full bg-gradient-to-r from-green-600/20 to-green-500/20 hover:from-green-600/30 hover:to-green-500/30 text-green-400 py-2 px-3 rounded-lg transition-all duration-300 border border-green-500/30 hover:border-green-500/50 flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <FaVideo size={14} />
                  Adicionar Vídeo
                </button>
              </div>
            </div>

            {/* Reports */}
            <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                  <FaChartBar className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Relatórios</h3>
                  <p className="text-neutral-400 text-xs">Análises e dados</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin/reports/users')}
                  className="w-full bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white py-2 px-3 rounded-lg transition-all duration-300 border border-neutral-600/50 hover:border-neutral-500/50 text-sm font-medium"
                >
                  Relatório de Usuários
                </button>
                <button
                  onClick={() => router.push('/admin/reports/videos')}
                  className="w-full bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white py-2 px-3 rounded-lg transition-all duration-300 border border-neutral-600/50 hover:border-neutral-500/50 text-sm font-medium"
                >
                  Relatório de Vídeos
                </button>
                <button
                  onClick={() => router.push('/admin/reports/payments')}
                  className="w-full bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white py-2 px-3 rounded-lg transition-all duration-300 border border-neutral-600/50 hover:border-neutral-500/50 text-sm font-medium"
                >
                  Relatório de Pagamentos
                </button>
              </div>
            </div>

            {/* Settings */}
            <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-4 border border-neutral-700/50 hover:border-neutral-600/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                  <FaCog className="text-white" size={16} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Configurações</h3>
                  <p className="text-neutral-400 text-xs">Sistema e segurança</p>
                </div>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/admin/settings/general')}
                  className="w-full bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white py-2 px-3 rounded-lg transition-all duration-300 border border-neutral-600/50 hover:border-neutral-500/50 text-sm font-medium"
                >
                  Configurações Gerais
                </button>
                <button
                  onClick={() => router.push('/admin/settings/payments')}
                  className="w-full bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white py-2 px-3 rounded-lg transition-all duration-300 border border-neutral-600/50 hover:border-neutral-500/50 text-sm font-medium"
                >
                  Configurações de Pagamento
                </button>
                <button
                  onClick={() => router.push('/admin/settings/security')}
                  className="w-full bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white py-2 px-3 rounded-lg transition-all duration-300 border border-neutral-600/50 hover:border-neutral-500/50 text-sm font-medium"
                >
                  Configurações de Segurança
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 