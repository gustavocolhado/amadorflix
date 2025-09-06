import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen dark:bg-dark-bg bg-light-bg">
      {children}
    </div>
  )
} 