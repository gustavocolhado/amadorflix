import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import Stripe from 'stripe'
import { MercadoPagoConfig, Preference } from 'mercadopago'

// Configuração do Stripe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-10-28.acacia',
    })
  : null

// Configuração do Mercado Pago
const mercadopago = process.env.MERCADO_PAGO_ACCESS_TOKEN
  ? new MercadoPagoConfig({
      accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
    })
  : null

interface CreateSubscriptionRequest {
  planId: string
  paymentMethod: 'stripe' | 'mercadopago'
  stripePriceId?: string
  mercadoPagoId?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Usuário não autenticado' },
        { status: 401 }
      )
    }

    const body: CreateSubscriptionRequest = await request.json()
    const { planId, paymentMethod, stripePriceId, mercadoPagoId } = body

    // Validar dados
    if (!planId || !paymentMethod) {
      return NextResponse.json(
        { error: 'Dados inválidos' },
        { status: 400 }
      )
    }

    // Obter dados do usuário autenticado
    const userId = session.user.id || session.user.email || 'unknown'
    const userEmail = session.user.email || 'user@example.com'

    if (paymentMethod === 'stripe') {
      return await handleStripeSubscription(planId, stripePriceId, userEmail, userId)
    } else {
      return await handleMercadoPagoSubscription(planId, mercadoPagoId, userEmail, userId)
    }
  } catch (error) {
    console.error('Erro ao criar assinatura:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function handleStripeSubscription(
  planId: string,
  stripePriceId: string | undefined,
  userEmail: string,
  userId: string
) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe não está configurado' },
        { status: 500 }
      )
    }

    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'ID do preço Stripe não fornecido' },
        { status: 400 }
      )
    }

    // Criar sessão de checkout do Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/cancel`,
      customer_email: userEmail,
      metadata: {
        userId,
        planId,
      },
    })

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    })
  } catch (error) {
    console.error('Erro ao criar sessão Stripe:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento com Stripe' },
      { status: 500 }
    )
  }
}

async function handleMercadoPagoSubscription(
  planId: string,
  mercadoPagoId: string | undefined,
  userEmail: string,
  userId: string
) {
  try {
    if (!mercadopago) {
      return NextResponse.json(
        { error: 'Mercado Pago não está configurado' },
        { status: 500 }
      )
    }

    // Criar preferência de pagamento do Mercado Pago
    const preference = {
      items: [
        {
          id: `premium_${planId}`,
          title: `Assinatura Premium - ${planId}`,
          unit_price: planId === 'monthly' ? 19.90 : 199.90,
          quantity: 1,
          currency_id: 'BRL',
        },
      ],
      payer: {
        email: userEmail,
      },
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/success`,
        failure: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/cancel`,
        pending: `${process.env.NEXT_PUBLIC_BASE_URL}/premium/pending`,
      },
      auto_return: 'approved',
      external_reference: `${userId}_${planId}`,
      notification_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/mercado-pago/webhook`,
      expires: true,
      expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutos
    }

    const preferenceClient = new Preference(mercadopago)
    const response = await preferenceClient.create({ body: preference })

    return NextResponse.json({
      initPoint: response.init_point,
      preferenceId: response.id,
    })
  } catch (error) {
    console.error('Erro ao criar preferência Mercado Pago:', error)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento com Mercado Pago' },
      { status: 500 }
    )
  }
} 