#!/usr/bin/env node

/**
 * Script para atualizar cores dos temas
 * Uso: node scripts/updateThemeColors.js
 */

const fs = require('fs');
const path = require('path');

// Cores padrão atualizadas
const newColors = {
  dark: {
    bg: '#0f0f0f',
    card: '#1a1a1a',
    hover: '#2a2a2a',
    border: '#333333',
    text: {
      primary: '#ffffff',
      secondary: '#b3b3b3',
      muted: '#808080'
    }
  },
  light: {
    bg: '#ffffff',
    card: '#f8f9fa',
    hover: '#e9ecef',
    border: '#dee2e6',
    text: {
      primary: '#212529',
      secondary: '#495057',
      muted: '#6c757d'
    }
  }
};

// Função para atualizar config/colors.ts
function updateColorsConfig() {
  const colorsPath = path.join(__dirname, '../config/colors.ts');
  let content = fs.readFileSync(colorsPath, 'utf8');
  
  // Atualizar cores dark
  content = content.replace(
    /dark:\s*{[^}]+}/s,
    `dark: {
    bg: '${newColors.dark.bg}',
    card: '${newColors.dark.card}',
    hover: '${newColors.dark.hover}',
    border: '${newColors.dark.border}',
    text: {
      primary: '${newColors.dark.text.primary}',
      secondary: '${newColors.dark.text.secondary}',
      muted: '${newColors.dark.text.muted}'
    }
  }`
  );
  
  // Atualizar cores light
  content = content.replace(
    /light:\s*{[^}]+}/s,
    `light: {
    bg: '${newColors.light.bg}',
    card: '${newColors.light.card}',
    hover: '${newColors.light.hover}',
    border: '${newColors.light.border}',
    text: {
      primary: '${newColors.light.text.primary}',
      secondary: '${newColors.light.text.secondary}',
      muted: '${newColors.light.text.muted}'
    }
  }`
  );
  
  fs.writeFileSync(colorsPath, content);
  console.log('✅ config/colors.ts atualizado');
}

// Função para atualizar app/globals.css
function updateGlobalCSS() {
  const cssPath = path.join(__dirname, '../app/globals.css');
  let content = fs.readFileSync(cssPath, 'utf8');
  
  // Atualizar tema dark
  content = content.replace(
    /\.dark body\s*{[^}]+}/s,
    `.dark body {
  background-color: ${newColors.dark.bg};
  color: ${newColors.dark.text.primary};
}`
  );
  
  // Atualizar tema light
  content = content.replace(
    /\.light body\s*{[^}]+}/s,
    `.light body {
  background-color: ${newColors.light.bg};
  color: ${newColors.light.text.primary};
}`
  );
  
  fs.writeFileSync(cssPath, content);
  console.log('✅ app/globals.css atualizado');
}

// Função para atualizar tailwind.config.js
function updateTailwindConfig() {
  const tailwindPath = path.join(__dirname, '../tailwind.config.js');
  let content = fs.readFileSync(tailwindPath, 'utf8');
  
  // Atualizar cores dark
  content = content.replace(
    /'dark-bg':\s*'[^']+'/g,
    `'dark-bg': '${newColors.dark.bg}'`
  );
  content = content.replace(
    /'dark-card':\s*'[^']+'/g,
    `'dark-card': '${newColors.dark.card}'`
  );
  content = content.replace(
    /'dark-hover':\s*'[^']+'/g,
    `'dark-hover': '${newColors.dark.hover}'`
  );
  
  // Atualizar cores light
  content = content.replace(
    /'light-bg':\s*'[^']+'/g,
    `'light-bg': '${newColors.light.bg}'`
  );
  content = content.replace(
    /'light-card':\s*'[^']+'/g,
    `'light-card': '${newColors.light.card}'`
  );
  content = content.replace(
    /'light-hover':\s*'[^']+'/g,
    `'light-hover': '${newColors.light.hover}'`
  );
  
  fs.writeFileSync(tailwindPath, content);
  console.log('✅ tailwind.config.js atualizado');
}

// Função principal
function main() {
  console.log('🎨 Atualizando cores dos temas...\n');
  
  try {
    updateColorsConfig();
    updateGlobalCSS();
    updateTailwindConfig();
    
    console.log('\n🎉 Todas as cores foram atualizadas com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Reinicie o servidor de desenvolvimento');
    console.log('2. Teste ambos os temas (dark/light)');
    console.log('3. Verifique a acessibilidade das cores');
    
  } catch (error) {
    console.error('❌ Erro ao atualizar cores:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main();
}

module.exports = { newColors, updateColorsConfig, updateGlobalCSS, updateTailwindConfig }; 