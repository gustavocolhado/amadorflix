'use client';

import { useState } from 'react';

interface PaymentConfirmationButtonProps {
  pixId: string;
  onPaymentConfirmed?: () => void;
  className?: string;
}

export default function PaymentConfirmationButton({ 
  pixId, 
  onPaymentConfirmed,
  className = '' 
}: PaymentConfirmationButtonProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('');

  const checkPaymentStatus = async () => {
    if (!pixId) {
      setMessage('ID do PIX não encontrado');
      return;
    }

    setIsChecking(true);
    setMessage('Verificando pagamento...');

    try {
      const response = await fetch('/api/premium/check-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pixId }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.paid) {
          setMessage('✅ Pagamento confirmado! Acesso premium ativado.');
          onPaymentConfirmed?.();
        } else {
          setMessage('⏳ Pagamento ainda não foi confirmado. Aguarde alguns instantes e tente novamente.');
        }
      } else {
        if (response.status === 404) {
          setMessage('❌ PIX não encontrado. Verifique se o código está correto.');
        } else {
          setMessage(`❌ Erro ao verificar pagamento: ${data.error || 'Erro desconhecido'}`);
        }
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error);
      setMessage('❌ Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        onClick={checkPaymentStatus}
        disabled={isChecking}
        className={`
          w-full px-6 py-3 rounded-lg font-medium transition-all duration-200
          ${isChecking 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
          }
          text-white shadow-lg hover:shadow-xl transform hover:scale-105
        `}
      >
        {isChecking ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Verificando...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Já fiz o pagamento</span>
          </div>
        )}
      </button>

      {message && (
        <div className={`
          p-3 rounded-lg text-sm font-medium
          ${message.includes('✅') 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : message.includes('⏳') 
            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
            : 'bg-red-100 text-red-800 border border-red-200'
          }
        `}>
          {message}
        </div>
      )}

      <div className="text-xs text-gray-500 text-center">
        💡 Clique apenas se você já realizou o pagamento PIX
      </div>
    </div>
  );
} 