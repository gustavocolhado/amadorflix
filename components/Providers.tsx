'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import LoadingSpinner from './LoadingSpinner'

function HydrationWrapper({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <HydrationWrapper>
          <AuthProvider>
            {children}
          </AuthProvider>
        </HydrationWrapper>
      </ThemeProvider>
    </SessionProvider>
  )
} 