'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { FaFire } from 'react-icons/fa'

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState({
    email: false,
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
      password: !formData.password
    }
    setErrors(newErrors)
    
    if (!Object.values(newErrors).some(Boolean)) {
      try {
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          source: 'website'
        })
        
        if (result?.error) {
          setAuthError('Email ou senha incorretos')
        } else {
          router.push('/')
        }
      } catch (error) {
        setAuthError('Erro ao fazer login. Tente novamente.')
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Modal de Login */}
      <div className="w-full max-w-lg border border-white/20 rounded-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FaFire className="text-orange-500 text-2xl" />
            <span className="text-white text-2xl font-bold">AmadorFlix</span>
          </div>
        </div>

        {/* Título */}
        <h1 className="text-white text-2xl font-bold text-center mb-4">
          Acesse sua conta
        </h1>

        {/* Texto de instrução */}
        <p className="text-white text-sm text-center mb-8 leading-relaxed">
          Se é sua primeira vez, para acessar preencha o campo senha com o mesmo e-mail utilizado no cadastro.
        </p>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Email */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              E-mail
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-4 py-3 bg-white text-black rounded-lg border transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
              }`}
              placeholder="Digite seu e-mail"
            />
            {errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                Por favor, digite seu e-mail
              </p>
            )}
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Senha
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`w-full px-4 py-3 bg-white text-black rounded-lg border transition-colors ${
                errors.password ? 'border-red-500' : 'border-gray-300 focus:border-red-500'
              }`}
              placeholder="Digite sua senha"
            />
            {errors.password && (
              <p className="mt-1 text-red-500 text-sm">
                Por favor, digite sua senha
              </p>
            )}
          </div>

          {/* Erro de autenticação */}
          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-500 text-sm">{authError}</p>
            </div>
          )}

          {/* Botão de Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-600/50 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Entrando...
              </>
            ) : (
              'ENTRAR'
            )}
          </button>
        </form>

        {/* Link Esqueci a senha */}
        <div className="text-center mt-6">
          <Link 
            href="#" 
            className="text-blue-500 hover:underline text-sm transition-colors"
          >
            Esqueci a senha
          </Link>
        </div>
      </div>
    </div>
  )
} 