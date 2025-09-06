'use client'

import { useState } from 'react'
import { Info, Percent, DollarSign, Users } from 'lucide-react'

interface SplitInfoProps {
  totalValue: number
  splitPercentage?: number
  mainPercentage?: number
  showDetails?: boolean
}

export default function SplitInfo({ 
  totalValue, 
  splitPercentage = 30, 
  mainPercentage = 70,
  showDetails = false 
}: SplitInfoProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails)
  
  const splitValue = Math.round(totalValue * (splitPercentage / 100))
  const mainValue = totalValue - splitValue
  
  const formatValue = (value: number) => {
    return `R$ ${(value / 100).toFixed(2).replace('.', ',')}`
  }

  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-semibold text-sm">Divisão do Pagamento</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {/* Valor Total */}
        <div className="flex items-center justify-between">
          <span className="text-white text-sm">Valor Total:</span>
          <span className="text-white font-bold">{formatValue(totalValue)}</span>
        </div>

        {/* Barra de Progresso */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${mainPercentage}%` }}
          />
        </div>

        {/* Detalhes do Split */}
        {isExpanded && (
          <div className="space-y-2 mt-3 pt-3 border-t border-blue-500/30">
            {/* Conta Principal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-white text-sm">Conta Principal:</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{formatValue(mainValue)}</div>
                <div className="text-green-400 text-xs">{mainPercentage}%</div>
              </div>
            </div>

            {/* Conta de Split */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm">Conta de Split:</span>
              </div>
              <div className="text-right">
                <div className="text-white font-semibold text-sm">{formatValue(splitValue)}</div>
                <div className="text-blue-400 text-xs">{splitPercentage}%</div>
              </div>
            </div>
          </div>
        )}

        {/* Aviso sobre PushinPay */}
        <div className="mt-3 pt-3 border-t border-blue-500/30">
          <p className="text-blue-300 text-xs leading-relaxed">
            <strong>Aviso:</strong> A PUSHIN PAY atua exclusivamente como processadora de pagamentos 
            e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou 
            cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos.
          </p>
        </div>
      </div>
    </div>
  )
} 