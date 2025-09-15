import Section from './Section'
import { Eye } from 'lucide-react'
import { useCreators } from '@/hooks/useCreators'
import CreatorAvatar from './CreatorAvatar'

export default function Creators() {
  const { creators, loading, error } = useCreators()

  const handleCreatorClick = (creator: any) => {
    console.log('Creator clicked:', creator)
    // Aqui você pode implementar a navegação para a página do creator
    // router.push(`/creator/${creator.id}`)
  }

  const handleVerTodos = () => {
    // Navegação para a página de todos os criadores
    window.location.href = '/creators'
  }

  // Se estiver carregando, mostra um skeleton
  if (loading) {
    return (
      <Section background="white" padding="md">
        <h2 className="text-xl md:text-2xl font-bold text-theme-primary mb-4">
          CRIADORES EM DESTAQUE
        </h2>
                 <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
           {[...Array(8)].map((_, index) => (
             <div
               key={index}
               className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium bg-gray-200 animate-pulse"
             >
               <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-gray-300 flex-shrink-0"></div>
               <div className="w-16 md:w-20 h-3 bg-gray-300 rounded"></div>
               <div className="w-6 h-3 bg-gray-300 rounded-full flex-shrink-0"></div>
             </div>
           ))}
         </div>
      </Section>
    )
  }

  // Se houver erro, mostra uma mensagem
  if (error) {
    return (
      <Section background="white" padding="md">
        <h2 className="text-xl md:text-2xl font-bold text-theme-primary mb-4">
          CRIADORES EM DESTAQUE
        </h2>
        <div className="text-red-500 text-sm">
          Erro ao carregar criadores. Tente novamente mais tarde.
        </div>
      </Section>
    )
  }

  // Se não houver criadores, mostra uma mensagem
  if (creators.length === 0) {
    return (
      <Section background="white" padding="md">
        <h2 className="text-xl md:text-2xl font-bold text-theme-primary mb-4">
          CRIADORES EM DESTAQUE
        </h2>
        <div className="text-gray-500 text-sm">
          Nenhum criador encontrado.
        </div>
      </Section>
    )
  }

  return (
    <Section background="white" padding="md">
      <h2 className="text-xl md:text-2xl font-bold text-theme-primary mb-4">
        CRIADORES EM DESTAQUE
      </h2>
      <div className="md:hidden text-xs text-theme-secondary mb-2">
        ← Deslize para ver mais →
      </div>
      <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
        {creators.map((creator) => (
          <button
            key={creator.id}
            onClick={() => handleCreatorClick(creator)}
            className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors theme-tag-secondary hover:theme-tag-primary"
          >
            <CreatorAvatar 
              creator={creator} 
              size="sm" 
              className="w-4 h-4 md:w-5 md:h-5"
            />
            <span className="truncate max-w-20 md:max-w-none">{creator.name}</span>
            <span className="bg-accent-red text-white text-xs rounded-full px-1 md:px-1.5 py-0.5 flex-shrink-0">
              {creator.qtd || 0}
            </span>
          </button>
        ))}
        
        {/* Botão "Ver todos" */}
        <button
          onClick={handleVerTodos}
          className="flex items-center space-x-1 md:space-x-2 px-2 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors theme-tag-primary"
        >
          <Eye className="w-3 h-3 md:w-4 md:h-4" />
          <span className="truncate">VER TODOS</span>
        </button>
      </div>
    </Section>
  )
} 