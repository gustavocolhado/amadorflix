const fs = require('fs');

function testClarityScript() {
  console.log('🧪 Testando script do Microsoft Clarity...\n');

  // Verificar se o layout contém o script
  try {
    const layoutContent = fs.readFileSync('app/layout.tsx', 'utf8');
    
    if (layoutContent.includes('sq66elyfz4')) {
      console.log('✅ Project ID encontrado no layout:', 'sq66elyfz4');
    } else {
      console.log('❌ Project ID não encontrado no layout');
    }

    if (layoutContent.includes('clarity.ms/tag/')) {
      console.log('✅ Script do Clarity encontrado no layout');
    } else {
      console.log('❌ Script do Clarity não encontrado no layout');
    }

    if (layoutContent.includes('dangerouslySetInnerHTML')) {
      console.log('✅ Script implementado corretamente com dangerouslySetInnerHTML');
    } else {
      console.log('❌ Script não implementado corretamente');
    }

  } catch (error) {
    console.log('❌ Erro ao ler layout:', error.message);
  }

  // Verificar se os arquivos antigos foram removidos
  const removedFiles = [
    'lib/clarity.ts',
    'lib/analytics.ts', 
    'components/ClarityProvider.tsx',
    'scripts/test-clarity-integration.js'
  ];

  console.log('\n📁 Verificando remoção de arquivos antigos:');
  
  for (const file of removedFiles) {
    if (!fs.existsSync(file)) {
      console.log(`✅ ${file} - Removido`);
    } else {
      console.log(`❌ ${file} - Ainda existe`);
    }
  }

  console.log('\n🎯 Como testar:');
  console.log('1. Execute: npm run dev');
  console.log('2. Abra o navegador em http://localhost:3000');
  console.log('3. Abra o console do navegador (F12)');
  console.log('4. Digite: clarity');
  console.log('5. Se retornar uma função, está funcionando!');
  console.log('6. Acesse: https://clarity.microsoft.com/ para ver os dados');

  console.log('\n📊 APIs disponíveis no navegador:');
  console.log('- clarity.identify(userId, sessionId, pageId, friendlyName)');
  console.log('- clarity.setTag(key, value)');
  console.log('- clarity.event(eventName)');
  console.log('- clarity.consent(boolean)');
  console.log('- clarity.upgrade(reason)');
}

testClarityScript(); 