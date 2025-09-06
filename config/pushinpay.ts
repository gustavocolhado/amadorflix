// Função para garantir carregamento das variáveis de ambiente
function loadEnvironmentVariables() {
  try {
    require('dotenv').config();
  } catch (error) {
    console.warn('⚠️  dotenv não encontrado, usando variáveis do sistema');
  }
}

// Carregar variáveis de ambiente
loadEnvironmentVariables();

// Interface para a configuração
interface PushinPayConfig {
  TOKEN: string | undefined;
  WEBHOOK_URL: string | undefined;
  SPLIT_ACCOUNT_ID: string;
  SPLIT_PERCENTAGE: number;
  MAIN_PERCENTAGE: number;
  API_URL: string;
  HEADERS: {
    Authorization: string;
    Accept: string;
    'Content-Type': string;
  };
  MIN_VALUE: number;
  MAX_VALUE: number;
  EXPIRATION_MINUTES: number;
}

// Função para obter configuração com token atualizado
export function getPUSHINPAY_CONFIG(): PushinPayConfig {
  const token = process.env.PUSHINPAY_TOKEN;
  
  if (!token) {
    console.error('❌ PUSHINPAY_TOKEN não encontrado nas variáveis de ambiente');
    console.log('   Verifique se o arquivo .env existe e contém PUSHINPAY_TOKEN');
  }
  
  // IMPORTANTE: Usar API de produção mesmo em desenvolvimento
  // porque o token não tem acesso ao sandbox
  const useProductionAPI = true; // Forçar uso da API de produção
  
  return {
    // Token de autenticação
    TOKEN: token,
    
    // URL do webhook para notificações
    WEBHOOK_URL: process.env.PUSHINPAY_WEBHOOK_URL,
    
    // ID da conta para split
    SPLIT_ACCOUNT_ID: process.env.PUSHINPAY_SPLIT_ACCOUNT_ID || '9F64A5B8-47CB-4969-A85C-D380100225F9',
    
    // Configurações de split (50% para cada conta)
    SPLIT_PERCENTAGE: 0.50, // 50% para a conta de split
    MAIN_PERCENTAGE: 0.50,  // 50% para a conta principal
    
    // URL da API (sempre produção por enquanto)
    API_URL: useProductionAPI 
      ? 'https://api.pushinpay.com.br/api/pix/cashIn'
      : (process.env.NODE_ENV === 'development' 
        ? 'https://api-sandbox.pushinpay.com.br/api/pix/cashIn'
        : 'https://api.pushinpay.com.br/api/pix/cashIn'),
    
    // Headers padrão (atualizados dinamicamente)
    HEADERS: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    
    // Valores mínimos e máximos
    MIN_VALUE: 50, // 50 centavos
    MAX_VALUE: 1000000, // 10.000 reais (ajustar conforme limite da conta)
    
    // Tempo de expiração do PIX (15 minutos)
    EXPIRATION_MINUTES: 15,
  };
}

// Configuração inicial
export const PUSHINPAY_CONFIG = getPUSHINPAY_CONFIG();

// Função para calcular valores do split
export function calculateSplitValues(totalValue: number) {
  const config = getPUSHINPAY_CONFIG();
  const splitValue = Math.round(totalValue * config.SPLIT_PERCENTAGE);
  const mainValue = totalValue - splitValue;
  
  return {
    totalValue,
    mainValue,
    splitValue,
    splitPercentage: config.SPLIT_PERCENTAGE,
    mainPercentage: config.MAIN_PERCENTAGE
  };
}

// Função para validar valor
export function validateValue(value: number): { isValid: boolean; error?: string } {
  const config = getPUSHINPAY_CONFIG();
  
  if (value < config.MIN_VALUE) {
    return {
      isValid: false,
      error: `Valor mínimo deve ser ${config.MIN_VALUE} centavos`
    };
  }
  
  if (value > config.MAX_VALUE) {
    return {
      isValid: false,
      error: `Valor máximo permitido é ${config.MAX_VALUE} centavos`
    };
  }
  
  return { isValid: true };
}

// Função para criar payload do split
export function createSplitPayload(value: number, webhookUrl?: string) {
  const config = getPUSHINPAY_CONFIG();
  const { splitValue } = calculateSplitValues(value);
  
  const payload: any = {
    value: value,
    split_rules: [
      {
        value: splitValue,
        account_id: config.SPLIT_ACCOUNT_ID
      }
    ]
  };
  
  if (webhookUrl) {
    payload.webhook_url = webhookUrl;
  }
  
  return payload;
} 