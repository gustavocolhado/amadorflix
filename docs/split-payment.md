# Sistema de Split - PushinPay

Este documento explica como funciona o sistema de split de pagamentos implementado com o PushinPay.

## 📋 Visão Geral

O sistema de split permite dividir automaticamente os valores dos pagamentos PIX entre três contas:
- **37%** para a conta principal (sua conta)
- **31.5%** para a primeira conta de split (conta parceira 1)
- **31.5%** para a segunda conta de split (conta parceira 2)

## ⚙️ Configuração

### Variáveis de Ambiente

Adicione as seguintes variáveis no seu arquivo `.env`:

```env
# PushinPay Configuration
PUSHINPAY_TOKEN=seu_token_aqui
PUSHINPAY_WEBHOOK_URL=https://seu-dominio.com/api/premium/webhook
PUSHINPAY_SPLIT_ACCOUNT_ID=9F64A5B8-47CB-4969-A85C-D380100225F9
PUSHINPAY_SPLIT_ACCOUNT_ID2=9F905070-C4F0-42D7-B399-566226D0808D
```

### Configuração das Contas

1. **Criar conta no PushinPay**: https://app.pushinpay.com.br/register
2. **Solicitar aprovação** da conta principal
3. **Configurar contas de split** com os IDs fornecidos
4. **Configurar webhook** (opcional, mas recomendado)

### Ambientes da API

O sistema automaticamente seleciona a URL da API baseada na variável `NODE_ENV`:

- **Desenvolvimento** (`NODE_ENV=development`): `https://api-sandbox.pushinpay.com.br`
- **Produção** (`NODE_ENV=production`): `https://api.pushinpay.com.br`

⚠️ **Importante**: Para usar o ambiente sandbox, você precisa:
1. Criar uma conta na produção primeiro: https://app.pushinpay.com.br/register
2. Solicitar liberação do ambiente sandbox através do suporte

## 🔧 Como Funciona

### 1. Criação do PIX

Quando um usuário seleciona um plano, o sistema:

1. Calcula automaticamente os valores do split duplo
2. Cria o PIX com as regras de divisão para duas contas
3. Retorna o QR Code para pagamento

### 2. Divisão Automática

Exemplo para um plano de R$ 19,90:

```
Valor Total: R$ 19,90 (1990 centavos)
├── Conta Principal (37%): R$ 7,36
├── Conta de Split 1 (31.5%): R$ 6,27
└── Conta de Split 2 (31.5%): R$ 6,27
```

### 3. Confirmação

Após o pagamento:
- O PushinPay divide automaticamente os valores entre as três contas
- Cada conta recebe sua parte
- O sistema ativa o acesso premium do usuário

## 📊 Estrutura do Código

### Configuração Centralizada

```typescript
// config/pushinpay.ts
export const PUSHINPAY_CONFIG = {
  SPLIT_PERCENTAGE: 0.315,  // 31.5% para primeira conta de split
  SPLIT_PERCENTAGE2: 0.315, // 31.5% para segunda conta de split
  MAIN_PERCENTAGE: 0.37,    // 37% para conta principal
  SPLIT_ACCOUNT_ID: '9F64A5B8-47CB-4969-A85C-D380100225F9',
  SPLIT_ACCOUNT_ID2: '9F905070-C4F0-42D7-B399-566226D0808D'
}
```

### Endpoint de Criação

```typescript
// app/api/premium/create-pix/route.ts
const pushinPayPayload = {
  value: value,
      split_rules: [
      {
        value: splitValue, // 31.5% do valor
        account_id: PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID
      },
      {
        value: splitValue2, // 31.5% do valor
        account_id: PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID2
      }
    ]
}
```

## 🎨 Interface do Usuário

### Componente SplitInfo

O componente `SplitInfo` exibe:
- Valor total do pagamento
- Divisão percentual entre as três contas
- Valores para cada conta
- Aviso sobre responsabilidades

### Integração na Landing Page

```tsx
<SplitInfo 
  totalValue={plan.price} 
  splitPercentage={63} // Total das duas contas de split
  mainPercentage={37}
  showDetails={true}
/>
```

## 🧪 Testes

### Scripts de Teste

Execute os scripts de teste para verificar o funcionamento:

```bash
# Teste do split duplo
node scripts/test-split-duplo.js

# Teste completo do sistema
node scripts/test-split-payment.js

# Teste direto da API PushinPay
node scripts/test-pushinpay-api.js

# Diagnóstico de configuração
node scripts/debug-token.js

# Teste de ambientes
node scripts/test-environments.js
```

### Validações

O sistema valida:
- Valor mínimo (50 centavos)
- Valor máximo (configurável)
- Configuração das duas contas de split
- Token de autenticação
- Soma total dos valores (deve ser igual ao valor original)

## ⚠️ Avisos Importantes

### Responsabilidade Legal

Conforme os Termos de Uso do PushinPay (item 4.10), é obrigatório informar:

> "A PUSHIN PAY atua exclusivamente como processadora de pagamentos e não possui qualquer responsabilidade pela entrega, suporte, conteúdo, qualidade ou cumprimento das obrigações relacionadas aos produtos ou serviços oferecidos pelo vendedor."

### Limitações

- Valor mínimo: 50 centavos
- Valor máximo: conforme limite da conta
- Split + taxa não pode exceder o valor total
- Ambas as contas de split devem estar ativas e aprovadas

## 🔍 Monitoramento

### Logs

O sistema gera logs detalhados:

```javascript
console.log('PIX criado com split duplo:', {
  value: 1990,
  mainValue: 736,
  splitValue1: 627,
  splitValue2: 627,
  splitAccountId1: '9F64A5B8-47CB-4969-A85C-D380100225F9',
  splitAccountId2: '9F905070-C4F0-42D7-B399-566226D0808D'
});
```

### Webhook

Configure o webhook para receber notificações automáticas de:
- Pagamento confirmado
- Pagamento expirado
- Erros de processamento

## 🚀 Deploy

### Produção

1. Configure as variáveis de ambiente (incluindo a segunda conta de split)
2. Verifique se ambas as contas estão aprovadas
3. Teste com valores pequenos primeiro
4. Monitore os logs de transações

### Sandbox

Para ambiente de teste:
1. Cadastre primeiro na produção
2. Solicite liberação do sandbox ao suporte
3. Use tokens de teste

## 🚨 Troubleshooting

### Erro "Token não encontrado"

Se você receber o erro `"Token não encontrado"`:

1. **Execute o diagnóstico**:
   ```bash
   node scripts/debug-token.js
   ```

2. **Configure o arquivo .env**:
   ```bash
   node scripts/setup-env.js
   ```

3. **Verifique se o token está correto**:
   - Acesse: https://app.pushinpay.com.br/
   - Copie o token da sua conta
   - Cole no arquivo `.env` sem aspas

4. **Reinicie o servidor**:
   ```bash
   npm run dev
   ```

### Outros Problemas Comuns

- **Erro 401 Unauthorized**: Token inválido ou expirado
- **Erro 400 Bad Request**: Valor mínimo não atingido (50 centavos)
- **Erro de split**: Uma ou ambas as contas de split não encontradas ou inválidas

## 📞 Suporte

Em caso de problemas:
1. Execute os scripts de diagnóstico
2. Verifique os logs do sistema
3. Consulte a documentação do PushinPay
4. Entre em contato com o suporte técnico

## 🔄 Atualizações

Para modificar as porcentagens do split:

1. Edite `config/pushinpay.ts`
2. Atualize `SPLIT_PERCENTAGE`, `SPLIT_PERCENTAGE2` e `MAIN_PERCENTAGE`
3. Certifique-se de que a soma seja 100%
4. Teste com valores diferentes
5. Deploy em produção

## 🆕 Nova Funcionalidade: Split Duplo

### O que mudou

- **Antes**: 70% principal + 30% split
- **Agora**: 37% principal + 31.5% split 1 + 31.5% split 2

### Como configurar

1. Adicione a nova variável no `.env`:
   ```env
   PUSHINPAY_SPLIT_ACCOUNT_ID2=9F905070-C4F0-42D7-B399-566226D0808D
   ```

2. Execute o teste de validação:
   ```bash
   node scripts/test-split-duplo.js
   ```

3. Verifique se ambas as contas estão ativas no PushinPay

### Benefícios

- **Maior flexibilidade** na distribuição de receitas
- **Suporte a múltiplos parceiros** ou afiliados
- **Melhor controle** sobre as divisões percentuais
- **Logs mais detalhados** para auditoria

---

**Última atualização**: Janeiro 2025
**Versão**: 2.0.0 - Split Duplo 