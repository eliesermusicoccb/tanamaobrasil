import { useEffect, useState } from "react";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF",
  acc: "#E8A817", accLt: "#FEF7E0",
  cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

/**
 * TrialBanner - Exibe status do trial premium
 * Mostra contador regressivo e mensagem personalizada
 */
export function TrialBanner({ subscription, onUpgrade }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!subscription?.trial_active || !subscription?.trial_end_date) return;

    const updateTimer = () => {
      const now = new Date();
      const endDate = new Date(subscription.trial_end_date);
      const msLeft = endDate - now;

      if (msLeft <= 0) {
        setTimeLeft(null);
        return;
      }

      const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
      setTimeLeft(daysLeft);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Atualizar a cada minuto
    return () => clearInterval(interval);
  }, [subscription]);

  if (!subscription?.trial_active || timeLeft === null) return null;

  const isLast3Days = timeLeft <= 3;
  const isLastDay = timeLeft === 1;

  return (
    <div style={{
      background: isLastDay ? `linear-gradient(135deg, ${C.cor}, #D1441A)` : `linear-gradient(135deg, ${C.acc}, #D68910)`,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      color: "#fff"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>⏱️</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13 }}>
            {isLastDay ? "Último dia do seu teste!" : "Testando plano IMPULSO"}
          </div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            Você está experimentando gratuitamente os recursos premium do TáNaMão.
          </div>
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,.2)",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        textAlign: "center",
        fontWeight: 700,
        fontSize: 14
      }}>
        {timeLeft} dia{timeLeft !== 1 ? "s" : ""} restante{timeLeft !== 1 ? "s" : ""}
      </div>

      {isLast3Days && (
        <button
          onClick={onUpgrade}
          style={{
            width: "100%",
            padding: 10,
            background: "#fff",
            color: isLastDay ? C.cor : C.acc,
            border: "none",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: font.d
          }}
        >
          Atualizar para plano pago
        </button>
      )}
    </div>
  );
}

/**
 * PhotoLimitWarning - Alerta quando profissional tem mais fotos que o permitido
 */
export function PhotoLimitWarning({ subscription, photoCount, onUpgrade }) {
  if (!subscription) return null;

  // Calcular limite
  const baseLimit = { START: 5, IMPULSO: 10, DESTAQUE: 10 }[subscription.subscription_plan] || 5;
  const totalLimit = baseLimit + (subscription.extra_photo_packages || 0) * 10;

  if (photoCount <= totalLimit) return null;

  const excess = photoCount - totalLimit;

  return (
    <div style={{
      background: C.corLt,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      border: `2px solid ${C.cor}`
    }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18 }}>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.cor, marginBottom: 4 }}>
            Limite de fotos excedido
          </div>
          <div style={{ fontSize: 12, color: C.dk, marginBottom: 8 }}>
            Você possui {excess} foto{excess !== 1 ? "s" : ""} a mais que o permitido no seu plano atual. Atualize seu plano para continuar utilizando todas as imagens.
          </div>
          <button
            onClick={onUpgrade}
            style={{
              padding: "6px 12px",
              background: C.cor,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: font.b
            }}
          >
            Contratar pacote extra
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * SubscriptionStatus - Mostra status atual do plano
 */
export function SubscriptionStatus({ subscription }) {
  if (!subscription) return null;

  const planConfig = {
    START: { name: "START", icon: "🚀", color: C.gL },
    IMPULSO: { name: "IMPULSO", icon: "⭐", color: C.acc },
    DESTAQUE: { name: "DESTAQUE", icon: "💎", color: C.pri }
  };

  const config = planConfig[subscription.subscription_plan] || planConfig.START;

  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      border: `2px solid ${C.gB}`,
      padding: 12,
      marginBottom: 16
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{config.icon}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.dk }}>
            Plano {config.name}
          </div>
          <div style={{ fontSize: 11, color: C.gL }}>
            {subscription.plan_price === 0
              ? "Grátis"
              : `R$ ${subscription.plan_price.toFixed(2)}/mês`}
            {subscription.trial_active && ` • ${subscription.trial_days_left}d teste`}
          </div>
        </div>
        {subscription.trial_active && (
          <span style={{
            background: C.accLt,
            color: C.acc,
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 10,
            fontWeight: 700
          }}>
            TRIAL
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * BannerStatus - Mostra status do banner de destaque
 */
export function BannerStatus({ subscription, onActivate }) {
  if (!subscription || !subscription.banner_active) {
    return (
      <div style={{
        background: C.gBg,
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        textAlign: "center"
      }}>
        <div style={{ fontSize: 12, color: C.g, marginBottom: 8 }}>
          💰 Banner de destaque inativo
        </div>
        <button
          onClick={onActivate}
          style={{
            padding: "8px 16px",
            background: C.pri,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: font.b
          }}
        >
          Ativar destaque (R$ 19,90)
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: C.priLt,
      borderRadius: 12,
      padding: 12,
      marginBottom: 16,
      border: `2px solid ${C.pri}`
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 16 }}>✨</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.pri }}>
            Banner ativo em {subscription.banner_city}
          </div>
          <div style={{ fontSize: 11, color: C.priDk }}>
            {subscription.banner_days_left} dia{subscription.banner_days_left !== 1 ? "s" : ""} restante{subscription.banner_days_left !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}

export default {
  TrialBanner,
  PhotoLimitWarning,
  SubscriptionStatus,
  BannerStatus
};
