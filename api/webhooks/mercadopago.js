// src/services/mercadopago-service.js (ATUALIZADO para Vercel)

const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;

export const createPaymentPreference = async (plan, userData) => {
  try {
    // Mapear planos para preços
    const plansConfig = {
      pro: {
        title: 'Plano Pro - TáNaMão Brasil',
        price: 29.90,
        description: 'Destaque, selo verificado, chat ilimitado por 1 mês',
      },
      premium: {
        title: 'Plano Premium - TáNaMão Brasil',
        price: 69.90,
        description: 'Primeiro nas buscas, banner incluso, chat ilimitado por 1 mês',
      },
      banner_weekly: {
        title: 'Banner Publicitário - Semanal',
        price: 49.90,
        description: 'Destaque em banner por 7 dias',
      },
      banner_monthly: {
        title: 'Banner Publicitário - Mensal',
        price: 149.90,
        description: 'Destaque em banner por 30 dias',
      },
      banner_quarterly: {
        title: 'Banner Publicitário - Trimestral',
        price: 349.90,
        description: 'Destaque em banner por 90 dias',
      },
    };

    const config = plansConfig[plan];
    if (!config) throw new Error('Plano inválido');

    // Body para criar preferência no MercadoPago
    const preference = {
      items: [
        {
          title: config.title,
          description: config.description,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: config.price,
        },
      ],
      payer: {
        email: userData.email || 'cliente@tanamao.com.br',
        name: userData.name || 'Cliente',
      },
      back_urls: {
        success: `${window.location.origin}/pagamento-sucesso`,
        failure: `${window.location.origin}/pagamento-erro`,
        pending: `${window.location.origin}/pagamento-pendente`,
      },
      // Webhook para Vercel
      notification_url: `${window.location.origin}/api/webhooks/mercadopago`,
      external_reference: `${userData.userId}-${plan}-${Date.now()}`,
      auto_return: 'approved',
    };

    // Chamar função serverless Vercel (agora sem VITE_API_URL)
    const response = await fetch('/api/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        preference,
        plan,
        userId: userData.userId,
      }),
    });

    if (!response.ok) throw new Error('Erro ao criar preferência de pagamento');

    const data = await response.json();
    return data.preferenceId;
  } catch (error) {
    console.error('Erro ao criar preferência MercadoPago:', error);
    throw error;
  }
};

export const redirectToCheckout = async (preferenceId) => {
  try {
    // Carregar SDK do MercadoPago
    if (!window.MercadoPago) {
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      document.head.appendChild(script);

      // Aguardar carregamento
      await new Promise((resolve) => {
        script.onload = resolve;
      });
    }

    // Inicializar MercadoPago
    const mp = new window.MercadoPago(MP_PUBLIC_KEY);
    
    // Redirecionar para checkout
    mp.checkout({
      preference: {
        id: preferenceId,
      },
      autoOpen: true,
    });
  } catch (error) {
    console.error('Erro ao abrir checkout MercadoPago:', error);
    throw error;
  }
};

export const loadMercadoPagoScript = () => {
  return new Promise((resolve, reject) => {
    if (window.MercadoPago) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.mercadopago.com/js/v2';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};
