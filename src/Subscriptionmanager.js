/**
 * GERENCIADOR DE ASSINATURAS TÁNAMÃO BRASIL
 * Controla planos, limites de recursos e banners.
 * Os nomes oficiais agora são: Grátis, Impulso e Destaque.
 */

const PLAN_CONFIG = {
  gratis: {
    name: "Grátis",
    price: 0,
    icon: "🚀",
    free: true,
    photoLimit: 5,
    videoLimit: 0,
    cityLimit: 1,
    trialDays: 0,
    features: ["Perfil público", "WhatsApp visível", "1 cidade", "Até 5 fotos", "Avaliações", "Aparecer nas buscas"]
  },
  impulso: {
    name: "Impulso",
    price: 19.90,
    icon: "⭐",
    popular: true,
    photoLimit: 10,
    videoLimit: 1,
    cityLimit: 3,
    trialDays: 0,
    features: ["Tudo do Grátis +", "Mais prioridade nas buscas", "Até 3 cidades", "Até 10 fotos", "1 vídeo", "Selo Impulso"]
  },
  destaque: {
    name: "Destaque",
    price: 49.90,
    icon: "💎",
    photoLimit: 15,
    videoLimit: 3,
    cityLimit: 999,
    trialDays: 0,
    features: ["Tudo do Impulso +", "Topo das pesquisas", "Espaço de destaque na Home", "Cidades ampliadas", "Até 15 fotos", "Até 3 vídeos", "Selo Destaque"]
  }
};

// Compatibilidade com nomes antigos que ainda podem estar salvos em cadastro/testes.
PLAN_CONFIG.START = PLAN_CONFIG.gratis;
PLAN_CONFIG.IMPULSO = PLAN_CONFIG.impulso;
PLAN_CONFIG.DESTAQUE = PLAN_CONFIG.destaque;
PLAN_CONFIG.pro = PLAN_CONFIG.impulso;
PLAN_CONFIG.premium = PLAN_CONFIG.destaque;

function normalizePlanName(planName) {
  const key = String(planName || "gratis").toLowerCase();
  if (key === "start") return "gratis";
  if (key === "pro") return "impulso";
  if (key === "premium") return "destaque";
  if (key === "impulso") return "impulso";
  if (key === "destaque") return "destaque";
  return "gratis";
}

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
    duration: 7
  }
};

function calculatePhotoLimit(planName, extraPhotoPackages = 0) {
  const normalized = normalizePlanName(planName);
  const baseLimit = PLAN_CONFIG[normalized]?.photoLimit || 5;
  return baseLimit + (Number(extraPhotoPackages || 0) * 10);
}

function checkTrialExpiration(subscription) {
  if (!subscription?.trial_active || !subscription?.trial_end_date) return subscription;

  const now = new Date();
  const trialEndDate = new Date(subscription.trial_end_date);

  if (now > trialEndDate) {
    return {
      ...subscription,
      subscription_plan: "gratis",
      trial_active: false,
      trial_end_date: null,
      trial_days_left: 0,
      photo_limit: PLAN_CONFIG.gratis.photoLimit,
      video_limit: PLAN_CONFIG.gratis.videoLimit,
      city_limit: PLAN_CONFIG.gratis.cityLimit,
      status: "active"
    };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((trialEndDate - now) / msPerDay);
  return { ...subscription, trial_days_left: Math.max(0, daysLeft) };
}

function checkBannerExpiration(subscription) {
  if (!subscription?.banner_active || !subscription?.banner_end_date) return subscription;

  const now = new Date();
  const bannerEndDate = new Date(subscription.banner_end_date);

  if (now > bannerEndDate) {
    return {
      ...subscription,
      banner_active: false,
      banner_end_date: null,
      banner_city: null,
      banner_days_left: 0
    };
  }

  const msPerDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((bannerEndDate - now) / msPerDay);
  return { ...subscription, banner_days_left: Math.max(0, daysLeft) };
}

function createSubscription(planName, hasTrial = false) {
  const normalized = normalizePlanName(planName);
  const plan = PLAN_CONFIG[normalized];
  const now = new Date();

  if (!plan) throw new Error(`Plano inválido: ${planName}`);

  const subscription = {
    subscription_plan: normalized,
    plan_price: plan.price,
    status: plan.price > 0 ? "pending_payment" : "active",
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

  if (normalized === "impulso" && hasTrial) {
    const trialEndDate = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    subscription.trial_active = true;
    subscription.trial_start_date = now;
    subscription.trial_end_date = trialEndDate;
    subscription.trial_days_left = 15;
  }

  if (plan.price > 0) {
    subscription.next_billing_date = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  }

  return subscription;
}

function canUploadPhoto(subscription, currentPhotoCount = 0) {
  const photoLimit = calculatePhotoLimit(subscription?.subscription_plan, subscription?.extra_photo_packages);
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

function canUploadVideo(subscription, currentVideoCount = 0) {
  const normalized = normalizePlanName(subscription?.subscription_plan);
  const videoLimit = PLAN_CONFIG[normalized]?.videoLimit || 0;
  return {
    canUpload: currentVideoCount < videoLimit,
    currentCount: currentVideoCount,
    limit: videoLimit,
    remaining: Math.max(0, videoLimit - currentVideoCount),
    message: videoLimit === 0
      ? "Seu plano não permite vídeos. Atualize para o Impulso."
      : currentVideoCount >= videoLimit
        ? `Você atingiu o limite de ${videoLimit} vídeo(s).`
        : `Você pode enviar mais ${videoLimit - currentVideoCount} vídeo(s).`
  };
}

function getTrialStatusMessage(subscription) {
  if (!subscription?.trial_active) return null;
  const daysLeft = subscription.trial_days_left || 0;
  if (daysLeft === 0) return "Teste finalizado. Você retornou ao plano Grátis.";
  if (daysLeft === 1) return "Último dia do seu período de teste.";
  if (daysLeft <= 3) return `Seu teste expira em ${daysLeft} dia(s).`;
  return `Você ainda tem ${daysLeft} dias de teste.`;
}

function activateBanner(subscription, city, days = EXTRA_PACKAGES.BANNER.duration) {
  const now = new Date();
  return {
    ...subscription,
    banner_active: true,
    banner_city: city,
    banner_start_date: now,
    banner_end_date: new Date(now.getTime() + days * 24 * 60 * 60 * 1000),
    banner_days_left: days,
    updated_at: now
  };
}

function addPhotoPackage(subscription, quantity = 1) {
  const currentExtra = Number(subscription?.extra_photo_packages || 0);
  const currentLimit = Number(subscription?.photo_limit || calculatePhotoLimit(subscription?.subscription_plan));
  const maxPackages = Math.max(0, Math.ceil((EXTRA_PACKAGES.PHOTOS.maxLimit - currentLimit) / 10));
  const newQuantity = Math.min(currentExtra + quantity, currentExtra + maxPackages);
  return {
    ...subscription,
    extra_photo_packages: newQuantity,
    photo_limit: calculatePhotoLimit(subscription?.subscription_plan, newQuantity)
  };
}

function upgradePlan(subscription, newPlanName) {
  const normalized = normalizePlanName(newPlanName);
  const newPlan = PLAN_CONFIG[normalized];
  if (!newPlan) throw new Error(`Plano inválido: ${newPlanName}`);

  const extraPackages = subscription?.extra_photo_packages || 0;
  return {
    ...subscription,
    subscription_plan: normalized,
    plan_price: newPlan.price,
    photo_limit: calculatePhotoLimit(normalized, extraPackages),
    video_limit: newPlan.videoLimit,
    city_limit: newPlan.cityLimit,
    updated_at: new Date()
  };
}

function downgradeToStart(subscription) {
  return {
    ...subscription,
    subscription_plan: "gratis",
    photo_limit: PLAN_CONFIG.gratis.photoLimit,
    video_limit: PLAN_CONFIG.gratis.videoLimit,
    city_limit: PLAN_CONFIG.gratis.cityLimit,
    trial_active: false,
    updated_at: new Date()
  };
}

window.SubscriptionManager = {
  PLAN_CONFIG,
  EXTRA_PACKAGES,
  normalizePlanName,
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
