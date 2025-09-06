'use client'

import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Star, Play, RefreshCw, Ban } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

type AuthMode = 'login' | 'signup'

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    profileName: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: false,
    profileName: false,
    password: false
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



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setIsLoading(true)
    
    const newErrors = {
      email: !formData.email,
      profileName: mode === 'signup' ? !formData.profileName : false,
      password: !formData.password
    }
    setErrors(newErrors)
    
    if (!Object.values(newErrors).some(Boolean)) {
      try {
        if (mode === 'login') {
          const result = await signIn('credentials', {
            email: formData.email,
            password: formData.password,
            source: 'website'
          })
          
          if (result?.error) {
            setAuthError('Email ou senha incorretos')
          } else {
            onClose()
          }
        } else {
          // Cadastro de usuário
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: formData.email,
              password: formData.password,
              name: formData.profileName,
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
              onClose()
            }
          }
        }
      } catch (error) {
        setAuthError('Erro ao fazer login. Tente novamente.')
      }
    }
    
    setIsLoading(false)
  }

  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-theme-card rounded-lg shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-theme-primary hover:text-accent-red transition-colors z-10"
          >
            <X size={24} />
          </button>

          <div className="flex flex-col lg:flex-row">
            {/* Left Section - Auth Forms */}
            <div className="flex-1 p-8">
              {/* Tabs */}
              <div className="flex space-x-8 mb-6">
                <button
                  onClick={() => setMode('login')}
                  className={`text-lg font-bold transition-colors ${
                    mode === 'login' 
                      ? 'text-theme-primary border-b-2 border-accent-red pb-2' 
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Conta gratuita
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`text-lg font-bold transition-colors ${
                    mode === 'signup' 
                      ? 'text-theme-primary border-b-2 border-accent-red pb-2' 
                      : 'text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  Cadastro
                </button>
              </div>

              {mode === 'login' ? (
                /* Login Form */
                <div>
                  <h2 className="text-3xl font-bold text-theme-primary mb-2">
                    Conta gratuita
                  </h2>
                  <p className="text-theme-secondary mb-6">
                    Login da conta:
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-theme-primary text-sm font-medium mb-2">
                        Seu login (e-mail):
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full px-4 py-3 theme-input rounded-lg ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                        placeholder="Digite seu e-mail"
                      />
                    </div>

                                         {/* Password Field */}
                     <div>
                       <label className="block text-theme-primary text-sm font-medium mb-2">
                         Palavra-passe:
                       </label>
                       <div className="relative">
                         <input
                           type={showPassword ? 'text' : 'password'}
                           value={formData.password}
                           onChange={(e) => handleInputChange('password', e.target.value)}
                           className={`w-full px-4 py-3 theme-input rounded-lg pr-12 ${
                             errors.password ? 'border-red-500' : ''
                           }`}
                           placeholder="Digite sua senha"
                         />
                         <button
                           type="button"
                           onClick={() => setShowPassword(!showPassword)}
                           className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-secondary hover:text-theme-primary"
                         >
                           {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                         </button>
                         {errors.password && (
                           <div className="flex items-center mt-1 text-red-500 text-sm">
                             <X size={16} className="mr-1" />
                             Por favor, preencha este campo.
                           </div>
                         )}
                       </div>
                     </div>

                     {/* Auth Error */}
                     {authError && (
                       <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                         <p className="text-red-500 text-sm">{authError}</p>
                       </div>
                     )}

                    {/* Remember Me Checkbox */}
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input type="checkbox" className="mt-1" />
                      <span className="text-theme-secondary text-sm">
                        Lembrar-me neste dispositivo
                      </span>
                    </label>

                                         {/* Login Button */}
                     <button
                       type="submit"
                       disabled={isLoading}
                       className="w-full bg-accent-red hover:bg-accent-red-hover disabled:bg-accent-red/50 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
                     >
                       {isLoading ? (
                         <div className="flex items-center space-x-2">
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                           <span>Entrando...</span>
                         </div>
                       ) : (
                         'Iniciar sessão'
                       )}
                     </button>

                    {/* Forgot Password */}
                    <div className="text-center">
                      <a href="#" className="text-accent-red hover:underline text-sm">
                        Esqueceu sua senha?
                      </a>
                    </div>

                    {/* Separator */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-theme-input"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-theme-card text-theme-secondary">OU</span>
                      </div>
                    </div>

                    {/* Create Account Button */}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="w-full border border-accent-red text-accent-red hover:bg-accent-red hover:text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      Criar uma conta gratuita
                    </button>

                    
                  </form>
                </div>
              ) : (
                /* Signup Form */
                <div>
                  <h2 className="text-3xl font-bold text-theme-primary mb-2">
                    Inscreva-se gratuitamente
                  </h2>
                  <p className="text-theme-secondary mb-6">
                    Criar uma nova conta:
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                      <label className="block text-theme-primary text-sm font-medium mb-2">
                        O seu e-mail (login):
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full px-4 py-3 theme-input rounded-lg ${
                            errors.email ? 'border-red-500' : ''
                          }`}
                          placeholder="Digite seu e-mail"
                        />
                        {errors.email && (
                          <div className="flex items-center mt-1 text-red-500 text-sm">
                            <X size={16} className="mr-1" />
                            Por favor, preencha este campo.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Profile Name Field */}
                    <div>
                      <label className="block text-theme-primary text-sm font-medium mb-2">
                        Nome do perfil:
                      </label>
                      <input
                        type="text"
                        value={formData.profileName}
                        onChange={(e) => handleInputChange('profileName', e.target.value)}
                        className={`w-full px-4 py-3 theme-input rounded-lg ${
                          errors.profileName ? 'border-red-500' : ''
                        }`}
                        placeholder="Digite seu nome"
                      />
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-theme-primary text-sm font-medium mb-2">
                        Palavra-passe:
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className={`w-full px-4 py-3 theme-input rounded-lg pr-12 ${
                            errors.password ? 'border-red-500' : ''
                          }`}
                          placeholder="Digite sua senha"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-theme-secondary hover:text-theme-primary"
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Checkboxes */}
                    <div className="space-y-3">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" />
                        <span className="text-theme-secondary text-sm">
                          Receba novidades, atualizações e ofertas da nossa parte.
                        </span>
                      </label>
                      
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input type="checkbox" className="mt-1" />
                        <span className="text-theme-secondary text-sm">
                          Ao inscrever-se, você concorda com os nossos{' '}
                          <a href="#" className="text-accent-red hover:underline">Termos de Serviço</a>
                          {' '}e a nossa{' '}
                          <a href="#" className="text-accent-red hover:underline">Política de Privacidade</a>.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-bold py-4 px-6 rounded-lg transition-colors"
                    >
                      Próximo
                    </button>

                    {/* Links */}
                    <div className="text-center space-y-2">
                      <a href="#" className="block text-accent-red hover:underline text-sm">
                        Já possui uma conta? Inicie sessão aqui.
                      </a>
                      <a href="#" className="block text-accent-red hover:underline text-sm">
                        É proprietário de conteúdo? Clique aqui.
                      </a>
                    </div>


                  </form>
                </div>
              )}
            </div>

            {/* Right Section - Premium Offer */}
            <div className="flex-1 bg-gradient-to-br from-red-900 to-red-800 p-8 relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2">
                  Inscrição Premium
                </h2>
                <p className="text-white/80 mb-2">
                  Torne-se um membro privilegiado
                </p>
                                 <div className="inline-block bg-accent-red text-white px-2 py-1 rounded text-sm font-bold mb-8">
                   RED
                 </div>

                {/* Premium Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="border border-white/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <Ban size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">Sem Anúncios</p>
                  </div>

                  <div className="border border-white/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <Star size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">Conteúdo Exclusivo</p>
                  </div>

                  <div className="border border-white/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <Play size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">Vídeos de alta definição</p>
                  </div>

                  <div className="border border-white/30 rounded-lg p-4 text-center">
                    <div className="flex justify-center mb-2">
                      <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                        <RefreshCw size={24} className="text-white" />
                      </div>
                    </div>
                    <p className="text-white text-sm font-medium">+750 Novos vídeos/dia</p>
                  </div>
                </div>

                {/* Premium Button */}
                                 <button className="w-full bg-accent-red hover:bg-accent-red-hover text-white font-bold py-4 px-6 rounded-lg transition-colors">
                   Torne-se um membro premium em RED
                 </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 