'use client'

import { useTheme } from '@/contexts/ThemeContext'
import Link from 'next/link'
import { FaFire } from 'react-icons/fa'

export default function Logo() {
  const { theme } = useTheme()

  return (
    <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
      <FaFire className="text-red-500 text-xl" />
      <span className="text-white text-xl font-bold">Amador Flix</span>
    </Link>
  )
} 