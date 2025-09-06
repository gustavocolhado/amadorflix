const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testFixedRegistrationFlow() {
  try {
    console.log('🧪 Testando fluxo corrigido de registro...\n');

    const testEmail = `test-fixed-${Date.now()}@example.com`;
    const testPassword = 'senha123456';
    const testPlanId = '1month';
    const testValue = 2990; // R$ 29,90 em centavos

    // Simular dados de referência
    const referralData = {
      source: 'pornocarioca.com',
      campaign: 'xclickads',
      referrer: 'https://pornocarioca.com/alguma-pagina',
      timestamp: new Date().toISOString()
    };

    console.log('📊 Dados de teste:');
    console.log(`Email: ${testEmail}`);
    console.log(`Plano: ${testPlanId}`);
    console.log(`Valor: R$ ${(testValue / 100).toFixed(2)}`);
    console.log(`Referência: ${referralData.source} - ${referralData.campaign}`);
    console.log('');

    // Simular criação de PIX (sem criar usuário)
    console.log('💰 Simulando criação de PIX...');
    
    const testPixId = `test-pix-fixed-${Date.now()}`;
    const testPixPayment = await prisma.pixPayment.create({
      data: {
        pixId: testPixId,
        userId: null, // Usuário ainda não existe
        userEmail: testEmail,
        planId: testPlanId,
        amount: testValue / 100,
        status: 'pending',
        qrCode: 'test-qr-code',
        qrCodeBase64: 'test-qr-base64',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
        metadata: {
          referralSource: referralData.source,
          referralCampaign: referralData.campaign,
          referralReferrer: referralData.referrer,
          referralTimestamp: referralData.timestamp
        }
      }
    });

    console.log(`✅ PIX criado: ${testPixPayment.id}`);
    console.log(`   - userId: ${testPixPayment.userId || 'null (usuário não existe ainda)'}`);
    console.log('');

    // Verificar se usuário existe (não deve existir)
    const userBeforeRegistration = await prisma.user.findUnique({
      where: { email: testEmail }
    });

    console.log('👤 Verificação antes do registro:');
    console.log(`   - Usuário existe: ${userBeforeRegistration ? 'SIM' : 'NÃO'}`);
    console.log('');

    // Simular registro de usuário (criação de senha)
    console.log('🔐 Simulando criação de senha/registro...');
    
    // Simular chamada para /api/auth/register
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(testPassword, 12);
    
    const newUser = await prisma.user.create({
      data: {
        email: testEmail,
        password: hashedPassword,
        name: testEmail.split('@')[0],
        signupSource: 'website',
        premium: true, // Será premium porque tem planId e pixId
        emailVerified: new Date(),
        referralSource: referralData.source,
        referralCampaign: referralData.campaign,
        referralReferrer: referralData.referrer,
        referralTimestamp: referralData.timestamp,
      }
    });

    console.log(`✅ Usuário criado: ${newUser.id}`);
    console.log(`   - Premium: ${newUser.premium}`);
    console.log(`   - Referência: ${newUser.referralSource} - ${newUser.referralCampaign}`);
    console.log('');

    // Atualizar PIX com o userId
    console.log('🔗 Vinculando PIX ao usuário...');
    
    await prisma.pixPayment.update({
      where: { pixId: testPixId },
      data: {
        userId: newUser.id,
        status: 'paid',
        paidAt: new Date()
      }
    });

    console.log('✅ PIX vinculado e marcado como pago!');
    console.log('');

    // Verificar dados finais
    console.log('🔍 Verificação final...\n');

    const finalUser = await prisma.user.findUnique({
      where: { id: newUser.id },
      select: {
        id: true,
        email: true,
        premium: true,
        referralSource: true,
        referralCampaign: true,
        referralReferrer: true,
        referralTimestamp: true,
        created_at: true
      }
    });

    const finalPix = await prisma.pixPayment.findUnique({
      where: { pixId: testPixId },
      select: {
        id: true,
        userId: true,
        userEmail: true,
        status: true,
        metadata: true,
        paidAt: true
      }
    });

    console.log('👤 Usuário final:');
    console.log(`   - ID: ${finalUser.id}`);
    console.log(`   - Email: ${finalUser.email}`);
    console.log(`   - Premium: ${finalUser.premium}`);
    console.log(`   - Source: ${finalUser.referralSource}`);
    console.log(`   - Campaign: ${finalUser.referralCampaign}`);
    console.log(`   - Criado em: ${finalUser.created_at}`);
    console.log('');

    console.log('💰 PIX final:');
    console.log(`   - ID: ${finalPix.id}`);
    console.log(`   - userId: ${finalPix.userId}`);
    console.log(`   - Status: ${finalPix.status}`);
    console.log(`   - Pago em: ${finalPix.paidAt}`);
    console.log(`   - Metadata: ${JSON.stringify(finalPix.metadata, null, 2)}`);
    console.log('');

    // Verificar se tudo está correto
    const isCorrect = 
      finalUser.premium === true &&
      finalUser.referralSource === referralData.source &&
      finalPix.userId === finalUser.id &&
      finalPix.status === 'paid';

    console.log(`✅ Teste ${isCorrect ? 'PASSOU' : 'FALHOU'}:`);
    console.log(`   - Usuário premium: ${finalUser.premium ? '✅' : '❌'}`);
    console.log(`   - Referência salva: ${finalUser.referralSource === referralData.source ? '✅' : '❌'}`);
    console.log(`   - PIX vinculado: ${finalPix.userId === finalUser.id ? '✅' : '❌'}`);
    console.log(`   - PIX pago: ${finalPix.status === 'paid' ? '✅' : '❌'}`);

    // Limpar dados de teste
    console.log('\n🧹 Limpando dados de teste...');
    await prisma.pixPayment.delete({ where: { pixId: testPixId } });
    await prisma.user.delete({ where: { id: newUser.id } });
    console.log('✅ Dados de teste removidos!');

  } catch (error) {
    console.error('❌ Erro ao testar fluxo corrigido:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFixedRegistrationFlow(); 