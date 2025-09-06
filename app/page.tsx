'use client'

import Layout from '@/components/Layout'
import Header from '@/components/Header'
import Creators from '@/components/Creators'
import VideoSection from '@/components/VideoSection'
import LandingPage from '@/components/LandingPage'
import { useSession } from 'next-auth/react'
import { FaComments, FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'

export default function Home() {
  const { data: session } = useSession()
  const [isTelegramExpanded, setIsTelegramExpanded] = useState(false)
  const { theme } = useTheme()

  // Se o usuário não estiver logado, mostrar a landing page
  if (!session) {
    return <LandingPage />
  }

  return (
    <Layout>
      <Header />
      
      {/* Seção do Canal Telegram - Compacta */}
      <div className={`px-4 py-4 md:px-8 md:py-6 border-t border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-blue-500/30' 
          : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300/50'
      }`}>
        <div className="max-w-4xl mx-auto">
          {/* Versão Compacta */}
          <div className="flex items-center justify-between cursor-pointer hover:bg-theme-hover rounded-lg p-2 transition-colors duration-200" onClick={() => setIsTelegramExpanded(!isTelegramExpanded)}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <FaComments className="text-white text-lg md:text-xl" />
              </div>
              <div>
                <h3 className="text-theme-primary font-bold text-sm md:text-base">Acessar canal do Telegram</h3>
                <p className={`text-xs md:text-sm ${
                  theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                }`}>
                  <span className="text-yellow-500 font-bold">50.000 mídias</span> e <span className="text-yellow-500 font-bold">1000 criadores</span>
                </p>
              </div>
            </div>
            <div className={`transition-colors duration-200 ${
              theme === 'dark' ? 'text-blue-300' : 'text-blue-500'
            }`}>
              {isTelegramExpanded ? <FaChevronUp className="text-lg" /> : <FaChevronDown className="text-lg" />}
            </div>
          </div>

          {/* Conteúdo Expandido */}
          {isTelegramExpanded && (
            <div className={`mt-4 pt-4 border-t transition-colors duration-300 ${
              theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300/50'
            }`}>
              <div className={`border rounded-lg p-4 md:p-6 transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/30' 
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300/50'
              }`}>
                {/* Botão de Acesso */}
                <div className="text-center mb-4">
                  <a 
                    href="https://t.me/amadorflixbot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-bold transition-colors duration-300"
                  >
                    <FaComments className="text-sm" />
                    Acessar Canal
                  </a>
                </div>
                
                {/* Instruções */}
                <div className={`border rounded-lg p-3 md:p-4 transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-black/30 border-blue-500/30' 
                    : 'bg-white/50 border-blue-300/50'
                }`}>
                  <h4 className="text-theme-primary font-semibold mb-2 text-sm md:text-base">Como acessar:</h4>
                  <p className={`text-xs md:text-sm ${
                    theme === 'dark' ? 'text-blue-200' : 'text-blue-600'
                  }`}>
                    Basta enviar o seu <span className="text-yellow-500 font-bold">email de cadastro no site</span> para o bot para receber seu link de acesso
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <main className="min-h-screen bg-theme-primary">
        <Creators />
        <VideoSection />
      </main>
    </Layout>
  )
} 