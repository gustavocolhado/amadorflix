# Microsoft Clarity Integration

## 📊 Visão Geral

O Microsoft Clarity está integrado diretamente no layout da aplicação usando o script oficial da Microsoft. Esta implementação é mais simples e eficiente que usar o pacote NPM.

## 🔧 Implementação

### Script no Layout

O script do Clarity está incluído diretamente no `app/layout.tsx`:

```tsx
<script
  type="text/javascript"
  dangerouslySetInnerHTML={{
    __html: `
      (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "sq66elyfz4");
    `
  }}
/>
```

### Project ID

- **Project ID**: `sq66elyfz4`
- **Dashboard**: https://clarity.microsoft.com/

## 📈 Funcionalidades

### Recursos Automáticos
- ✅ **Session Replays**: Gravação automática de sessões
- ✅ **Heatmaps**: Mapas de calor de cliques e scroll
- ✅ **Insights**: Análises automáticas de comportamento
- ✅ **Clarity Copilot**: IA para insights inteligentes

### APIs Disponíveis

Após o carregamento, você pode usar as APIs do Clarity diretamente:

```javascript
// Identificar usuário
clarity.identify("user-id", "session-id", "page-id", "friendly-name");

// Definir tags personalizadas
clarity.setTag("key", "value");

// Rastrear eventos
clarity.event("event-name");

// Definir consentimento de cookies
clarity.consent(true);

// Priorizar sessão
clarity.upgrade("reason");
```

## 🎯 Exemplos de Uso

### Rastrear Seleção de Plano
```javascript
if (typeof window !== 'undefined' && window.clarity) {
  window.clarity.event('plan_selected');
  window.clarity.setTag('plan_id', planId);
  window.clarity.setTag('plan_price', planPrice);
}
```

### Rastrear Login
```javascript
if (typeof window !== 'undefined' && window.clarity) {
  window.clarity.identify(userId, undefined, undefined, email);
  window.clarity.event('user_login');
}
```

### Rastrear Visualização de Vídeo
```javascript
if (typeof window !== 'undefined' && window.clarity) {
  window.clarity.event('video_viewed');
  window.clarity.setTag('video_id', videoId);
  window.clarity.setTag('video_title', videoTitle);
}
```

## 🔍 Verificação

### Console do Navegador
Abra o console do navegador e digite:
```javascript
clarity
```
Se retornar uma função, o Clarity está funcionando.

### Dashboard
1. Acesse https://clarity.microsoft.com/
2. Faça login com sua conta Microsoft
3. Selecione o projeto "Vazadex"
4. Verifique os dados em tempo real

## 📊 Benefícios

- **Simplicidade**: Implementação direta sem dependências
- **Performance**: Carregamento assíncrono
- **Confiabilidade**: Script oficial da Microsoft
- **Funcionalidades**: Todas as features do Clarity disponíveis
- **Privacidade**: Conformidade com LGPD/GDPR

## 🚀 Próximos Passos

1. **Monitoramento**: Acompanhe os dados no dashboard
2. **Insights**: Use o Clarity Copilot para análises
3. **Otimização**: Ajuste a experiência baseado nos dados
4. **Eventos**: Implemente tracking de eventos específicos conforme necessário

## 📝 Notas

- O script carrega automaticamente em todas as páginas
- Os dados começam a aparecer no dashboard após algumas horas
- O Clarity respeita as configurações de privacidade do navegador
- Não há necessidade de configuração adicional 