'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertTriangle, ArrowLeft, LogIn } from 'lucide-react'
import Logo from '@/components/Logo'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case 'CredentialsSignin':
        return 'Email ou senha incorretos. Verifique suas credenciais e tente novamente.'
      case 'OAuthSignin':
        return 'Erro ao iniciar o processo de login com o provedor externo.'
      case 'OAuthCallback':
        return 'Erro ao processar o retorno do provedor de autenticação.'
      case 'OAuthCreateAccount':
        return 'Erro ao criar conta com o provedor externo.'
      case 'EmailCreateAccount':
        return 'Erro ao criar conta com email.'
      case 'Callback':
        return 'Erro no processo de callback de autenticação.'
      case 'OAuthAccountNotLinked':
        return 'Esta conta já está associada a outro método de login.'
      case 'EmailSignin':
        return 'Erro ao enviar email de verificação.'
      case 'CredentialsSignup':
        return 'Erro ao criar conta com credenciais.'
      case 'SessionRequired':
        return 'Sessão expirada. Faça login novamente.'
      case 'Default':
      default:
        return 'Ocorreu um erro durante o processo de autenticação. Tente novamente.'
    }
  }

  return (
    <div className="min-h-screen bg-theme-background">
      {/* Header */}
      <header className="bg-theme-card border-b border-theme-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft size={20} className="text-theme-primary" />
              <Logo />
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-theme-card rounded-lg shadow-2xl p-8 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
              <AlertTriangle size={40} className="text-red-500" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-theme-primary mb-4">
            Erro de Autenticação
          </h1>

          {/* Error Message */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-500 text-sm">
              {getErrorMessage(error)}
            </p>
          </div>

          {/* Error Code (for debugging) */}
          {error && (
            <div className="bg-theme-input rounded-lg p-3 mb-6">
              <p className="text-theme-secondary text-xs font-mono">
                Código do erro: {error}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              href="/login"
              className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn size={20} />
              <span>Tentar Novamente</span>
            </Link>

            <Link
              href="/"
              className="w-full border border-theme-input text-theme-primary hover:bg-theme-hover font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Voltar ao Início
            </Link>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-theme-border">
            <p className="text-theme-secondary text-sm">
              Se o problema persistir, entre em contato com nosso suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 