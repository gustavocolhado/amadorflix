# Sistema Premium - Documentação

## Visão Geral

O sistema premium permite que usuários assinem planos pagos para acessar conteúdo exclusivo. O sistema suporta dois métodos de pagamento:

- **PIX** (Mercado Pago) - Pagamento instantâneo
- **Cartão de Crédito** (Stripe) - Pagamento com cartão

## Estrutura de Arquivos

```
app/premium/
├── page.tsx              # Página principal de assinatura
├── success/
│   └── page.tsx          # Página de sucesso
├── cancel/
│   └── page.tsx          # Página de cancelamento
└── pending/
    └── page.tsx          # Página de pagamento pendente

app/api/premium/
├── create-subscription/
│   └── route.ts          # Criar assinatura (Stripe/Mercado Pago)
├── create-pix/
│   └── route.ts          # Gerar PIX
├── check-payment-status/
│   └── route.ts          # Verificar status do pagamento
└── verify-subscription/
    └── route.ts          # Verificar assinatura

components/
├── PremiumBanner.tsx     # Banner promocional
└── PixPayment.tsx        # Componente de pagamento PIX
```

## Configuração

### Variáveis de Ambiente

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_YEARLY_PRICE_ID=price_...

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN=TEST-...
MERCADO_PAGO_PUBLIC_KEY=TEST-...

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3000
HOST_URL=http://localhost:3000
```

### Configuração do Stripe

1. Crie uma conta no [Stripe](https://stripe.com)
2. Obtenha as chaves de API (teste e produção)
3. Crie os produtos e preços no dashboard do Stripe
4. Configure os webhooks para receber notificações

### Configuração do Mercado Pago

1. Crie uma conta no [Mercado Pago](https://mercadopago.com.br)
2. Obtenha o Access Token
3. Configure as URLs de retorno e webhook

## Fluxo de Pagamento

### 1. Página Principal (`/premium`)

- Usuário seleciona um plano (mensal ou anual)
- Escolhe método de pagamento (PIX ou cartão)
- Sistema cria assinatura via API

### 2. Pagamento PIX

1. Usuário clica em "Continuar com PIX"
2. Sistema chama `/api/premium/create-subscription` com `paymentMethod: 'mercadopago'`
3. API cria preferência no Mercado Pago
4. Sistema chama `/api/premium/create-pix` para gerar QR Code
5. Usuário escaneia QR Code ou copia código PIX
6. Sistema verifica status automaticamente a cada 5 segundos
7. Quando aprovado, redireciona para `/premium/success`

### 3. Pagamento com Cartão

1. Usuário clica em "Continuar com Cartão"
2. Sistema chama `/api/premium/create-subscription` com `paymentMethod: 'stripe'`
3. API cria sessão de checkout no Stripe
4. Usuário é redirecionado para checkout do Stripe
5. Após pagamento, Stripe redireciona para `/premium/success`

## Componentes

### PremiumBanner

Banner promocional com três variantes:

```tsx
// Banner padrão
<PremiumBanner />

// Banner compacto
<PremiumBanner variant="compact" />

// Banner hero (grande)
<PremiumBanner variant="hero" />
```

### PixPayment

Componente para pagamento PIX:

```tsx
<PixPayment
  preferenceId="preference_id"
  onSuccess={() => router.push('/premium/success')}
  onCancel={() => setPreferenceId(null)}
/>
```

## APIs

### POST `/api/premium/create-subscription`

Cria uma assinatura no Stripe ou Mercado Pago.

**Request:**
```json
{
  "planId": "monthly",
  "paymentMethod": "stripe",
  "stripePriceId": "price_123",
  "mercadoPagoId": "premium_monthly"
}
```

**Response (Stripe):**
```json
{
  "checkoutUrl": "https://checkout.stripe.com/...",
  "sessionId": "cs_123"
}
```

**Response (Mercado Pago):**
```json
{
  "initPoint": "https://www.mercadopago.com.br/...",
  "preferenceId": "123456789"
}
```

### POST `/api/premium/create-pix`

Gera dados do PIX para pagamento.

**Request:**
```json
{
  "preferenceId": "123456789"
}
```

**Response:**
```json
{
  "qr_code": "00020126580014br.gov.bcb.pix0136...",
  "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAA...",
  "expires_at": "2024-01-01T12:00:00.000Z",
  "payment_id": "123456789"
}
```

### POST `/api/premium/check-payment-status`

Verifica o status de um pagamento.

**Request:**
```json
{
  "preferenceId": "123456789"
}
```

**Response:**
```json
{
  "status": "approved",
  "payment_id": "123456789"
}
```

## Páginas de Status

### Sucesso (`/premium/success`)

- Exibe confirmação de pagamento aprovado
- Mostra benefícios do plano premium
- Botões para começar a usar o conteúdo
- Auto-redirecionamento em 5 segundos

### Cancelamento (`/premium/cancel`)

- Explica por que o pagamento foi cancelado
- Oferece opções para tentar novamente
- Links para suporte e ajuda

### Pendente (`/premium/pending`)

- Informa que pagamento está sendo processado
- Explica próximos passos
- Oferece suporte para dúvidas

## Integração com Banco de Dados

### Tabela de Assinaturas

```sql
CREATE TABLE subscriptions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  plan_id VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  stripe_subscription_id VARCHAR(255),
  mercado_pago_preference_id VARCHAR(255)
);
```

### Tabela de Pagamentos

```sql
CREATE TABLE payments (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  subscription_id VARCHAR(255),
  amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  stripe_payment_intent_id VARCHAR(255),
  mercado_pago_payment_id VARCHAR(255)
);
```

## Webhooks

### Stripe Webhook

```typescript
// app/api/stripe/webhook/route.ts
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
    
    switch (event.type) {
      case 'checkout.session.completed':
        // Atualizar status da assinatura
        break
      case 'invoice.payment_succeeded':
        // Renovação de assinatura
        break
      case 'customer.subscription.deleted':
        // Cancelamento de assinatura
        break
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

### Mercado Pago Webhook

```typescript
// app/api/mercado-pago/webhook/route.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    if (body.type === 'payment') {
      const paymentId = body.data.id
      const payment = await mercadopago.payment.get({ id: paymentId })
      
      if (payment.status === 'approved') {
        // Atualizar status da assinatura
      }
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}
```

## Segurança

### Autenticação

- Todas as APIs requerem autenticação via NextAuth
- Verificação de sessão em todas as rotas protegidas
- Validação de dados de entrada

### Validação

- Verificação de valores e tipos de dados
- Sanitização de inputs
- Validação de IDs de pagamento

### Rate Limiting

- Implementar rate limiting nas APIs
- Proteção contra spam e ataques
- Monitoramento de tentativas de pagamento

## Testes

### Testes de Pagamento

```bash
# Testar PIX
npm run test:pix

# Testar Stripe
npm run test:stripe

# Testar webhooks
npm run test:webhooks
```

### Dados de Teste

**Stripe:**
- Número: 4242 4242 4242 4242
- CVC: Qualquer 3 dígitos
- Data: Qualquer data futura

**Mercado Pago:**
- Usar conta de teste
- PIX de teste disponível no sandbox

## Monitoramento

### Logs

- Log de todas as transações
- Erros de pagamento
- Tentativas de fraude

### Métricas

- Taxa de conversão
- Tempo médio de pagamento
- Taxa de sucesso por método

## Suporte

### Problemas Comuns

1. **PIX não gera QR Code**
   - Verificar configuração do Mercado Pago
   - Validar Access Token

2. **Stripe não redireciona**
   - Verificar URLs de sucesso/cancelamento
   - Validar chaves de API

3. **Webhook não funciona**
   - Verificar URL do webhook
   - Validar assinatura (Stripe)

### Contato

- Email: suporte@exemplo.com
- WhatsApp: (11) 99999-9999
- Documentação: /docs/premium-integration.md 