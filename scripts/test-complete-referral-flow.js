const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCompleteReferralFlow() {
  try {
    console.log('🧪 Testando fluxo completo de referência...\n');

    // Simular dados de referência
    const referralData = {
      source: 'pornocarioca.com',
      campaign: 'xclickads',
      referrer: 'https://pornocarioca.com/alguma-pagina',
      timestamp: new Date().toISOString()
    };

    console.log('📊 Dados de referência simulados:');
    console.log(JSON.stringify(referralData, null, 2));
    console.log('');

    // Simular criação de PIX com dados de referência
    const testEmail = `test-referral-${Date.now()}@example.com`;
    const testPlanId = '1month';
    const testValue = 2990; // R$ 29,90 em centavos

    console.log('💰 Simulando criação de PIX...');
    console.log(`Email: ${testEmail}`);
    console.log(`Plano: ${testPlanId}`);
    console.log(`Valor: R$ ${(testValue / 100).toFixed(2)}`);

    // Criar usuário de teste
    const testUser = await prisma.user.create({
      data: {
        email: testEmail,
        name: testEmail.split('@')[0],
        password: 'hashedpassword123',
        premium: false,
        paymentStatus: 'pending',
        paymentType: 'pix',
        // Dados de referência
        referralSource: referralData.source,
        referralCampaign: referralData.campaign,
        referralReferrer: referralData.referrer,
        referralTimestamp: referralData.timestamp
      }
    });

    console.log(`✅ Usuário criado: ${testUser.id}`);

    // Criar PIX de teste com metadados
    const testPixId = `test-pix-${Date.now()}`;
    const testPixPayment = await prisma.pixPayment.create({
      data: {
        pixId: testPixId,
        userId: testUser.id,
        userEmail: testEmail,
        planId: testPlanId,
        amount: testValue / 100,
        status: 'pending',
        qrCode: 'test-qr-code',
        qrCodeBase64: 'test-qr-base64',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        // Metadados de referência
        metadata: {
          referralSource: referralData.source,
          referralCampaign: referralData.campaign,
          referralReferrer: referralData.referrer,
          referralTimestamp: referralData.timestamp
        }
      }
    });

    console.log(`✅ PIX criado: ${testPixPayment.id}`);
    console.log('');

    // Verificar se os dados foram salvos corretamente
    console.log('🔍 Verificando dados salvos...\n');

    // Verificar usuário
    const savedUser = await prisma.user.findUnique({
      where: { id: testUser.id },
      select: {
        id: true,
        email: true,
        referralSource: true,
        referralCampaign: true,
        referralReferrer: true,
        referralTimestamp: true,
        created_at: true
      }
    });

    console.log('👤 Dados do usuário:');
    console.log(`  - ID: ${savedUser.id}`);
    console.log(`  - Email: ${savedUser.email}`);
    console.log(`  - Source: ${savedUser.referralSource}`);
    console.log(`  - Campaign: ${savedUser.referralCampaign}`);
    console.log(`  - Referrer: ${savedUser.referralReferrer}`);
    console.log(`  - Timestamp: ${savedUser.referralTimestamp}`);
    console.log(`  - Criado em: ${savedUser.created_at}`);
    console.log('');

    // Verificar PIX
    const savedPix = await prisma.pixPayment.findUnique({
      where: { id: testPixPayment.id },
      select: {
        id: true,
        userEmail: true,
        metadata: true,
        createdAt: true
      }
    });

    console.log('💰 Dados do PIX:');
    console.log(`  - ID: ${savedPix.id}`);
    console.log(`  - Email: ${savedPix.userEmail}`);
    console.log(`  - Metadata: ${JSON.stringify(savedPix.metadata, null, 2)}`);
    console.log(`  - Criado em: ${savedPix.createdAt}`);
    console.log('');

    // Simular confirmação de pagamento
    console.log('✅ Simulando confirmação de pagamento...');
    
    await prisma.pixPayment.update({
      where: { id: testPixPayment.id },
      data: {
        status: 'paid',
        paidAt: new Date()
      }
    });

    await prisma.user.update({
      where: { id: testUser.id },
      data: {
        premium: true,
        paymentStatus: 'paid',
        paymentDate: new Date()
      }
    });

    console.log('✅ Pagamento confirmado e usuário ativado!');
    console.log('');

    // Verificar estatísticas finais
    console.log('📊 Estatísticas finais:');
    
    const totalUsers = await prisma.user.count();
    const usersWithReferralCount = await prisma.user.count({
      where: {
        referralSource: { not: null }
      }
    });
    
    const totalPixPayments = await prisma.pixPayment.count();
    const pixPaymentsWithMetadataCount = await prisma.pixPayment.count({
      where: {
        metadata: { not: null }
      }
    });

    console.log(`   - Total de usuários: ${totalUsers}`);
    console.log(`   - Usuários com referência: ${usersWithReferralCount} (${((usersWithReferralCount/totalUsers)*100).toFixed(1)}%)`);
    console.log(`   - Total de pagamentos PIX: ${totalPixPayments}`);
    console.log(`   - PIX com metadados: ${pixPaymentsWithMetadataCount} (${((pixPaymentsWithMetadataCount/totalPixPayments)*100).toFixed(1)}%)`);

    // Limpar dados de teste
    console.log('\n🧹 Limpando dados de teste...');
    await prisma.pixPayment.delete({ where: { id: testPixPayment.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Dados de teste removidos!');

  } catch (error) {
    console.error('❌ Erro ao testar fluxo completo:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCompleteReferralFlow(); 