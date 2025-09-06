// Script para testar o sistema de temas
// Execute no console do navegador

console.log('🎨 Testando Sistema de Temas...')

// Verificar se o Tailwind está funcionando
console.log('📋 Verificando Tailwind CSS:')
console.log('- darkMode configurado:', typeof window !== 'undefined' && window.tailwind !== undefined)

// Verificar classes do HTML
console.log('📋 Verificando classes do HTML:')
console.log('- HTML classes:', document.documentElement.className)

// Verificar localStorage
console.log('📋 Verificando localStorage:')
console.log('- Tema salvo:', localStorage.getItem('theme'))

// Verificar preferência do sistema
console.log('📋 Verificando preferência do sistema:')
console.log('- Prefere dark:', window.matchMedia('(prefers-color-scheme: dark)').matches)

// Função para testar alternância
window.testThemeToggle = () => {
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
  
  console.log(`🔄 Alternando de ${currentTheme} para ${newTheme}`)
  
  document.documentElement.classList.remove('dark', 'light')
  document.documentElement.classList.add(newTheme)
  localStorage.setItem('theme', newTheme)
  
  console.log('✅ Tema alternado!')
  console.log('- Nova classe HTML:', document.documentElement.className)
  console.log('- Novo localStorage:', localStorage.getItem('theme'))
}

// Função para forçar tema dark
window.forceDarkTheme = () => {
  console.log('🌙 Forçando tema dark...')
  document.documentElement.classList.remove('light')
  document.documentElement.classList.add('dark')
  localStorage.setItem('theme', 'dark')
  console.log('✅ Tema dark aplicado!')
}

// Função para forçar tema light
window.forceLightTheme = () => {
  console.log('☀️ Forçando tema light...')
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
  localStorage.setItem('theme', 'light')
  console.log('✅ Tema light aplicado!')
}

console.log('🚀 Funções disponíveis:')
console.log('- testThemeToggle() - Alterna entre temas')
console.log('- forceDarkTheme() - Força tema dark')
console.log('- forceLightTheme() - Força tema light')

console.log('🎯 Para testar, execute: testThemeToggle()') 