const fs = require('fs');
const path = require('path');

console.log('🔧 Configurando arquivo .env para PushinPay...\n');

const envPath = path.join(__dirname, '..', '.env');
const envExamplePath = path.join(__dirname, '..', 'env.example');

// Verificar se .env já existe
if (fs.existsSync(envPath)) {
  console.log('📋 Arquivo .env já existe!');
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasPushinPayToken = envContent.includes('PUSHINPAY_TOKEN');
  
  if (hasPushinPayToken) {
    console.log('✅ PUSHINPAY_TOKEN já está configurado');
  } else {
    console.log('❌ PUSHINPAY_TOKEN não encontrado no .env');
    console.log('   Adicione manualmente ao seu arquivo .env:');
    console.log('   PUSHINPAY_TOKEN=seu_token_aqui');
  }
} else {
  console.log('📝 Criando arquivo .env...');
  
  // Ler conteúdo do env.example
  let envContent = '';
  if (fs.existsSync(envExamplePath)) {
    envContent = fs.readFileSync(envExamplePath, 'utf8');
  }
  
  // Adicionar comentário sobre PushinPay
  const pushinPayComment = `
# PushinPay Configuration
# Obtenha seu token em: https://app.pushinpay.com.br/
PUSHINPAY_TOKEN=seu_token_aqui
PUSHINPAY_WEBHOOK_URL=https://seu-dominio.com/api/premium/webhook
PUSHINPAY_SPLIT_ACCOUNT_ID=9F64A5B8-47CB-4969-A85C-D380100225F9
PUSHINPAY_SPLIT_ACCOUNT_ID2=9F905070-C4F0-42D7-B399-566226D0808D

# PushinPay URLs (automatically selected based on NODE_ENV):
# - Development (NODE_ENV=development): https://api-sandbox.pushinpay.com.br
# - Production (NODE_ENV=production): https://api.pushinpay.com.br
`;
  
  // Criar arquivo .env
  fs.writeFileSync(envPath, envContent + pushinPayComment);
  console.log('✅ Arquivo .env criado com sucesso!');
  console.log('📝 Agora edite o arquivo .env e configure seu PUSHINPAY_TOKEN');
}

console.log('\n📋 Próximos passos:');
console.log('   1. Edite o arquivo .env na raiz do projeto');
console.log('   2. Substitua "seu_token_aqui" pelo seu token real do PushinPay');
console.log('   3. Configure a URL do webhook se necessário');
console.log('   4. Reinicie o servidor: npm run dev');
console.log('   5. Teste com: node scripts/debug-token.js');

console.log('\n🔗 Links úteis:');
console.log('   - PushinPay: https://app.pushinpay.com.br/');
console.log('   - Documentação: https://pushinpay.com.br/');
console.log('   - Suporte: Entre em contato com o suporte para liberar sandbox'); 