const fs = require('fs');

function testSlider() {
  console.log('🧪 Testando slider com 9 imagens...\n');

  // Verificar se o slider foi implementado na LandingPage
  try {
    const landingContent = fs.readFileSync('components/LandingPage.tsx', 'utf8');
    
    if (landingContent.includes('Slider com 9 Imagens')) {
      console.log('✅ Slider implementado na LandingPage');
    } else {
      console.log('❌ Slider não implementado na LandingPage');
    }

    if (landingContent.includes('currentSlide')) {
      console.log('✅ Estado do slider implementado');
    } else {
      console.log('❌ Estado do slider não implementado');
    }

    if (landingContent.includes('nextSlide') && landingContent.includes('prevSlide')) {
      console.log('✅ Funções de navegação implementadas');
    } else {
      console.log('❌ Funções de navegação não implementadas');
    }

    if (landingContent.includes('goToSlide')) {
      console.log('✅ Função de navegação direta implementada');
    } else {
      console.log('❌ Função de navegação direta não implementada');
    }

    if (landingContent.includes('FaChevronLeft') && landingContent.includes('FaChevronRight')) {
      console.log('✅ Ícones de navegação importados');
    } else {
      console.log('❌ Ícones de navegação não importados');
    }

    // Verificar se há 9 slides
    const slideCount = (landingContent.match(/Imagem \d+/g) || []).length;
    if (slideCount === 9) {
      console.log(`✅ ${slideCount} slides implementados`);
    } else {
      console.log(`❌ ${slideCount} slides encontrados (esperado: 9)`);
    }

    // Verificar conteúdo dos slides
    const slideContents = [
      '50.000 Mil Videos',
      '+1000 Criadores',
      'Acesso Imediato',
      'Conteúdo Exclusivo',
      '100% Seguro',
      'Mobile Friendly',
      'Atualização Diária',
      'Suporte Ativo',
      'Canal Telegram'
    ];

    console.log('\n📊 Conteúdo dos slides:');
    slideContents.forEach((content, index) => {
      if (landingContent.includes(content)) {
        console.log(`✅ Slide ${index + 1}: "${content}"`);
      } else {
        console.log(`❌ Slide ${index + 1}: "${content}" - não encontrado`);
      }
    });

    // Verificar ícones dos slides
    const slideIcons = [
      'FaPlay',
      'FaUsers',
      'FaUnlock',
      'FaFire',
      'FaShieldAlt',
      'FaMobile',
      'FaCalendarAlt',
      'FaHeadphones',
      'FaComments'
    ];

    console.log('\n🎨 Ícones dos slides:');
    slideIcons.forEach((icon, index) => {
      if (landingContent.includes(icon)) {
        console.log(`✅ Slide ${index + 1}: ${icon}`);
      } else {
        console.log(`❌ Slide ${index + 1}: ${icon} - não encontrado`);
      }
    });

    // Verificar auto-play
    if (landingContent.includes('setInterval') && landingContent.includes('3000')) {
      console.log('✅ Auto-play implementado (3 segundos)');
    } else {
      console.log('❌ Auto-play não implementado');
    }

         // Verificar indicadores
     if (landingContent.includes('Indicadores de slide')) {
       console.log('✅ Indicadores de slide implementados');
     } else {
       console.log('❌ Indicadores de slide não implementados');
     }

           // Verificar se as imagens estão sendo usadas
      const imageCount = (landingContent.match(/\/imgs\/capas\/\d{2}\.jpg/g) || []).length;
      if (imageCount === 9) {
        console.log(`✅ ${imageCount} imagens implementadas (/imgs/capas/01.jpg a 09.jpg)`);
      } else {
        console.log(`❌ ${imageCount} imagens encontradas (esperado: 9)`);
      }

     // Verificar se o componente Image está sendo usado
     if (landingContent.includes('Image') && landingContent.includes('fill')) {
       console.log('✅ Componente Image do Next.js implementado');
     } else {
       console.log('❌ Componente Image do Next.js não implementado');
     }

           // Verificar se texto e ícones foram removidos
      if (!landingContent.includes('50.000 Mil Videos') && !landingContent.includes('FaPlay')) {
        console.log('✅ Texto e ícones removidos (apenas imagens)');
      } else {
        console.log('❌ Texto e ícones ainda presentes');
      }

  } catch (error) {
    console.log('❌ Erro ao ler LandingPage:', error.message);
  }

  console.log('\n🎯 Como testar:');
  console.log('1. Execute: npm run dev');
  console.log('2. Acesse a página inicial (sem login)');
  console.log('3. Observe o slider na seção promocional');
  console.log('4. Teste as setas de navegação (esquerda/direita)');
  console.log('5. Clique nos indicadores para navegar diretamente');
  console.log('6. Verifique se o auto-play funciona (3 segundos)');
  console.log('7. Teste em mobile para verificar responsividade');

  console.log('\n📱 Características do slider:');
  console.log('- 9 slides com imagens reais (/imgs/capas/01.jpg a 09.jpg)');
  console.log('- Apenas imagens, sem texto ou ícones');
  console.log('- Auto-play a cada 3 segundos');
  console.log('- Navegação manual com setas');
  console.log('- Indicadores clicáveis');
  console.log('- Transições suaves (500ms)');
  console.log('- Design responsivo');
  console.log('- Otimização de performance com priority loading');
}

testSlider(); 