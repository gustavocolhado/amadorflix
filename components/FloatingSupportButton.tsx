'use client'

import { useState } from 'react'
import { FaTelegram, FaTimes, FaWhatsapp, FaQuestionCircle } from 'react-icons/fa'

export default function FloatingSupportButton() {
  const [isExpanded, setIsExpanded] = useState(false)

  const supportOptions = [
    {
      name: 'Telegram',
      icon: FaTelegram,
      url: process.env.NEXT_PUBLIC_TELEGRAM_SUPPORT || 'https://t.me/amadorflixsuporte',
      color: 'bg-blue-500 hover:bg-blue-600',
      description: 'Suporte via Telegram'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      url: process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || 'https://wa.me/5511999999999',
      color: 'bg-green-500 hover:bg-green-600',
      description: 'Suporte via WhatsApp'
    }
  ]

  const handleSupportClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    setIsExpanded(false)
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botões de suporte expandidos */}
      {isExpanded && (
        <div className="mb-4 space-y-3">
          {supportOptions.map((option, index) => {
            const Icon = option.icon
            return (
              <div
                key={option.name}
                className="flex items-center space-x-3 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  {option.description}
                </div>
                <button
                  onClick={() => handleSupportClick(option.url)}
                  className={`${option.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110`}
                  title={option.description}
                >
                  <Icon className="w-6 h-6" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Botão principal */}
      <div className="relative">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
          title="Precisa de ajuda? Fale conosco!"
        >
          {isExpanded ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaQuestionCircle className="w-6 h-6" />
          )}
        </button>

        {/* Indicador de notificação */}
        {!isExpanded && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* Tooltip */}
      {!isExpanded && (
        <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Precisa de ajuda? Fale conosco!
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
        </div>
      )}
    </div>
  )
}
