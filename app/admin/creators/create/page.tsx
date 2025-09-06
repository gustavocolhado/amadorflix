'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaSave, FaUpload } from 'react-icons/fa';
import AdminLayout from '@/components/admin/AdminLayout';

export default function CreateCreatorPage() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/creators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/admin/creators');
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao criar creator');
      }
    } catch (error) {
      setError('Erro ao criar creator');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-white transition"
          >
            <FaArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Criar Novo Creator</h1>
            <p className="text-neutral-400">Adicione um novo creator à plataforma</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                Nome do Creator *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
                placeholder="Digite o nome do creator"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-white mb-2">
                Descrição
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
                placeholder="Digite uma descrição para o creator"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-white mb-2">
                URL da Imagem
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <FaUpload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              </div>
              <p className="text-neutral-400 text-sm mt-1">
                URL da imagem de perfil do creator
              </p>
            </div>

            {formData.image && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Preview da Imagem
                </label>
                <div className="w-32 h-32 bg-neutral-700 rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-neutral-600 text-white px-6 py-2 rounded-lg transition"
              >
                <FaSave />
                {loading ? 'Criando...' : 'Criar Creator'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
} 