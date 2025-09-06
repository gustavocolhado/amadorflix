'use client'

import { X, Home, Play, Users, User, MessageCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const { session, status } = useAuth()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-80 bg-theme-card z-50 transform transition-transform duration-300 ease-in-out lg:hidden
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-end p-4 border-b border-theme-input">
          <button 
            onClick={onClose}
            className="text-theme-primary hover:text-accent-red transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="py-2">
            <li>
              <button 
                onClick={() => handleNavigation('/')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-accent-red font-medium hover:bg-theme-hover transition-colors"
              >
                <Home size={20} className="text-accent-red" />
                <span className="flex-1 text-left">Home</span>
              </button>
              <div className="border-b border-theme-input mx-4" />
            </li>
            
            <li>
              <button 
                onClick={() => handleNavigation('/videos')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-colors"
              >
                <Play size={20} className="text-accent-red" />
                <span className="flex-1 text-left">Videos</span>
              </button>
              <div className="border-b border-theme-input mx-4" />
            </li>
            
            <li>
              <button 
                onClick={() => handleNavigation('/creators')}
                className="w-full flex items-center space-x-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-colors"
              >
                <Users size={20} className="text-accent-red" />
                <span className="flex-1 text-left">Criadores</span>
              </button>
              <div className="border-b border-theme-input mx-4" />
            </li>
            
            {status === 'authenticated' && (
              <li>
                <button 
                  onClick={() => handleNavigation('/profile')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-colors"
                >
                  <User size={20} className="text-accent-red" />
                  <span className="flex-1 text-left">Minha Conta</span>
                </button>
                <div className="border-b border-theme-input mx-4" />
              </li>
            )}
            
            <li>
              <a 
                href="https://t.me/@vazadexvipbot" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center space-x-3 px-4 py-3 text-theme-primary hover:bg-theme-hover transition-colors"
              >
                <MessageCircle size={20} className="text-accent-red" />
                <span className="flex-1 text-left">Canal Telegram</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </>
  )
} 