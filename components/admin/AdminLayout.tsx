'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  FaHome, 
  FaUsers, 
  FaVideo, 
  FaTags, 
  FaUserPlus, 
  FaChartBar, 
  FaCog, 
  FaBars, 
  FaTimes,
  FaSignOutAlt,
  FaUser,
  FaShieldAlt,
  FaBell,
  FaSearch,
  FaGlobe
} from 'react-icons/fa';
import Image from 'next/image';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', icon: FaHome, href: '/admin' },
    { name: 'Usuários', icon: FaUsers, href: '/admin/users' },
    { name: 'Vídeos', icon: FaVideo, href: '/admin/videos' },
    { name: 'Creators', icon: FaUserPlus, href: '/admin/creators' },
    { name: 'Campanhas', icon: FaGlobe, href: '/admin/campaigns' },
    { name: 'Categorias', icon: FaTags, href: '/admin/categories' },
    { name: 'Relatórios', icon: FaChartBar, href: '/admin/reports' },
    { name: 'Configurações', icon: FaCog, href: '/admin/settings' },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-neutral-800 to-neutral-900 border-r border-neutral-700/50 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Logo Section */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-700/50 bg-neutral-800/50">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image src="/imgs/logo.png" alt="Logo" width={32} height={32} className="rounded-lg" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-800"></div>
            </div>
            <div>
              <span className="text-white font-bold text-lg">Admin</span>
              <div className="text-xs text-neutral-400">Painel de Controle</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-700 transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="mb-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={14} />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-9 pr-3 py-2 bg-neutral-700/50 border border-neutral-600/50 rounded-lg text-white placeholder-neutral-400 text-sm focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20"
              />
            </div>
          </div>

          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => {
                    router.push(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActiveRoute(item.href)
                      ? 'text-white bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 shadow-lg shadow-red-500/10'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-700/50'
                  }`}
                >
                  <item.icon size={16} className={isActiveRoute(item.href) ? 'text-red-400' : ''} />
                  {item.name}
                  {isActiveRoute(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-neutral-700/50 bg-neutral-800/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                <FaShieldAlt size={16} className="text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-neutral-800"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {session?.user?.name || session?.user?.email}
              </p>
              <p className="text-neutral-400 text-xs">Administrador</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-neutral-300 hover:text-white hover:bg-neutral-700/50 rounded-lg transition-colors text-sm"
          >
            <FaSignOutAlt size={14} />
            Sair do Sistema
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-neutral-800/50 backdrop-blur-sm border-b border-neutral-700/50 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-neutral-700/50 transition-colors"
            >
              <FaBars size={18} />
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-neutral-400">
              <FaShieldAlt className="text-red-500" size={16} />
              <span className="text-sm font-medium">Painel de Administração</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-700/50 transition-colors">
              <FaBell size={16} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-neutral-800"></div>
            </button>
            
            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-400">
              <span>Bem-vindo,</span>
              <span className="text-white font-medium">
                {session?.user?.name?.split(' ')[0] || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
} 