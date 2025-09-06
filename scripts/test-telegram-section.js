const fs = require('fs');

function testTelegramSection() {
  console.log('🧪 Testando seção do Canal Telegram (versão compacta)...\n');

  // Verificar se a seção foi adicionada na página principal
  try {
    const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
    
    if (pageContent.includes('Acessar canal do Telegram')) {
      console.log('✅ Seção compacta do Telegram encontrada na página principal');
    } else {
      console.log('❌ Seção compacta do Telegram não encontrada na página principal');
    }

    if (pageContent.includes('t.me/@vazadexvipbot')) {
      console.log('✅ Link do bot do Telegram encontrado');
    } else {
      console.log('❌ Link do bot do Telegram não encontrado');
    }

    if (pageContent.includes('50.000 mídias')) {
      console.log('✅ Estatísticas de mídias encontradas');
    } else {
      console.log('❌ Estatísticas de mídias não encontradas');
    }

    if (pageContent.includes('+1000 criadores')) {
      console.log('✅ Estatísticas de criadores encontradas');
    } else {
      console.log('❌ Estatísticas de criadores não encontradas');
    }

    if (pageContent.includes('FaComments')) {
      console.log('✅ Ícone do Telegram importado');
    } else {
      console.log('❌ Ícone do Telegram não importado');
    }

    if (pageContent.includes('FaChevronDown') && pageContent.includes('FaChevronUp')) {
      console.log('✅ Ícones de expansão importados');
    } else {
      console.log('❌ Ícones de expansão não importados');
    }

    if (pageContent.includes('isTelegramExpanded')) {
      console.log('✅ Estado de expansão implementado');
    } else {
      console.log('❌ Estado de expansão não implementado');
    }

    if (pageContent.includes('useTheme')) {
      console.log('✅ Hook de tema importado');
    } else {
      console.log('❌ Hook de tema não importado');
    }

    if (pageContent.includes('theme === \'dark\'')) {
      console.log('✅ Lógica de tema implementada');
    } else {
      console.log('❌ Lógica de tema não implementada');
    }

    if (pageContent.includes('text-theme-primary')) {
      console.log('✅ Classes de tema aplicadas');
    } else {
      console.log('❌ Classes de tema não aplicadas');
    }

    if (pageContent.includes('email de cadastro no site')) {
      console.log('✅ Instruções de acesso encontradas');
    } else {
      console.log('❌ Instruções de acesso não encontradas');
    }

  } catch (error) {
    console.log('❌ Erro ao ler página principal:', error.message);
  }

  // Verificar se foi removida da LandingPage
  try {
    const landingContent = fs.readFileSync('components/LandingPage.tsx', 'utf8');
    
    if (!landingContent.includes('Acesse também no canal no Telegram')) {
      console.log('✅ Seção do Telegram removida da LandingPage (correto)');
    } else {
      console.log('❌ Seção do Telegram ainda presente na LandingPage');
    }

  } catch (error) {
    console.log('❌ Erro ao verificar LandingPage:', error.message);
  }

  console.log('\n🎯 Como testar:');
  console.log('1. Execute: npm run dev');
  console.log('2. Faça login na aplicação');
  console.log('3. Na página inicial (após login), você deve ver a seção do Telegram');
  console.log('4. Clique no botão "Acessar Canal" para testar o link');
  console.log('5. Verifique se o design está responsivo em mobile');

  console.log('\n📱 Características da seção compacta:');
  console.log('- Aparece apenas para usuários logados');
  console.log('- Design compacto adaptado aos temas (light/dark)');
  console.log('- Ícone do Telegram pequeno');
  console.log('- Estatísticas destacadas em amarelo');
  console.log('- Expansível ao clicar');
  console.log('- Botão de acesso direto no card expandido');
  console.log('- Instruções claras de como usar no card expandido');
  console.log('- Transições suaves entre temas');
  console.log('- Hover effects adaptados ao tema');
}

testTelegramSection(); 