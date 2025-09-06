'use client'

import { useState } from 'react'
import { Eye, EyeOff, Star, Play, RefreshCw, Ban, ArrowLeft, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function RegisterPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: false,
    name: false,
    password: false
  })
  const [agreements, setAgreements] = useState({
    newsletter: false,
    terms: false
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: false }))
    }
    if (authError) {
      setAuthError('')
    }
  }

  const handleAgreementChange = (field: string, checked: boolean) => {
    setAgreements(prev => ({ ...prev, [field]: checked }))
  }



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoading(true)
    
    const newErrors = {
      email: !formData.email,
      name: !formData.name,
      password: !formData.password
    }
    setErrors(newErrors)
    
    if (!Object.values(newErrors).some(Boolean) && agreements.terms) {
      try {
        // Cadastro de usuário
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            name: formData.name,
            source: 'website'
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setAuthError(data.error || 'Erro ao criar conta')
        } else {
          // Fazer login automaticamente após o cadastro
          const loginResult = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            source: 'website'
          })
          
          if (loginResult?.error) {
            setAuthError('Conta criada, mas erro ao fazer login automático')
          } else {
            router.push('/')
          }
        }
      } catch (error) {
        setAuthError('Erro ao criar conta. Tente novamente.')
      }
    } else if (!agreements.terms) {
      setAuthError('Você deve aceitar os termos de serviço')
    }
    
    setIsLoading(false)
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-theme-card rounded-lg shadow-2xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Register Form */}
            <div className="flex-1 p-8 lg:p-12">
              <div className="max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-theme-primary mb-2">
                  Criar conta
                </h1>
                <p className="text-theme-secondary mb-8">
                  Junte-se a milhares de usuários
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div>
                    <label className="block text-theme-primary text-sm font-medium mb-2">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-4 py-3 theme-input rounded-lg transition-colors ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'focus:border-accent-red'
                      }`}
                      placeholder="Digite seu nome completo"
                    />
                    {errors.name && (
                      <p className="mt-1 text-red-500 text-sm">
                        Por favor, digite seu nome
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-theme-primary text-sm font-medium mb-2">
                      E-mail
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className={`w-full px-4 py-3 theme-input rounded-lg transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-accent-red'
                      }`}
                      placeholder="Digite seu e-mail"
                    />
                    {errors.email && (
                      <p className="mt-1 text-red-500 text-sm">
                        Por favor, digite um e-mail válido
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-theme-primary text-sm font-medium mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`w-full px-4 py-3 theme-input rounded-lg pr-12 transition-colors ${
                          errors.password ? 'border-red-500 focus:border-red-500' : 'focus:border-accent-red'
                        }`}
                        placeholder="Crie uma senha forte"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-secondary hover:text-theme-primary transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-red-500 text-sm">
                        Por favor, crie uma senha
                      </p>
                    )}
                  </div>

                  {/* Agreements */}
                  <div className="space-y-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agreements.newsletter}
                        onChange={(e) => handleAgreementChange('newsletter', e.target.checked)}
                        className="w-4 h-4 text-accent-red bg-theme-input border-theme-border rounded focus:ring-accent-red focus:ring-2 mt-0.5"
                      />
                      <span className="text-theme-secondary text-sm">
                        Receber novidades, atualizações e ofertas especiais
                      </span>
                    </label>
                    
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={agreements.terms}
                        onChange={(e) => handleAgreementChange('terms', e.target.checked)}
                        className="w-4 h-4 text-accent-red bg-theme-input border-theme-border rounded focus:ring-accent-red focus:ring-2 mt-0.5"
                      />
                      <span className="text-theme-secondary text-sm">
                        Concordo com os{' '}
                        <Link href="#" className="text-accent-red hover:underline">
                          Termos de Serviço
                        </Link>
                        {' '}e{' '}
                        <Link href="#" className="text-accent-red hover:underline">
                          Política de Privacidade
                        </Link>
                      </span>
                    </label>
                  </div>

                  {/* Auth Error */}
                  {authError && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-500 text-sm">{authError}</p>
                    </div>
                  )}

                  {/* Register Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-accent-red hover:bg-accent-red-hover disabled:bg-accent-red/50 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Criando conta...</span>
                      </>
                    ) : (
                      <span>Criar conta</span>
                    )}
                  </button>

                  

                  {/* Login Link */}
                  <div className="text-center pt-4">
                    <p className="text-theme-secondary text-sm">
                      Já tem uma conta?{' '}
                      <Link 
                        href="/login" 
                        className="text-accent-red hover:underline font-medium transition-colors"
                      >
                        Fazer login
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Section - Benefits */}
            <div className="flex-1 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 p-8 lg:p-12 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>

              <div className="relative z-10 h-full flex flex-col justify-center">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Por que se registrar?
                  </h2>
                  <p className="text-white/80 text-lg mb-8">
                    Descubra todos os benefícios de ter uma conta
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Acesso gratuito</h3>
                      <p className="text-white/70 text-sm">Milhares de vídeos gratuitos</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Favoritos</h3>
                      <p className="text-white/70 text-sm">Salve seus vídeos favoritos</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Histórico</h3>
                      <p className="text-white/70 text-sm">Acompanhe o que você assistiu</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Check size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">Recomendações</h3>
                      <p className="text-white/70 text-sm">Conteúdo personalizado para você</p>
                    </div>
                  </div>
                </div>

                {/* Premium CTA */}
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center">
                  <h3 className="text-white font-bold text-lg mb-2">
                    Quer mais?
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    Faça upgrade para Premium e remova anúncios
                  </p>
                  <button className="w-full bg-white hover:bg-gray-100 text-blue-800 font-bold py-3 px-6 rounded-lg transition-colors">
                    Conhecer Premium
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 