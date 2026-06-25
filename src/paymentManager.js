/**
 * GERENCIADOR DE PAGAMENTOS TÁNAMÃO BRASIL
 * Integração com Stripe para processamento de cartões e PIX
 */

// Configuração dos planos e pacotes
const PAYMENT_CONFIG = {
  PLANOS: {
    IMPULSO: {
      name: "Impulso",
      price: 19.90,
      currency: "BRL",
      priceId: "price_impulso_monthly", // Substituir pelo ID real do Stripe
      interval: "month",
      trial: true,
      trialDays: 15
    },
    DESTAQUE: {
      name: "Destaque",
      price: 49.90,
      currency: "BRL",
      priceId: "price_destaque_monthly", // Substituir pelo ID real do Stripe
      interval: "month",
      trial: false
    }
  },
  PACOTES: {
    FOTOS_EXTRAS: {
      name: "Fotos Extras (+10)",
      price: 4.90,
      currency: "BRL",
      priceId: "price_fotos_extras_monthly", // Substituir pelo ID real do Stripe
      interval: "month",
      oneTime: false
    },
    BANNER_DESTAQUE: {
      name: "Destaque da Cidade (7 dias)",
      price: 19.90,
      currency: "BRL",
      priceId: "price_banner_destaque", // Substituir pelo ID real do Stripe
      oneTime: true,
      duration: 7
    }
  }
};

/**
 * Inicializa Stripe (deve ser chamado no App.jsx)
 */
function initializeStripe(publishableKey) {
  if (!window.Stripe) {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      window.stripeInstance = window.Stripe(publishableKey);
    };
    document.body.appendChild(script);
  }
}

/**
 * Cria Stripe Customer (salva no Supabase)
 */
async function createStripeCustomer(professionalId, email, name) {
  try {
    const response = await fetch('/api/stripe/create-customer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        professionalId,
        email,
        name,
        metadata: { app: 'tanamaobrasil' }
      })
    });

    if (!response.ok) throw new Error('Erro ao criar cliente Stripe');
    
    const { customerId } = await response.json();
    return customerId;
  } catch (err) {
    console.error("Erro ao criar cliente:", err);
    return null;
  }
}

/**
 * Cria sessão de checkout para plano mensal
 */
async function createCheckoutSession(planName, professionalData) {
  try {
    const plan = PAYMENT_CONFIG.PLANOS[planName];
    if (!plan) throw new Error(`Plano inválido: ${planName}`);

    const response = await fetch('/api/stripe/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planName,
        priceId: plan.priceId,
        professionalId: professionalData.id,
        email: professionalData.email,
        name: professionalData.name,
        trial_days: plan.trial ? plan.trialDays : 0,
        metadata: {
          professionalId: professionalData.id,
          plan: planName
        },
        successUrl: `${window.location.origin}/payment-success?plan=${planName}`,
        cancelUrl: `${window.location.origin}/payment-cancel`
      })
    });

    if (!response.ok) throw new Error('Erro ao criar sessão de checkout');
    
    const { sessionId } = await response.json();
    return sessionId;
  } catch (err) {
    console.error("Erro ao criar checkout:", err);
    throw err;
  }
}

/**
 * Redireciona para checkout do Stripe
 */
async function redirectToCheckout(sessionId) {
  try {
    if (!window.stripeInstance) {
      throw new Error('Stripe não inicializado');
    }

    const { error } = await window.stripeInstance.redirectToCheckout({ sessionId });
    
    if (error) {
      console.error('Erro ao redirecionar:', error);
      throw error;
    }
  } catch (err) {
    console.error("Erro ao redirecionar para checkout:", err);
    throw err;
  }
}

/**
 * Processa pagamento único (cartão ou PIX)
 */
async function processOneTimePayment(packageName, professionalId, paymentMethod = 'card') {
  try {
    const pkg = PAYMENT_CONFIG.PACOTES[packageName];
    if (!pkg) throw new Error(`Pacote inválido: ${packageName}`);

    if (pkg.oneTime) {
      // Pagamento único (banner)
      return await createOneTimePaymentIntent(pkg, professionalId, paymentMethod);
    } else {
      // Assinatura recorrente (fotos extras)
      return await createCheckoutSession(packageName, { id: professionalId });
    }
  } catch (err) {
    console.error("Erro ao processar pagamento:", err);
    throw err;
  }
}

/**
 * Cria Payment Intent para pagamento único
 */
async function createOneTimePaymentIntent(pkg, professionalId, paymentMethod) {
  try {
    const response = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: Math.round(pkg.price * 100), // Converter para centavos
        currency: 'brl',
        paymentMethod,
        description: pkg.name,
        professionalId,
        metadata: {
          professionalId,
          package: pkg.name
        }
      })
    });

    if (!response.ok) throw new Error('Erro ao criar payment intent');
    
    const { clientSecret, paymentIntentId } = await response.json();
    return { clientSecret, paymentIntentId };
  } catch (err) {
    console.error("Erro ao criar payment intent:", err);
    throw err;
  }
}

/**
 * Confirma pagamento com cartão
 */
async function confirmCardPayment(clientSecret, cardElement) {
  try {
    if (!window.stripeInstance) {
      throw new Error('Stripe não inicializado');
    }

    const { paymentIntent, error } = await window.stripeInstance.confirmCardPayment(
      clientSecret,
      { payment_method: { card: cardElement } }
    );

    if (error) {
      return { success: false, error: error.message };
    }

    if (paymentIntent.status === 'succeeded') {
      return { success: true, paymentIntentId: paymentIntent.id };
    }

    return { success: false, error: 'Pagamento não completado' };
  } catch (err) {
    console.error("Erro ao confirmar pagamento:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Gera QR Code PIX (Mercado Pago como alternativa)
 */
async function generatePixQrCode(amount, description, externalReference) {
  try {
    const response = await fetch('/api/mercadopago/create-qr-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount,
        description,
        externalReference
      })
    });

    if (!response.ok) throw new Error('Erro ao gerar QR Code PIX');
    
    const { qrCode, qrCodeUrl, orderId } = await response.json();
    return { qrCode, qrCodeUrl, orderId };
  } catch (err) {
    console.error("Erro ao gerar PIX:", err);
    throw err;
  }
}

/**
 * Verifica status do pagamento
 */
async function getPaymentStatus(paymentIntentId) {
  try {
    const response = await fetch(`/api/stripe/payment-status/${paymentIntentId}`);
    
    if (!response.ok) throw new Error('Erro ao verificar status');
    
    const { status, amount, created } = await response.json();
    return { status, amount, created };
  } catch (err) {
    console.error("Erro ao verificar status:", err);
    throw err;
  }
}

/**
 * Cancela assinatura
 */
async function cancelSubscription(subscriptionId) {
  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscriptionId })
    });

    if (!response.ok) throw new Error('Erro ao cancelar assinatura');
    
    return { success: true };
  } catch (err) {
    console.error("Erro ao cancelar:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Formata preço em BRL
 */
function formatPrice(amount) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(amount);
}

/**
 * Valida cartão (formato básico)
 */
function validateCard(cardNumber) {
  // Luhn algorithm
  const digits = cardNumber.replace(/\D/g, '');
  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

// Exportar API
window.PaymentManager = {
  PAYMENT_CONFIG,
  initializeStripe,
  createStripeCustomer,
  createCheckoutSession,
  redirectToCheckout,
  processOneTimePayment,
  createOneTimePaymentIntent,
  confirmCardPayment,
  generatePixQrCode,
  getPaymentStatus,
  cancelSubscription,
  formatPrice,
  validateCard
};

export default window.PaymentManager;
