'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaEye, FaSearch, FaUserPlus, FaFilter, FaSort } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';
import { Creator } from '@/types';

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    try {
      const response = await fetch('/api/admin/creators');
      if (response.ok) {
        const data = await response.json();
        setCreators(data);
      }
    } catch (error) {
      console.error('Erro ao buscar creators:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este creator?')) return;

    try {
      const response = await fetch(`/api/admin/creators/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCreators(creators.filter(creator => creator.id !== id));
      }
    } catch (error) {
      console.error('Erro ao excluir creator:', error);
    }
  };

  const filteredCreators = creators.filter(creator =>
    creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Data não disponível';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <div className="text-white text-xl">Carregando...</div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-red-600/10 to-red-500/10 backdrop-blur-sm rounded-2xl p-6 border border-red-500/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Creators</h1>
              <p className="text-neutral-300">Gerencie todos os creators da plataforma</p>
            </div>
            <button
              onClick={() => router.push('/admin/creators/create')}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              <FaPlus />
              Novo Creator
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-6 border border-neutral-700/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
              <input
                type="text"
                placeholder="Buscar creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-neutral-700/50 border border-neutral-600/50 rounded-xl text-white placeholder-neutral-400 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all duration-300"
              />
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-3 bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white rounded-xl border border-neutral-600/50 hover:border-neutral-500/50 transition-all duration-300 flex items-center gap-2">
                <FaFilter size={14} />
                Filtros
              </button>
              <button className="px-4 py-3 bg-gradient-to-r from-neutral-700/50 to-neutral-600/50 hover:from-neutral-600/50 hover:to-neutral-500/50 text-white rounded-xl border border-neutral-600/50 hover:border-neutral-500/50 transition-all duration-300 flex items-center gap-2">
                <FaSort size={14} />
                Ordenar
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total de Creators</p>
                <p className="text-white text-2xl font-bold">{creators.length}</p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl">
                <FaUserPlus className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 text-sm font-medium">Vídeos Totais</p>
                <p className="text-white text-2xl font-bold">
                  {creators.reduce((acc, creator) => acc + (creator.qtd || 0), 0)}
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-xl">
                <FaUserPlus className="text-white" size={20} />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Ativos Hoje</p>
                <p className="text-white text-2xl font-bold">
                  {creators.filter(c => {
                    if (!c.created_at) return false;
                    const today = new Date();
                    const created = new Date(c.created_at);
                    return today.toDateString() === created.toDateString();
                  }).length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl">
                <FaUserPlus className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Creators List */}
        <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl border border-neutral-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-neutral-700/50 to-neutral-600/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Creator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Vídeos
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Criado em
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-700/50">
                {filteredCreators.map((creator) => (
                  <tr key={creator.id} className="hover:bg-neutral-700/30 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-br from-neutral-600 to-neutral-700 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                          {creator.image ? (
                            <img src={creator.image} alt={creator.name} className="w-12 h-12 rounded-full object-cover" />
                          ) : (
                            <span className="text-white font-semibold text-lg">
                              {creator.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-white font-medium text-lg">{creator.name}</div>
                          <div className="text-neutral-400 text-sm">ID: {creator.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-neutral-300 text-sm max-w-xs truncate">
                        {creator.description || 'Sem descrição'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/30">
                        {creator.qtd || 0} vídeos
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-neutral-300 text-sm">
                        {formatDate(creator.created_at)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/admin/creators/${creator.id}`)}
                          className="p-2 text-neutral-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                          title="Visualizar"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/creators/${creator.id}/edit`)}
                          className="p-2 text-neutral-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200"
                          title="Editar"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(creator.id)}
                          className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                          title="Excluir"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 backdrop-blur-sm rounded-xl p-8 border border-neutral-700/50">
              <FaUserPlus className="text-neutral-400 text-4xl mx-auto mb-4" />
              <p className="text-neutral-400 text-lg mb-2">Nenhum creator encontrado</p>
              <p className="text-neutral-500 text-sm">Tente ajustar os filtros de busca</p>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
} 