'use client'

import { useState } from 'react'
import { ChevronDown, Video, Menu, User, Camera, LogOut, Crown, Settings, Heart, Star, Clock, MessageCircle } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'
import MobileSidebar from './MobileSidebar'
import AuthModal from './AuthModal'
import UserStatus from './UserStatus'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function Header() {
  const { session, status, signOut } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Fechar menu quando clicar fora
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Element
    if (!target.closest('.user-menu')) {
      setIsUserMenuOpen(false)
    }
  }

  // Adicionar listener para fechar menu
  if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside)
  }

  return (
    <header className="theme-header lg:sticky lg:top-0 z-50 container-full">
      <div className="container-content">
        {/* Mobile Header */}
        <div className="lg:hidden">
          {/* Top Row - Menu, Logo, User */}
          <div className="flex items-center justify-between py-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-theme-primary hover:text-accent-red transition-colors"
            >
              <Menu size={24} />
            </button>
            
            <Logo />
            
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              {status === 'authenticated' ? (
                <button 
                  onClick={() => signOut()}
                  className="text-theme-primary hover:text-accent-red transition-colors"
                  title="Sair"
                >
                  <LogOut size={24} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-theme-primary hover:text-accent-red transition-colors"
                  title="Entrar"
                >
                  <User size={24} />
                </button>
              )}
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="flex items-center theme-input rounded-lg overflow-hidden mb-4">
            <input
              type="text"
              placeholder="Pesquisar vídeos amadores.."
              className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
            />
            <div className="flex items-center border-l border-theme-input">
              <button className="flex items-center space-x-2 px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors">
                <Camera size={16} />
                <span className="text-sm">Videos</span>
                <ChevronDown size={12} />
              </button>
            </div>
            <button className="theme-btn-primary px-6 py-2">
              BUSCAR
            </button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          {/* Logo Section */}
          <div className="flex items-center justify-between py-4">
            <Logo />
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex items-center theme-input rounded-lg overflow-hidden">
                <input
                  type="text"
                  placeholder="Pesquisar videos amadores..."
                  className="flex-1 bg-transparent px-4 py-2 focus:outline-none"
                />
                <div className="flex items-center border-l border-theme-input">
                  <button className="flex items-center space-x-2 px-4 py-2 text-theme-secondary hover:text-theme-primary transition-colors">
                    <Video size={16} />
                    <span className="text-sm">Videos</span>
                    <ChevronDown size={12} />
                  </button>
                </div>
                <button className="theme-btn-primary px-6 py-2">
                  BUSCAR
                </button>
              </div>
            </div>

            {/* User Options */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="flex items-center space-x-1 text-theme-secondary hover:text-theme-primary transition-colors">
                <span className="text-sm font-medium">PT</span>
                <ChevronDown size={12} />
              </button>
              
              {status === 'authenticated' ? (
                <div className="flex items-center space-x-4">
                  <UserStatus />
                  
                  {/* User Menu */}
                  <div className="relative user-menu">
                    <button 
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-theme-primary hover:text-accent-red transition-colors"
                    >
                      <div className="w-8 h-8 bg-accent-red rounded-full flex items-center justify-center">
                        {session?.user?.image ? (
                          <img 
                            src={session.user.image} 
                            alt={session.user.name || 'Avatar'} 
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">
                        {session?.user?.name || session?.user?.email}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-theme-card border border-theme-border-primary rounded-xl shadow-xl z-50">
                        <div className="p-4 border-b border-theme-border-primary">
                          <p className="text-sm text-theme-secondary">Logado como</p>
                          <p className="font-medium text-theme-primary">
                            {session?.user?.name || session?.user?.email}
                          </p>
                        </div>
                        
                        <div className="p-2">
                          <button
                            onClick={() => {
                              router.push('/profile')
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
                          >
                            <User className="w-4 h-4" />
                            <span>Meu Perfil</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push('/profile?tab=liked')
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
                          >
                            <Heart className="w-4 h-4" />
                            <span>Vídeos Curtidos</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push('/profile?tab=favorites')
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
                          >
                            <Star className="w-4 h-4" />
                            <span>Favoritos</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push('/profile?tab=history')
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
                          >
                            <Clock className="w-4 h-4" />
                            <span>Histórico</span>
                          </button>
                          
                          <button
                            onClick={() => {
                              router.push('/profile?tab=settings')
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-theme-primary hover:bg-theme-hover rounded-lg transition-colors"
                          >
                            <Settings className="w-4 h-4" />
                            <span>Configurações</span>
                          </button>
                        </div>
                        
                        <div className="p-2 border-t border-theme-border-primary">
                          <button 
                            onClick={() => {
                              signOut()
                              setIsUserMenuOpen(false)
                            }}
                            className="w-full flex items-center space-x-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sair</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="theme-btn-primary px-4 py-2 rounded"
                  >
                    ENTRAR
                  </button>
                  
                  <button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="border border-theme-primary hover:border-theme-secondary px-4 py-2 rounded text-theme-primary transition-colors"
                  >
                    CRIAR UMA CONTA
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6 py-2 border-t border-theme-input">
            <a href="/" className="text-accent-red border-b-2 border-accent-red pb-1 text-sm font-medium">Home</a>
            <a href="/videos" className="text-theme-secondary hover:text-theme-primary transition-colors text-sm">Videos</a>
            <a href="/creators" className="text-theme-secondary hover:text-theme-primary transition-colors text-sm">Criadores</a>
            <a 
              href="https://t.me/amadorflixbot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-theme-secondary hover:text-theme-primary transition-colors text-sm"
            >
              <MessageCircle size={16} />
              <span>Telegram</span>
            </a>
          </div>
        </div>

      </div>
      
      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </header>
  )
} 