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

// Função para obter configuração com token atualizado
function getPUSHINPAY_CONFIG() {
  const token = process.env.PUSHINPAY_TOKEN;
  
  if (!token) {
    console.error('❌ PUSHINPAY_TOKEN não encontrado nas variáveis de ambiente');
    console.log('   Verifique se o arquivo .env existe e contém PUSHINPAY_TOKEN');
  }
  
  return {
    // Token de autenticação
    TOKEN: token,
    
    // URL do webhook para notificações
    WEBHOOK_URL: process.env.PUSHINPAY_WEBHOOK_URL,
    
    // IDs das contas para split
    SPLIT_ACCOUNT_ID: process.env.PUSHINPAY_SPLIT_ACCOUNT_ID || '9F64A5B8-47CB-4969-A85C-D380100225F9',
    SPLIT_ACCOUNT_ID2: process.env.PUSHINPAY_SPLIT_ACCOUNT_ID2 || '9F905070-C4F0-42D7-B399-566226D0808D',
    
    // Configurações de split (total 63% dividido entre as duas contas)
    SPLIT_PERCENTAGE: 0.315, // 31.5% para a primeira conta de split
    SPLIT_PERCENTAGE2: 0.315, // 31.5% para a segunda conta de split
    MAIN_PERCENTAGE: 0.37,  // 37% para a conta principal
    
      // IMPORTANTE: Usar API de produção mesmo em desenvolvimento
  // porque o token não tem acesso ao sandbox
  API_URL: (() => {
    const useProductionAPI = true; // Forçar uso da API de produção
    return useProductionAPI 
      ? 'https://api.pushinpay.com.br/api/pix/cashIn'
      : (process.env.NODE_ENV === 'development' 
        ? 'https://api-sandbox.pushinpay.com.br/api/pix/cashIn'
        : 'https://api.pushinpay.com.br/api/pix/cashIn');
  })(),
    
    // Headers padrão (atualizados dinamicamente)
    get HEADERS() {
      return {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      };
    },
    
    // Valores mínimos e máximos
    MIN_VALUE: 50, // 50 centavos
    MAX_VALUE: 1000000, // 10.000 reais (ajustar conforme limite da conta)
    
    // Tempo de expiração do PIX (15 minutos)
    EXPIRATION_MINUTES: 15,
  };
}

// Configuração inicial
const PUSHINPAY_CONFIG = getPUSHINPAY_CONFIG();

// Função para calcular valores do split
function calculateSplitValues(totalValue) {
  const splitValue = Math.round(totalValue * PUSHINPAY_CONFIG.SPLIT_PERCENTAGE);
  const splitValue2 = Math.round(totalValue * PUSHINPAY_CONFIG.SPLIT_PERCENTAGE2);
  const mainValue = totalValue - splitValue - splitValue2;
  
  return {
    totalValue,
    mainValue,
    splitValue,
    splitValue2,
    splitPercentage: PUSHINPAY_CONFIG.SPLIT_PERCENTAGE,
    splitPercentage2: PUSHINPAY_CONFIG.SPLIT_PERCENTAGE2,
    mainPercentage: PUSHINPAY_CONFIG.MAIN_PERCENTAGE
  };
}

// Função para validar valor
function validateValue(value) {
  if (value < PUSHINPAY_CONFIG.MIN_VALUE) {
    return {
      isValid: false,
      error: `Valor mínimo deve ser ${PUSHINPAY_CONFIG.MIN_VALUE} centavos`
    };
  }
  
  if (value > PUSHINPAY_CONFIG.MAX_VALUE) {
    return {
      isValid: false,
      error: `Valor máximo permitido é ${PUSHINPAY_CONFIG.MAX_VALUE} centavos`
    };
  }
  
  return { isValid: true };
}

// Função para criar payload do split
function createSplitPayload(value, webhookUrl) {
  const { splitValue, splitValue2 } = calculateSplitValues(value);
  
  const payload = {
    value: value,
    split_rules: [
      {
        value: splitValue,
        account_id: PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID
      },
      {
        value: splitValue2,
        account_id: PUSHINPAY_CONFIG.SPLIT_ACCOUNT_ID2
      }
    ]
  };
  
  if (webhookUrl) {
    payload.webhook_url = webhookUrl;
  }
  
  return payload;
}

module.exports = {
  PUSHINPAY_CONFIG,
  getPUSHINPAY_CONFIG, // Função para obter configuração atualizada
  calculateSplitValues,
  validateValue,
  createSplitPayload
}; 