const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function setupAdmin() {
  try {
    console.log('🔧 Configurando primeiro admin...');

    // Buscar o primeiro usuário
    const firstUser = await prisma.user.findFirst({
      orderBy: { created_at: 'asc' }
    });

    if (!firstUser) {
      console.log('❌ Nenhum usuário encontrado no banco de dados');
      console.log('💡 Crie um usuário primeiro através do registro ou login');
      return;
    }

    // Verificar se já é admin
    if (firstUser.access === 1) {
      console.log('✅ Usuário já é admin:', firstUser.email);
      return;
    }

    // Definir como admin
    await prisma.user.update({
      where: { id: firstUser.id },
      data: { access: 1 }
    });

    console.log('✅ Admin configurado com sucesso!');
    console.log('👤 Usuário:', firstUser.email);
    console.log('🔑 Acesso:', 'Admin (access = 1)');
    console.log('');
    console.log('🌐 Agora você pode acessar: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Erro ao configurar admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupAdmin();
}

module.exports = { setupAdmin }; 