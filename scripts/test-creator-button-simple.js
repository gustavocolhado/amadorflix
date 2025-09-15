// Script simples para testar se o botão "Ver criador" está funcionando
console.log('🔍 Testando funcionalidade do botão "Ver criador"...\n')

// Simular dados de vídeo com creatorId
const mockVideo = {
  id: '123',
  title: 'Vídeo de Teste',
  creator: 'Cremona',
  creatorId: 'creator123'
}

console.log('📹 Vídeo de teste:')
console.log(`   Título: ${mockVideo.title}`)
console.log(`   Creator: ${mockVideo.creator}`)
console.log(`   CreatorId: ${mockVideo.creatorId}`)

if (mockVideo.creatorId) {
  console.log('✅ Botão "Ver criador" deve aparecer!')
  console.log(`🔗 URL: /creators/${mockVideo.creatorId}`)
} else {
  console.log('❌ Botão "Ver criador" NÃO deve aparecer')
}

console.log('\n🎯 Para testar no navegador:')
console.log('1. Abra http://localhost:3000')
console.log('2. Procure por vídeos que tenham creator')
console.log('3. Verifique se o botão "Ver criador" aparece')
console.log('4. Clique no botão para ir para a página do creator')
