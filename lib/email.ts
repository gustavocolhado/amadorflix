import nodemailer from 'nodemailer'

// Configuração do transporter de email
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true para 465, false para outras portas
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })
}

// Interface para dados do email de confirmação
export interface PaymentConfirmationEmailData {
  userEmail: string
  userName: string
  userPassword: string
  planName: string
  planDuration: string
  expireDate: string
  telegramChannel: string
  telegramBot: string
  loginUrl: string
}

// Template HTML para o email de confirmação
const createEmailTemplate = (data: PaymentConfirmationEmailData): string => {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pagamento Confirmado - AmadorFlix</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: #ffffff;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #dc2626;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #dc2626;
            margin-bottom: 10px;
        }
        .title {
            color: #059669;
            font-size: 24px;
            margin: 20px 0;
        }
        .info-box {
            background-color: #f8fafc;
            border-left: 4px solid #3b82f6;
            padding: 20px;
            margin: 20px 0;
            border-radius: 5px;
        }
        .info-item {
            margin: 10px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .info-label {
            font-weight: bold;
            color: #374151;
        }
        .info-value {
            color: #6b7280;
        }
        .telegram-section {
            background: linear-gradient(135deg, #0088cc, #229ed9);
            color: white;
            padding: 25px;
            border-radius: 10px;
            margin: 25px 0;
            text-align: center;
        }
        .telegram-title {
            font-size: 20px;
            margin-bottom: 15px;
            font-weight: bold;
        }
        .telegram-link {
            display: inline-block;
            background-color: #ffffff;
            color: #0088cc;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 10px 5px;
            transition: all 0.3s ease;
        }
        .telegram-link:hover {
            background-color: #f0f0f0;
            transform: translateY(-2px);
        }
        .instructions {
            background-color: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .instructions h3 {
            color: #92400e;
            margin-top: 0;
        }
        .instructions ol {
            color: #92400e;
            padding-left: 20px;
        }
        .instructions li {
            margin: 8px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
        }
        .login-button {
            display: inline-block;
            background-color: #dc2626;
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            margin: 20px 0;
            transition: background-color 0.3s ease;
        }
        .login-button:hover {
            background-color: #b91c1c;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🔥 AmadorFlix</div>
            <p>Seu acesso premium foi ativado com sucesso!</p>
        </div>

        <h1 class="title">✅ Pagamento Confirmado!</h1>
        
        <p>Olá <strong>${data.userName}</strong>,</p>
        
        <p>Seu pagamento foi processado com sucesso e seu acesso premium ao AmadorFlix já está ativo!</p>

        <div class="info-box">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Detalhes da Assinatura</h3>
            <div class="info-item">
                <span class="info-label">Plano:</span>
                <span class="info-value">${data.planName}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Duração:</span>
                <span class="info-value">${data.planDuration}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Válido até:</span>
                <span class="info-value">${data.expireDate}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Email:</span>
                <span class="info-value">${data.userEmail}</span>
            </div>
            <div class="info-item">
                <span class="info-label">Senha:</span>
                <span class="info-value"><strong>${data.userPassword}</strong></span>
            </div>
        </div>

        <div class="telegram-section">
            <div class="telegram-title">📱 Acesse Nosso Canal Exclusivo no Telegram</div>
            <p>Além do acesso ao site, você também tem acesso ao nosso canal exclusivo no Telegram com mais de 50.000 mídias!</p>
            
            <a href="${data.telegramChannel}" class="telegram-link" target="_blank">
                📺 Canal Principal
            </a>
            <a href="${data.telegramBot}" class="telegram-link" target="_blank">
                🤖 Bot de Acesso
            </a>
        </div>

        <div class="instructions">
            <h3>🔑 Como acessar o canal do Telegram:</h3>
            <ol>
                <li>Clique no botão "Bot de Acesso" acima</li>
                <li>Envie o comando <code>/start</code> para o bot</li>
                <li>Digite seu email: <strong>${data.userEmail}</strong></li>
                <li>O bot irá verificar seu acesso e liberar o canal</li>
                <li>Pronto! Você terá acesso a todo o conteúdo exclusivo</li>
            </ol>
        </div>

        <div style="text-align: center;">
            <a href="${data.loginUrl}" class="login-button">
                🚀 Acessar AmadorFlix Agora
            </a>
        </div>

        <div class="footer">
            <p><strong>AmadorFlix</strong> - O melhor conteúdo adulto do Brasil</p>
            <p>Este é um email automático, não responda a esta mensagem.</p>
            <p>Se você não fez esta compra, ignore este email.</p>
        </div>
    </div>
</body>
</html>
  `
}

// Função para enviar email de confirmação de pagamento
export async function sendPaymentConfirmationEmail(data: PaymentConfirmationEmailData): Promise<boolean> {
  try {
    const transporter = createTransporter()
    
    const mailOptions = {
      from: `"AmadorFlix" <${process.env.SMTP_USER}>`,
      to: data.userEmail,
      subject: '✅ Pagamento Confirmado - Seu Acesso Premium Está Ativo!',
      html: createEmailTemplate(data),
      text: `
Olá ${data.userName},

Seu pagamento foi confirmado com sucesso!

Detalhes da Assinatura:
- Plano: ${data.planName}
- Duração: ${data.planDuration}
- Válido até: ${data.expireDate}
- Email: ${data.userEmail}
- Senha: ${data.userPassword}

Acesse nosso canal exclusivo no Telegram:
- Canal: ${data.telegramChannel}
- Bot: ${data.telegramBot}

Como acessar:
1. Acesse o bot do Telegram
2. Envie /start
3. Digite seu email: ${data.userEmail}
4. O bot verificará seu acesso

Acesse o site: ${data.loginUrl}

AmadorFlix - O melhor conteúdo adulto do Brasil
      `
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email de confirmação enviado com sucesso:', result.messageId)
    return true
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error)
    return false
  }
}

// Função para testar a configuração de email
export async function testEmailConfiguration(): Promise<boolean> {
  try {
    const transporter = createTransporter()
    await transporter.verify()
    console.log('Configuração de email verificada com sucesso')
    return true
  } catch (error) {
    console.error('Erro na configuração de email:', error)
    return false
  }
}
