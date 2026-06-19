/**
 * GERENCIADOR DE ASSINATURAS TÁNAMÃO BRASIL
 * Controla planos, trials, limites de recursos e banners
 */

// Configuração dos planos
const PLAN_CONFIG = {
  START: {
    name: "START",
    price: 0,
    icon: "🚀",
    free: true,
    photoLimit: 5,
    videoLimit: 0,
    cityLimit: 1,
    trialDays: 0,
    features: ["Perfil público", "WhatsApp visível", "1 cidade", "Até 5 fotos", "Avaliações", "Aparecer nas buscas"]
  },
  IMPULSO: {
    name: "IMPULSO",
    price: 19.90,
    icon: "⭐",
    popular: true,
    photoLimit: 10,
    videoLimit: 1,
    cityLimit: 3,
    trialDays: 15,
    features: ["Tudo START +", "Prioridade nas buscas", "Até 3 cidades", "Até 10 fotos", "1 vídeo", "Estatísticas", "Selo Profissional"]
  },
  DESTAQUE: {
    name: "DESTAQUE",
    price: 49.90,
    icon: "💎",
    photoLimit: 10,
    videoLimit: 3,
    cityLimit: 999,
    trialDays: 0,
    features: ["Tudo IMPULSO +", "Topo das pesquisas", "Cidades ilimitadas", "Perfil Premium", "Até 3 vídeos", "Selo Ouro", "Relatórios"]
  }
};

const EXTRA_PACKAGES = {
  PHOTOS: {
    price: 4.90,
    name: "Fotos Extras",
    quantity: 10,
    maxLimit: 50
  },
  BANNER: {
    price: 19.90,
    name: "Destaque da Cidade",
    duration: 7 // dias
  }
};

/**
 * Calcula foto_limit total baseado no plano + pacotes extras
 */
function calculatePhotoLimit(planName, extraPhotoPackages = 0) {
  const baseLimit = PLAN_CONFIG[planName]?.photoLimit || 5;
  return baseLimit + (extraPhotoPackages * 10);
}

/**
 * Verifica se trial expirou e faz downgrade automático
 */
function checkTrialExpiration(subscription) {
  if (!subscription.trial_active || !subscription.trial_end_date) {
    return subscription;
  }

  const now = new Date();
  const trialEndDate = new Date(subscription.trial_end_date);

  if (now > trialEndDate) {
    // Trial expirou - fazer downgrade para START
    return {
      ...subscription,
      subscription_plan: "START",
      trial_active: false,
      trial_end_date: null,
      trial_days_left: 0,
      photo_limit: PLAN_CONFIG.START.photoLimit,
      video_limit: PLAN_CONFIG.START.videoLimit,
      city_limit: PLAN_CONFIG.START.cityLimit,
      status: "active" // Mantém ativo
    };
  }

  // Recalcular dias restantes
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((trialEndDate - now) / msPerDay);

  return {
    ...subscription,
    trial_days_left: Math.max(0, daysLeft)
  };
}

/**
 * Verifica se banner de destaque expirou
 */
function checkBannerExpiration(subscription) {
  if (!subscription.banner_active || !subscription.banner_end_date) {
    return subscription;
  }

  const now = new Date();
  const bannerEndDate = new Date(subscription.banner_end_date);

  if (now > bannerEndDate) {
    // Banner expirou
    return {
      ...subscription,
      banner_active: false,
      banner_end_date: null,
      banner_city: null,
      banner_days_left: 0
    };
  }

  // Recalcular dias restantes
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((bannerEndDate - now) / msPerDay);

  return {
    ...subscription,
    banner_days_left: Math.max(0, daysLeft)
  };
}

/**
 * Cria nova assinatura com dados corretos
 */
function createSubscription(planName, hasTrial = true) {
  const plan = PLAN_CONFIG[planName];
  const now = new Date();
  
  if (!plan) {
    throw new Error(`Plano inválido: ${planName}`);
  }

  const subscription = {
    subscription_plan: planName,
    plan_price: plan.price,
    status: "active",
    photo_limit: plan.photoLimit,
    video_limit: plan.videoLimit,
    city_limit: plan.cityLimit,
    extra_photo_packages: 0,
    trial_active: false,
    trial_days_left: 0,
    banner_active: false,
    created_at: now,
    updated_at: now
  };

  // Se plano IMPULSO e tem trial
  if (planName === "IMPULSO" && hasTrial) {
    const trialEndDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    subscription.trial_active = true;
    subscription.trial_start_date = now;
    subscription.trial_end_date = trialEndDate;
    subscription.trial_days_left = 15;
  }

  // Próxima data de cobrança (30 dias)
  if (plan.price > 0) {
    subscription.next_billing_date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  return subscription;
}

/**
 * Valida upload de fotos baseado no limite
 */
function canUploadPhoto(subscription, currentPhotoCount = 0) {
  const photoLimit = calculatePhotoLimit(
    subscription.subscription_plan,
    subscription.extra_photo_packages
  );
  
  return {
    canUpload: currentPhotoCount < photoLimit,
    currentCount: currentPhotoCount,
    limit: photoLimit,
    remaining: Math.max(0, photoLimit - currentPhotoCount),
    message: currentPhotoCount >= photoLimit 
      ? `Você atingiu o limite de ${photoLimit} fotos. Contrate mais pacotes para continuar.`
      : `Você pode enviar mais ${photoLimit - currentPhotoCount} foto(s).`
  };
}

/**
 * Valida upload de vídeos baseado no limite
 */
function canUploadVideo(subscription, currentVideoCount = 0) {
  const videoLimit = PLAN_CONFIG[subscription.subscription_plan]?.videoLimit || 0;
  
  return {
    canUpload: currentVideoCount < videoLimit,
    currentCount: currentVideoCount,
    limit: videoLimit,
    remaining: Math.max(0, videoLimit - currentVideoCount),
    message: videoLimit === 0 
      ? "Seu plano não permite vídeos. Atualize para IMPULSO."
      : currentVideoCount >= videoLimit
        ? `Você atingiu o limite de ${videoLimit} vídeo(s).`
        : `Você pode enviar mais ${videoLimit - currentVideoCount} vídeo(s).`
  };
}

/**
 * Retorna mensagem de status do trial
 */
function getTrialStatusMessage(subscription) {
  if (!subscription.trial_active) {
    return null;
  }

  const daysLeft = subscription.trial_days_left || 0;
  
  if (daysLeft === 0) {
    return "Trial finalizado! Você retornou ao plano START.";
  }

  if (daysLeft === 1) {
    return "⚠️ Último dia do seu período de teste premium!";
  }

  if (daysLeft <= 3) {
    return `⏱️ Seu trial expira em ${daysLeft} dia(s)!`;
  }

  return `Você está experimentando gratuitamente os recursos premium do TáNaMão. ${daysLeft} dias restantes.`;
}

/**
 * Ativa banner de destaque
 */
function activateBanner(subscription, city, durationDays = 7) {
  const now = new Date();
  const endDate = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

  return {
    ...subscription,
    banner_active: true,
    banner_city: city,
    banner_start_date: now,
    banner_end_date: endDate,
    banner_days_left: durationDays
  };
}

/**
 * Adiciona pacote extra de fotos
 */
function addPhotoPackage(subscription, quantity = 1) {
  const maxPackages = Math.ceil((EXTRA_PACKAGES.PHOTOS.maxLimit - subscription.photo_limit) / 10);
  const newQuantity = Math.min(subscription.extra_photo_packages + quantity, maxPackages);

  return {
    ...subscription,
    extra_photo_packages: newQuantity,
    photo_limit: calculatePhotoLimit(subscription.subscription_plan, newQuantity)
  };
}

/**
 * Faz upgrade de plano
 */
function upgradePlan(subscription, newPlanName) {
  const newPlan = PLAN_CONFIG[newPlanName];
  
  if (!newPlan) {
    throw new Error(`Plano inválido: ${newPlanName}`);
  }

  // Manter fotos extras ao fazer upgrade
  const extraPackages = subscription.extra_photo_packages || 0;

  return {
    ...subscription,
    subscription_plan: newPlanName,
    plan_price: newPlan.price,
    photo_limit: calculatePhotoLimit(newPlanName, extraPackages),
    video_limit: newPlan.videoLimit,
    city_limit: newPlan.cityLimit,
    updated_at: new Date()
  };
}

/**
 * Downgrade para START (quando trial expira)
 */
function downgradeToStart(subscription) {
  return {
    ...subscription,
    subscription_plan: "START",
    photo_limit: PLAN_CONFIG.START.photoLimit,
    video_limit: PLAN_CONFIG.START.videoLimit,
    city_limit: PLAN_CONFIG.START.cityLimit,
    trial_active: false,
    updated_at: new Date()
  };
}

// Exportar API
window.SubscriptionManager = {
  PLAN_CONFIG,
  EXTRA_PACKAGES,
  calculatePhotoLimit,
  checkTrialExpiration,
  checkBannerExpiration,
  createSubscription,
  canUploadPhoto,
  canUploadVideo,
  getTrialStatusMessage,
  activateBanner,
  addPhotoPackage,
  upgradePlan,
  downgradeToStart
};

// Salvar em localStorage para sincronização
if (typeof window !== "undefined") {
  window.SubscriptionManager.save = function(subscription) {
    localStorage.setItem("subscription", JSON.stringify(subscription));
  };
  
  window.SubscriptionManager.load = function() {
    const data = localStorage.getItem("subscription");
    return data ? JSON.parse(data) : null;
  };
}

export default window.SubscriptionManager;
