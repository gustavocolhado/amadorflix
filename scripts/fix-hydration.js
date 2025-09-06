const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Iniciando correção de problemas de hidratação...');

// Função para executar comandos
function runCommand(command) {
  try {
    console.log(`Executando: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Erro ao executar: ${command}`);
    return false;
  }
}

// Função para remover diretórios
function removeDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    console.log(`Removendo: ${dirPath}`);
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

// Limpar cache e arquivos temporários
console.log('\n🧹 Limpando cache...');
removeDirectory('.next');
removeDirectory('node_modules/.cache');

// Reinstalar dependências se necessário
console.log('\n📦 Verificando dependências...');
if (!fs.existsSync('node_modules')) {
  console.log('Instalando dependências...');
  runCommand('npm install');
}

// Limpar cache do npm
console.log('\n🧹 Limpando cache do npm...');
runCommand('npm cache clean --force');

// Gerar tipos do Prisma se necessário
if (fs.existsSync('prisma/schema.prisma')) {
  console.log('\n🗄️ Gerando tipos do Prisma...');
  runCommand('npx prisma generate');
}

console.log('\n✅ Correção concluída!');
console.log('\n🚀 Para iniciar o servidor de desenvolvimento:');
console.log('npm run dev');

