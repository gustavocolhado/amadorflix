'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { QrCode, Copy, Check, Clock, AlertCircle, Loader2 } from 'lucide-react'

interface PixPaymentWithAutoCheckProps {
  pixData: {
    id: string
    qr_code: string
    value: number
    qr_code_base64: string
    userId?: string
  }
  userEmail: string
  onClose: () => void
}

export default function PixPaymentWithAutoCheck({ 
  pixData, 
  userEmail, 
  onClose 
}: PixPaymentWithAutoCheckProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const [isCheckingPayment, setIsCheckingPayment] = useState(false)
  const [checkCount, setCheckCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutos
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [finalizeError, setFinalizeError] = useState('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Debug: Log dos dados do PIX
  console.log('🔍 PixPaymentWithAutoCheck - pixData:', pixData)
  console.log('🔍 PixPaymentWithAutoCheck - qr_code_base64 length:', pixData?.qr_code_base64?.length)

  // Timer countdown
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Verificação automática de pagamento a cada 10 segundos
  useEffect(() => {
    if (paymentConfirmed) return

    checkIntervalRef.current = setInterval(async () => {
      await checkPaymentStatus()
    }, 10000) // 10 segundos

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
    }
  }, [paymentConfirmed])

  const checkPaymentStatus = async () => {
    if (isCheckingPayment || paymentConfirmed) return

    setIsCheckingPayment(true)
    setCheckCount(prev => prev + 1)

    try {
      const response = await fetch('/api/premium/check-payment-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pixId: pixData.id }),
      })

      const data = await response.json()

      if (data.paid) {
        setPaymentConfirmed(true)
        clearInterval(checkIntervalRef.current!)
        clearInterval(intervalRef.current!)
        
        // Mostrar formulário de senha após confirmação
        setShowPasswordForm(true)
      }
    } catch (error) {
      console.error('Erro ao verificar pagamento:', error)
    } finally {
      setIsCheckingPayment(false)
    }
  }

  const handleFinalizeAccount = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!pixData.userId) {
      setFinalizeError('ID do usuário não encontrado')
      return
    }

    if (password !== confirmPassword) {
      setFinalizeError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setFinalizeError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setIsFinalizing(true)
    setFinalizeError('')

    try {
      const response = await fetch('/api/premium/finalize-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: pixData.userId,
          password: password,
          confirmPassword: confirmPassword
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Login automático após finalização
        const result = await signIn('credentials', {
          email: userEmail,
          password: password,
          redirect: false,
        })

        if (result?.ok) {
          router.push('/')
        } else {
          // Se não conseguir fazer login, mostrar mensagem de sucesso
          alert('Conta finalizada com sucesso! Verifique seu email para as credenciais.')
          onClose()
        }
      } else {
        setFinalizeError(data.error || 'Erro ao finalizar conta')
      }
    } catch (error) {
      console.error('Erro ao finalizar conta:', error)
      setFinalizeError('Erro interno do servidor')
    } finally {
      setIsFinalizing(false)
    }
  }

  const copyPixCode = async () => {
    if (!pixData?.qr_code) return

    try {
      await navigator.clipboard.writeText(pixData.qr_code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (paymentConfirmed && showPasswordForm) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <h3 className="text-xl font-bold text-green-600 dark:text-green-400 mb-3">
            ✅ Pagamento Confirmado!
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Agora defina sua senha para finalizar a criação da conta
          </p>
        </div>

        <form onSubmit={handleFinalizeAccount} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="Digite sua senha"
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:border-red-500"
              placeholder="Confirme sua senha"
              required
              minLength={6}
            />
          </div>

          {finalizeError && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <p className="text-red-800 dark:text-red-200 text-sm">{finalizeError}</p>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-blue-800 dark:text-blue-200 text-xs">
              📧 Após finalizar, você receberá um email com suas credenciais e links do Telegram
            </p>
          </div>

          <button
            type="submit"
            disabled={isFinalizing}
            className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isFinalizing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Finalizando...
              </>
            ) : (
              'Finalizar Conta'
            )}
          </button>
        </form>
      </div>
    )
  }

  // Verificar se os dados do PIX estão disponíveis
  if (!pixData) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-yellow-600 dark:text-yellow-400 animate-spin" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Carregando PIX...
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Aguarde enquanto geramos seu QR Code
          </p>
        </div>
      </div>
    )
  }

  // Se não tem QR code base64, mostrar erro
  if (!pixData.qr_code_base64) {
    return (
      <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
            Erro no QR Code
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            Não foi possível gerar o QR Code. Tente novamente.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      {/* Header simples */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Pagamento PIX
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Escaneie o QR Code ou copie o código
        </p>
      </div>

      {/* QR Code centralizado */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          {pixData.qr_code_base64 ? (
            <img
              src={pixData.qr_code_base64}
              alt="QR Code PIX"
              className="w-48 h-48"
              onError={(e) => {
                console.error('❌ Erro ao carregar QR Code:', e)
                e.currentTarget.style.display = 'none'
              }}
              onLoad={() => {
                console.log('✅ QR Code carregado com sucesso')
              }}
            />
          ) : (
            <div className="w-48 h-48 bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500 text-sm">QR Code não disponível</p>
            </div>
          )}
        </div>
      </div>

      {/* Valor destacado */}
      <div className="text-center mb-6">
        <p className="text-3xl font-bold text-red-600 dark:text-red-400">
          R$ {(pixData.value / 100).toFixed(2).replace('.', ',')}
        </p>
      </div>

      {/* Status de verificação discreto */}
      <div className="text-center mb-6">
        {isCheckingPayment ? (
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Verificando pagamento...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
            <Check className="w-4 h-4" />
            <span className="text-sm">Verificação automática ativa</span>
          </div>
        )}
      </div>

      {/* Código PIX compacto */}
      <div className="mb-6">
        <div className="relative">
          <input
            value={pixData.qr_code}
            readOnly
            className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs font-mono"
          />
          <button
            onClick={copyPixCode}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
          Copie e cole no seu app de pagamento
        </p>
      </div>

      {/* Botões simplificados */}
      <div className="space-y-3">
        <button
          onClick={checkPaymentStatus}
          disabled={isCheckingPayment}
          className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isCheckingPayment ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Verificando...
            </>
          ) : (
            'Já fiz o pagamento'
          )}
        </button>
        
        <button
          onClick={onClose}
          className="w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Cancelar
        </button>
      </div>

      {/* Timer discreto */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tempo restante: {formatTime(timeLeft)}
        </p>
      </div>
    </div>
  )
}
