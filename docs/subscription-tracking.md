# Sistema de Rastreamento de Assinaturas

## Visão Geral

O sistema de rastreamento de assinaturas foi implementado para capturar e armazenar informações sobre a origem dos usuários que se tornam assinantes premium. Isso permite analisar a eficácia de diferentes campanhas de marketing e fontes de tráfego.

## URLs de Rastreamento

### Formato Padrão
```
https://vazadex.com/c?source=vzdx-01&campaign=trafficstars
```

### Parâmetros Suportados

| Parâmetro | Descrição | Exemplo |
|-----------|-----------|---------|
| `source` | Fonte principal do tráfego | `vzdx-01`, `trafficstars`, `facebook` |
| `campaign` | Nome da campanha | `trafficstars`, `google`, `facebook-ads` |
| `ref` | Referência alternativa | `vzdx-01` |
| `utm_source` | Fonte UTM | `vzdx-01` |
| `utm_campaign` | Campanha UTM | `trafficstars` |
| `xclickads` | Campanha específica | `vzdx-01` |

### Exemplos de URLs

```javascript
// URLs válidas para rastreamento
'https://vazadex.com/c?source=vzdx-01&campaign=trafficstars'
'https://vazadex.com/c?source=vzdx-02&campaign=facebook'
'https://vazadex.com/c?ref=vzdx-01&utm_campaign=trafficstars'
'https://vazadex.com/c?utm_source=vzdx-01&utm_campaign=trafficstars'
'https://vazadex.com/c?source=trafficstars&campaign=vzdx-01'
```

## Como Funciona

### 1. Captura de Dados na LandingPage

Quando um usuário acessa a LandingPage, o sistema automaticamente captura:

```javascript
// Captura de parâmetros de URL
const urlParams = new URLSearchParams(window.location.search);
const source = urlParams.get('source') || urlParams.get('ref') || urlParams.get('utm_source');
const campaign = urlParams.get('campaign') || urlParams.get('utm_campaign') || urlParams.get('xclickads');

// Dados adicionais capturados
const currentUrl = window.location.href;
const referrer = document.referrer;
const userAgent = navigator.userAgent;
const screenResolution = `${screen.width}x${screen.height}`;
const language = navigator.language;
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
```

### 2. Armazenamento no localStorage

Os dados são persistidos no localStorage durante a sessão:

```javascript
const referralInfo = {
  source: finalSource,
  campaign: finalCampaign,
  referrer: finalReferrer,
  currentUrl: currentUrl,
  timestamp: new Date().toISOString()
};

localStorage.setItem('referralData', JSON.stringify(referralInfo));
```

### 3. Envio para API durante Assinatura

Quando o usuário inicia o processo de assinatura, os dados são enviados para a API:

```javascript
const enhancedReferralData = {
  ...referralInfo,
  planSelected: selectedPlan.id,
  planPrice: selectedPlan.price,
  userAgent: navigator.userAgent,
  screenResolution: `${screen.width}x${screen.height}`,
  language: navigator.language,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  subscriptionTimestamp: new Date().toISOString()
};
```

### 4. Armazenamento no Banco de Dados

#### Tabela `users`
```sql
-- Campos de referência
referralSource    String?  -- Fonte da referência (ex: vzdx-01)
referralCampaign  String?  -- Campanha (ex: trafficstars)
referralReferrer  String?  -- URL completa do referrer
referralTimestamp String?  -- Timestamp da captura
```

#### Tabela `pixPayments`
```sql
-- Metadados JSON
metadata: {
  referralSource: "vzdx-01",
  referralCampaign: "trafficstars",
  referralReferrer: "https://example.com",
  referralTimestamp: "2025-01-15T10:30:00.000Z",
  currentUrl: "https://vazadex.com/c?source=vzdx-01&campaign=trafficstars",
  planSelected: "3months",
  planPrice: 2490,
  userAgent: "Mozilla/5.0...",
  screenResolution: "1920x1080",
  language: "pt-BR",
  timezone: "America/Sao_Paulo",
  subscriptionTimestamp: "2025-01-15T10:35:00.000Z"
}
```

## Logs e Monitoramento

### Logs no Console do Navegador

```javascript
// Log de captura de dados
console.log('📊 Referral data captured for subscription tracking:', {
  source: finalSource,
  campaign: finalCampaign,
  referrer: finalReferrer,
  currentUrl: currentUrl,
  urlParams: Object.fromEntries(urlParams.entries())
});

// Log específico para URLs de assinatura
if (source || campaign) {
  console.log('🎯 Subscription tracking URL detected:', {
    url: currentUrl,
    source: source,
    campaign: campaign,
    fullParams: Object.fromEntries(urlParams.entries())
  });
}
```

### Logs no Servidor

```javascript
// Log na API de criação de PIX
console.log('🎯 Subscription tracking - PIX creation:', {
  email,
  planId,
  value: value / 100,
  referralSource: referralData.source,
  referralCampaign: referralData.campaign,
  referralReferrer: referralData.referrer,
  currentUrl: referralData.currentUrl,
  timestamp: new Date().toISOString()
});
```

## Scripts de Teste

### Teste Geral de Rastreamento
```bash
node scripts/test-subscription-tracking.js
```

### Teste de URLs Específicas
```bash
node scripts/test-specific-urls.js
```

## Análise de Dados

### Consultas Úteis

#### Usuários por Fonte
```sql
SELECT 
  referralSource,
  COUNT(*) as total_users,
  COUNT(CASE WHEN premium = true THEN 1 END) as premium_users,
  ROUND(COUNT(CASE WHEN premium = true THEN 1 END) * 100.0 / COUNT(*), 2) as conversion_rate
FROM users 
WHERE referralSource IS NOT NULL
GROUP BY referralSource
ORDER BY total_users DESC;
```

#### Pagamentos por Campanha
```sql
SELECT 
  metadata->>'referralCampaign' as campaign,
  COUNT(*) as total_payments,
  SUM(amount) as total_revenue,
  AVG(amount) as avg_payment
FROM pixPayments 
WHERE metadata->>'referralCampaign' IS NOT NULL
GROUP BY metadata->>'referralCampaign'
ORDER BY total_revenue DESC;
```

#### URLs Mais Efetivas
```sql
SELECT 
  metadata->>'currentUrl' as url,
  metadata->>'referralSource' as source,
  metadata->>'referralCampaign' as campaign,
  COUNT(*) as conversions
FROM pixPayments 
WHERE metadata->>'currentUrl' IS NOT NULL
GROUP BY metadata->>'currentUrl', metadata->>'referralSource', metadata->>'referralCampaign'
ORDER BY conversions DESC;
```

## Implementação de Novas Fontes

Para adicionar uma nova fonte de rastreamento:

1. **Definir parâmetros na URL:**
   ```
   https://vazadex.com/c?source=nova-fonte&campaign=nova-campanha
   ```

2. **O sistema automaticamente captura e armazena os dados**

3. **Monitorar através dos logs e consultas SQL**

## Troubleshooting

### Problemas Comuns

1. **Dados não estão sendo capturados:**
   - Verificar se a URL tem os parâmetros corretos
   - Verificar logs no console do navegador
   - Verificar se o localStorage está funcionando

2. **Dados não estão sendo salvos no banco:**
   - Verificar logs do servidor
   - Verificar se a API está recebendo os dados
   - Verificar se o banco de dados está acessível

3. **URLs específicas não funcionam:**
   - Verificar se os parâmetros estão no formato correto
   - Verificar se não há caracteres especiais mal codificados
   - Testar com o script de URLs específicas

### Debug

Para debug, use os scripts de teste:

```bash
# Teste geral
node scripts/test-subscription-tracking.js

# Teste específico
node scripts/test-specific-urls.js
```

## Próximos Passos

1. **Implementar dashboard de analytics** para visualizar os dados
2. **Adicionar mais métricas** como tempo de conversão, valor médio por fonte
3. **Implementar alertas** para fontes com baixa conversão
4. **Integrar com ferramentas externas** como Google Analytics, Facebook Pixel
