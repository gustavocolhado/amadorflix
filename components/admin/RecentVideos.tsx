'use client';

import { useState, useEffect } from 'react';
import { FaVideo, FaEye, FaHeart, FaEdit, FaTrash, FaClock, FaPlay } from 'react-icons/fa';
import { Video } from '@/types';

export default function RecentVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentVideos();
  }, []);

  const fetchRecentVideos = async () => {
    try {
      const response = await fetch('/api/admin/videos/recent');
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Erro ao buscar vídeos recentes:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return formatDate(dateString);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
              <FaVideo className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Vídeos Recentes</h3>
              <p className="text-neutral-400 text-sm">Últimos uploads</p>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center gap-4 p-4 bg-neutral-700/30 rounded-lg">
                <div className="w-16 h-12 bg-neutral-600 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-600 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-600 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl shadow-lg">
            <FaVideo className="text-white" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Vídeos Recentes</h3>
            <p className="text-neutral-400 text-sm">Últimos uploads</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{videos.length}</div>
          <div className="text-neutral-400 text-xs">Total</div>
        </div>
      </div>
      
      <div className="space-y-3">
        {videos.map((video) => (
          <div key={video.id} className="group relative bg-gradient-to-r from-neutral-700/30 to-neutral-600/30 backdrop-blur-sm rounded-lg p-4 border border-neutral-600/30 hover:border-neutral-500/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-12 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-lg overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FaVideo className="text-neutral-400" size={20} />
                    </div>
                  )}
                </div>
                {video.premium && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center border-2 border-neutral-800">
                    <FaPlay size={6} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate group-hover:text-green-300 transition-colors">
                  {video.title}
                </p>
                <div className="flex items-center gap-4 text-neutral-400 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <FaEye size={12} />
                    {formatNumber(video.viewCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaHeart size={12} />
                    {formatNumber(video.likesCount)}
                  </span>
                  {video.creator && (
                    <span className="truncate text-blue-400">por {video.creator}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {video.premium && (
                  <span className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-500/30">
                    Premium
                  </span>
                )}
                <div className="flex items-center gap-1 text-neutral-400 text-xs">
                  <FaClock size={10} />
                  <span>{getTimeAgo(video.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200">
                    <FaEye size={14} />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200">
                    <FaEdit size={14} />
                  </button>
                  <button className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-neutral-700/50">
        <button className="w-full bg-gradient-to-r from-green-600/20 to-green-500/20 hover:from-green-600/30 hover:to-green-500/30 text-green-400 py-3 px-4 rounded-lg transition-all duration-300 border border-green-500/30 hover:border-green-500/50 font-medium">
          Ver Todos os Vídeos
        </button>
      </div>
    </div>
  );
} 