# Sistema de Email - AmadorFlix

## 📧 Visão Geral

O sistema de email foi implementado para enviar automaticamente emails de confirmação após o pagamento ser confirmado via webhook. O email inclui:

- ✅ Confirmação do pagamento
- 📋 Detalhes da assinatura (plano, duração, data de expiração)
- 📱 Links para o canal do Telegram
- 🔑 Instruções de acesso ao canal
- 🚀 Link direto para login no site

## 🛠️ Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env`:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app

# Telegram Configuration
TELEGRAM_CHANNEL=https://t.me/amadorflixvip
TELEGRAM_BOT=https://t.me/amadorflixbot
```

### 2. Configuração do Gmail

Para usar Gmail como provedor SMTP:

1. **Ative a verificação em 2 etapas** na sua conta Google
2. **Gere uma senha de aplicativo**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Aplicativo" e "Outro (nome personalizado)"
   - Digite "AmadorFlix" como nome
   - Copie a senha gerada para `SMTP_PASS`

### 3. Outros Provedores SMTP

O sistema suporta qualquer provedor SMTP. Ajuste as variáveis conforme necessário:

- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Servidor próprio**: Configure conforme sua infraestrutura

## 📁 Arquivos Implementados

### `lib/email.ts`
- Configuração do transporter SMTP
- Template HTML do email
- Função de envio de email
- Função de teste de configuração

### `app/api/premium/webhook/route.ts`
- Integração do envio de email no webhook
- Chamada automática após confirmação de pagamento
- Tratamento de erros (não falha o webhook se email falhar)

### `app/api/test-email/route.ts`
- API para testar configuração SMTP
- Endpoint para enviar email de teste
- Validação de configuração

### Scripts de Teste
- `scripts/test-email-system.js` - Teste completo do sistema
- `scripts/setup-email-config.js` - Verificação de configuração

## 🧪 Testando o Sistema

### 1. Verificar Configuração
```bash
npm run setup:email
```

### 2. Testar Envio de Email
```bash
npm run test:email
```

### 3. Teste via API
```bash
# Verificar configuração
curl http://localhost:3000/api/test-email

# Enviar email de teste
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{"testEmail": "seu-email@exemplo.com"}'
```

## 📧 Template do Email

O email inclui:

### Cabeçalho
- Logo do AmadorFlix
- Título de confirmação

### Informações da Assinatura
- Nome do usuário
- Plano contratado
- Duração
- Data de expiração
- Email de cadastro

### Seção do Telegram
- Links para canal e bot
- Instruções de acesso
- Processo passo a passo

### Rodapé
- Link para login no site
- Informações de contato
- Aviso de email automático

## 🔄 Fluxo de Funcionamento

1. **Pagamento Confirmado** → Webhook recebe confirmação
2. **Ativação Premium** → Usuário é marcado como premium
3. **Envio de Email** → Email é enviado automaticamente
4. **Log de Sucesso** → Sistema registra o envio

## 🛡️ Tratamento de Erros

- **Falha no Email**: Não impede a ativação do premium
- **Configuração Inválida**: Logs detalhados para debug
- **Timeout**: Configuração padrão do Nodemailer
- **Retry**: Não implementado (pode ser adicionado futuramente)

## 📊 Monitoramento

### Logs Importantes
- `Email de confirmação enviado com sucesso`
- `Falha ao enviar email de confirmação`
- `Configuração SMTP verificada com sucesso`

### Métricas Sugeridas
- Taxa de sucesso de envio
- Tempo de entrega
- Emails rejeitados

## 🚀 Melhorias Futuras

- [ ] Sistema de retry para emails falhados
- [ ] Templates personalizáveis
- [ ] Múltiplos provedores SMTP
- [ ] Analytics de abertura de email
- [ ] Sistema de filas para envio em massa
- [ ] Templates responsivos aprimorados

## 🔧 Troubleshooting

### Email não enviado
1. Verifique as variáveis de ambiente
2. Teste a configuração SMTP
3. Verifique logs do servidor
4. Confirme se o email de destino é válido

### Erro de autenticação
1. Verifique se a senha de app está correta
2. Confirme se a verificação em 2 etapas está ativa
3. Teste com credenciais diferentes

### Email na caixa de spam
1. Configure SPF/DKIM no domínio
2. Use um domínio próprio para envio
3. Adicione o remetente à lista de contatos

## 📞 Suporte

Para problemas com o sistema de email:
1. Verifique os logs do servidor
2. Execute os scripts de teste
3. Confirme a configuração SMTP
4. Teste com diferentes provedores se necessário


