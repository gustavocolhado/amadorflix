'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CampanhaPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para a página de campanhas do Facebook do vazadex.com
    // Você pode ajustar esta URL conforme necessário
    const facebookCampaignUrl = 'https://www.facebook.com/vazadex.com/campaigns';
    
    // Redirecionamento externo
    window.location.href = facebookCampaignUrl;
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center text-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold mb-2">Redirecionando...</h1>
        <p className="text-lg opacity-80">Para campanhas do Facebook do Vazadex</p>
        <p className="text-sm opacity-60 mt-2">
          Se não for redirecionado automaticamente,{' '}
          <a 
            href="https://www.facebook.com/vazadex.com/campaigns" 
            className="text-blue-300 hover:text-blue-200 underline"
          >
            clique aqui
          </a>
        </p>
      </div>
    </div>
  );
}

