const fs = require('fs');

function testScrollToPlans() {
  console.log('🧪 Testando funcionalidade de scroll para os planos...\n');

  // Verificar se a funcionalidade foi implementada na LandingPage
  try {
    const landingContent = fs.readFileSync('components/LandingPage.tsx', 'utf8');
    
    if (landingContent.includes('scrollToPlans')) {
      console.log('✅ Função scrollToPlans implementada');
    } else {
      console.log('❌ Função scrollToPlans não implementada');
    }

    if (landingContent.includes('scrollIntoView')) {
      console.log('✅ Scroll suave implementado');
    } else {
      console.log('❌ Scroll suave não implementado');
    }

    if (landingContent.includes('plans-section')) {
      console.log('✅ ID da seção de planos implementado');
    } else {
      console.log('❌ ID da seção de planos não implementado');
    }

    if (landingContent.includes('onClick={scrollToPlans}')) {
      console.log('✅ Botão ASSINAR AGORA configurado para scroll');
    } else {
      console.log('❌ Botão ASSINAR AGORA não configurado para scroll');
    }

    // Verificar se o botão foi alterado de Link para button
    if (landingContent.includes('<button') && landingContent.includes('ASSINAR AGORA')) {
      console.log('✅ Botão ASSINAR AGORA alterado de Link para button');
    } else {
      console.log('❌ Botão ASSINAR AGORA não foi alterado');
    }

    // Verificar se o Link para /register foi removido
    if (!landingContent.includes('href="/register"')) {
      console.log('✅ Link para /register removido (correto)');
    } else {
      console.log('❌ Link para /register ainda presente');
    }

    // Verificar comportamento do scroll
    if (landingContent.includes('behavior: \'smooth\'')) {
      console.log('✅ Comportamento de scroll suave configurado');
    } else {
      console.log('❌ Comportamento de scroll suave não configurado');
    }

    if (landingContent.includes('block: \'start\'')) {
      console.log('✅ Posicionamento do scroll configurado');
    } else {
      console.log('❌ Posicionamento do scroll não configurado');
    }

  } catch (error) {
    console.log('❌ Erro ao ler LandingPage:', error.message);
  }

  console.log('\n🎯 Como testar:');
  console.log('1. Execute: npm run dev');
  console.log('2. Acesse a página inicial (sem login)');
  console.log('3. Clique no botão "ASSINAR AGORA" no header');
  console.log('4. Verifique se a página rola suavemente até os planos');
  console.log('5. Teste em diferentes posições da página');
  console.log('6. Verifique se funciona em mobile');

  console.log('\n📱 Características da funcionalidade:');
  console.log('- Scroll suave até a seção de planos');
  console.log('- Botão no header alterado de Link para button');
  console.log('- ID único na seção de planos (plans-section)');
  console.log('- Comportamento responsivo');
  console.log('- Posicionamento otimizado (block: start)');
}

testScrollToPlans(); 