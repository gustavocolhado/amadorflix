'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const { signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await signOut()
        // Aguarda um pouco antes de redirecionar para mostrar a mensagem
        setTimeout(() => {
          router.push('/')
        }, 1500)
      } catch (error) {
        console.error('Erro ao fazer logout:', error)
        router.push('/')
      }
    }

    handleLogout()
  }, [signOut, router])

  return (
    <div className="min-h-screen bg-theme-background flex items-center justify-center">
      <div className="bg-theme-card rounded-lg shadow-2xl p-8 text-center max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 border-4 border-accent-red border-t-transparent rounded-full animate-spin flex items-center justify-center">
            <LogOut size={24} className="text-accent-red" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-theme-primary mb-2">
          Saindo...
        </h1>
        
        <p className="text-theme-secondary mb-4">
          Você está sendo desconectado da sua conta.
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-theme-secondary">
          <Loader2 size={16} className="animate-spin" />
          <span className="text-sm">Redirecionando...</span>
        </div>
      </div>
    </div>
  )
} 