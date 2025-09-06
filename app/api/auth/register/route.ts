import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { prisma } from '@/lib/prisma'



export async function POST(request: NextRequest) {
  try {
    const { email, password, name, source = 'website', planId, pixId, referralData } = await request.json()

    // Validação básica
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Se não tiver nome, usar email como nome
    const userName = name || email.split('@')[0]

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      // Se o usuário já existe, atualizar com a senha e dados de referência
      const hashedPassword = await bcrypt.hash(password, 12)
      const isPremium = planId && pixId ? true : false

      const updatedUser = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          name: userName,
          premium: isPremium,
          emailVerified: new Date(),
          // Atualizar dados de referência se não existirem
          referralSource: existingUser.referralSource || referralData?.source || 'direct',
          referralCampaign: existingUser.referralCampaign || referralData?.campaign || 'organic',
          referralReferrer: existingUser.referralReferrer || referralData?.referrer || 'direct',
          referralTimestamp: existingUser.referralTimestamp || referralData?.timestamp || new Date().toISOString(),
        }
      })

      // Se há PIX ID, atualizar o pagamento
      if (isPremium && planId && pixId) {
        try {
          await prisma.pixPayment.update({
            where: { pixId: pixId },
            data: {
              userId: updatedUser.id,
              status: 'paid',
              paidAt: new Date()
            }
          })
        } catch (error) {
          console.error('Erro ao atualizar PixPayment:', error)
        }
      }

      return NextResponse.json(
        { 
          message: 'Conta atualizada com sucesso',
          user: {
            id: updatedUser.id,
            email: updatedUser.email,
            name: updatedUser.name,
            premium: updatedUser.premium
          }
        },
        { status: 200 }
      )
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12)

    // Determinar se é premium baseado no plano
    const isPremium = planId && pixId ? true : false

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: userName,
        signupSource: source,
        premium: isPremium,
        emailVerified: new Date(),
        // Salvar dados de referência
        referralSource: referralData?.source || 'direct',
        referralCampaign: referralData?.campaign || 'organic',
        referralReferrer: referralData?.referrer || 'direct',
        referralTimestamp: referralData?.timestamp || new Date().toISOString(),
      }
    })

    // Se for premium, atualizar o PixPayment com o userId
    if (isPremium && planId && pixId) {
      try {
        await prisma.pixPayment.update({
          where: { pixId: pixId },
          data: {
            userId: user.id,
            status: 'paid',
            paidAt: new Date()
          }
        })
      } catch (error) {
        console.error('Erro ao atualizar PixPayment:', error)
        // Não falhar se não conseguir atualizar
      }
    }

    return NextResponse.json(
      { 
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          premium: user.premium
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
} 