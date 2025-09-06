# Consulta de Status do PIX - PushinPay

## 📋 Endpoint de Consulta

### URL Base
```
GET https://api.pushinpay.com.br/api/transactions/{ID}
```

### Headers Obrigatórios
```http
Authorization: Bearer {TOKEN}
Accept: application/json
Content-Type: application/json
```

### Parâmetros
- **ID** (path parameter): ID único do PIX gerado

## 🔄 Respostas

### 200 OK - PIX Encontrado
```json
{
  "id": "9f8efc3a-4b9b-490f-9c76-e98512654ec9",
  "qr_code": "00020101021226770014BR.GOV.BCB.PIX2555api...",
  "status": "paid",
  "value": 100,
  "webhook_url": "https://your-domain.com/api/premium/webhook",
  "qr_code_base64": "data:image/png;base64,iVBORw0KGgoAA...",
  "webhook": null,
  "split_rules": [
    {
      "value": 30,
      "account_id": "9F64A5B8-47CB-4969-A85C-D380100225F9"
    }
  ],
  "end_to_end_id": "E12345678202301011234567890123456",
  "payer_name": "João Silva",
  "payer_national_registration": "12345678901"
}
```

### 404 Not Found - PIX Não Encontrado
```json
{
  "error": "PIX não encontrado",
  "status": "not_found"
}
```

## ⚠️ Pontos de Atenção

### 1. Limite de Consultas
- **Recomendação**: Consultar apenas quando o cliente final identificar que foi pago
- **Limite**: Máximo 1 consulta por minuto
- **Risco**: Conta pode ser bloqueada se exceder o limite

### 2. Status Possíveis
- `created`: PIX criado, aguardando pagamento
- `paid`: PIX pago com sucesso
- `expired`: PIX expirado (15 minutos)

### 3. Dados Retornados
- **Sempre retornados**: `id`, `status`, `value`
- **Após pagamento**: `end_to_end_id`, `payer_name`, `payer_national_registration`
- **Split**: `split_rules` (se configurado)

## 🧪 Teste da Consulta

### Script de Teste
```bash
node scripts/test-pix-status.js
```

### Exemplo de Uso
```javascript
const { checkPixStatus } = require('./scripts/test-pix-status.js');

// Consultar status de um PIX
const result = await checkPixStatus('9f8efc3a-4b9b-490f-9c76-e98512654ec9');

if (result.found) {
  console.log('Status:', result.data.status);
  console.log('Pago:', result.data.status === 'paid');
} else {
  console.log('PIX não encontrado');
}
```

## 🔧 Implementação no Sistema

### Endpoint da API
```typescript
// app/api/premium/check-payment-status/route.ts
export async function POST(request: NextRequest) {
  const { pixId } = await request.json();
  
  // URL correta para consulta
  const baseUrl = PUSHINPAY_CONFIG.API_URL.replace('/api/pix/cashIn', '/api/pix');
  const statusUrl = `${baseUrl}/${pixId}`;
  
  const response = await fetch(statusUrl, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${PUSHINPAY_CONFIG.TOKEN}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return NextResponse.json(
      { error: 'PIX não encontrado', status: 'not_found' },
      { status: 404 }
    );
  }

  const pixData = await response.json();
  return NextResponse.json(pixData);
}
```

## 🚀 Fluxo de Uso

### Fluxo Principal (Webhook)
1. **Criar PIX**: Usar endpoint `/api/premium/create-pix`
2. **Aguardar pagamento**: Cliente paga o PIX
3. **Webhook automático**: PushinPay notifica via `/api/premium/webhook`
4. **Ativar premium**: Sistema ativa automaticamente

### Fluxo Manual (Botão "Já fiz o pagamento")
1. **Criar PIX**: Usar endpoint `/api/premium/create-pix`
2. **Cliente paga**: Usuário realiza o pagamento
3. **Cliente clica**: Botão "Já fiz o pagamento"
4. **Consultar status**: Endpoint `/api/premium/check-payment-status`
5. **Ativar premium**: Se status = 'paid', ativar acesso premium

## 📊 Monitoramento

### Logs Importantes
```javascript
console.log('Consultando status do PIX:', {
  pixId,
  url: statusUrl
});

console.log(`Status da resposta: ${response.status} ${response.statusText}`);

if (pixData.status === 'paid') {
  console.log('Pagamento confirmado:', {
    pixId: pixData.id,
    endToEndId: pixData.end_to_end_id,
    payerName: pixData.payer_name
  });
}
```

### Tratamento de Erros
- **404**: PIX não encontrado (normal para PIXs expirados)
- **401**: Token inválido
- **429**: Muitas requisições (respeitar limite de 1/min)
- **500**: Erro interno do servidor

## ✅ Checklist de Implementação

- [x] URL correta para consulta (`/api/pix/{ID}`)
- [x] Headers obrigatórios configurados
- [x] Tratamento de erro 404
- [x] Logs para monitoramento
- [x] Ativação automática do premium
- [x] Script de teste criado
- [x] Documentação completa 