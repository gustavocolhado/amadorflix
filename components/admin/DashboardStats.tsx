'use client';

import { 
  FaUsers, 
  FaVideo, 
  FaUserPlus, 
  FaTags, 
  FaCrown, 
  FaEye, 
  FaArrowUp 
} from 'react-icons/fa';

interface StatsProps {
  stats: {
    totalUsers: number;
    totalVideos: number;
    totalCreators: number;
    totalCategories: number;
    premiumUsers: number;
    totalViews: number;
  };
}

export default function DashboardStats({ stats }: StatsProps) {
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
      icon: FaCrown,
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
      icon: FaEye,
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-500/10 to-red-600/10',
      borderColor: 'border-red-500/20',
      change: '+22%',
      changeType: 'positive' as const,
      description: 'Visualizações totais'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        
        return (
          <div 
            key={index} 
            className={`relative group bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm rounded-xl p-6 border ${stat.borderColor} hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-black/20`}
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl"></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex-1">
                  <p className="text-neutral-300 text-sm font-medium mb-1">{stat.title}</p>
                  <p className="text-white text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-neutral-400 text-xs">{stat.description}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.gradient} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {IconComponent && <IconComponent size={24} className="text-white" />}
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

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
          </div>
        );
      })}
    </div>
  );
} 