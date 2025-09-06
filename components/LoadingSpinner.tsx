'use client'

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-900">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin border-blue-500"></div>
        <p className="text-sm text-gray-300">
          Carregando...
        </p>
      </div>
    </div>
  )
}
