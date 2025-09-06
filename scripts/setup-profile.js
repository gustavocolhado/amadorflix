const { execSync } = require('child_process')

console.log('🚀 Configurando sistema de perfil...')

try {
  // Gerar cliente Prisma
  console.log('📦 Gerando cliente Prisma...')
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  // Executar migração do banco de dados
  console.log('🗄️ Executando migração do banco de dados...')
  execSync('npx prisma db push', { stdio: 'inherit' })
  
  console.log('✅ Sistema de perfil configurado com sucesso!')
  console.log('')
  console.log('📋 Funcionalidades disponíveis:')
  console.log('   • Página de perfil do usuário')
  console.log('   • Edição de informações pessoais')
  console.log('   • Visualização de vídeos curtidos')
  console.log('   • Visualização de vídeos favoritos')
  console.log('   • Histórico de visualização')
  console.log('   • Configurações da conta')
  console.log('   • Botões de like e favorito nos vídeos')
  console.log('')
  console.log('🔗 Acesse: /profile')
  
} catch (error) {
  console.error('❌ Erro ao configurar sistema de perfil:', error.message)
  process.exit(1)
} 