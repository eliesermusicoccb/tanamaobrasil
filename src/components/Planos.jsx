// src/components/Planos.jsx

import React, { useState } from 'react';
import { createPaymentPreference, redirectToCheckout } from '../services/mercadopago-service';

const Planos = ({ userId, userEmail, userName }) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const handlePayment = async (plan) => {
    try {
      setLoading(plan);
      setError('');

      // Criar preferência de pagamento
      const preferenceId = await createPaymentPreference(plan, {
        userId,
        email: userEmail,
        name: userName,
      });

      // Redirecionar para checkout
      await redirectToCheckout(preferenceId);
    } catch (err) {
      setError('Erro ao iniciar pagamento. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: 'basic',
      name: 'BÁSICO',
      price: 'R$ 0',
      duration: '/mês',
      features: [
        'Perfil público',
        'WhatsApp visível',
        '1 cidade',
        'Até 5 fotos',
        'Avaliações',
        'Aparecer nas buscas',
      ],
      cta: 'Já incluso',
      disabled: true,
    },
    {
      id: 'professional',
      name: 'PROFISSIONAL',
      price: 'R$ 19,90',
      duration: '/mês',
      features: [
        'Tudo BÁSICO +',
        '✓ Perfil verificado',
        'Prioridade nas buscas',
        'Até 3 cidades',
        'Até 10 fotos + 1 vídeo',
        'Estatísticas básicas',
        'Chat direto ativo',
      ],
      cta: 'Assinar',
      highlight: true,
      loading: loading === 'professional',
    },
    {
      id: 'elite',
      name: 'ELITE',
      price: 'R$ 49,90',
      duration: '/mês',
      features: [
        'Tudo PROFISSIONAL +',
        '🏆 Badge ELITE (topo)',
        'Cidades ilimitadas',
        'Logotipo/branding',
        'Até 10 fotos + 3 vídeos',
        'Estatísticas avançadas',
        'Relatório mensal',
        'Suporte VIP',
      ],
      cta: 'Assinar',
      loading: loading === 'elite',
    },
  ];

  const banners = [
    {
      id: 'banner_weekly',
      period: 'Semanal',
      duration: '7 dias',
      price: 'R$ 49,90',
      loading: loading === 'banner_weekly',
    },
    {
      id: 'banner_monthly',
      period: 'Mensal',
      duration: '30 dias',
      price: 'R$ 149,90',
      loading: loading === 'banner_monthly',
    },
    {
      id: 'banner_quarterly',
      period: 'Trimestral',
      duration: '90 dias',
      price: 'R$ 349,90',
      loading: loading === 'banner_quarterly',
    },
  ];

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '60px 20px',
      fontFamily: 'DM Sans, sans-serif',
    },
    title: {
      fontSize: '48px',
      fontWeight: '900',
      color: '#0C8C5E',
      marginBottom: '20px',
      textAlign: 'center',
      fontFamily: 'Outfit, sans-serif',
    },
    subtitle: {
      fontSize: '18px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '60px',
    },
    error: {
      background: '#fee',
      color: '#c33',
      padding: '12px 16px',
      borderRadius: '8px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    gridPlans: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      marginBottom: '80px',
    },
    planCard: {
      border: '2px solid #eee',
      borderRadius: '12px',
      padding: '40px 30px',
      textAlign: 'center',
      background: '#fff',
      transition: 'all 0.3s',
    },
    planCardHighlight: {
      borderColor: '#0C8C5E',
      background: '#f0faf8',
      transform: 'scale(1.05)',
      boxShadow: '0 10px 40px rgba(12, 140, 94, 0.15)',
    },
    planName: {
      fontSize: '24px',
      fontWeight: '700',
      marginBottom: '10px',
      color: '#1a1a1a',
      fontFamily: 'Outfit, sans-serif',
    },
    planPrice: {
      fontSize: '36px',
      fontWeight: '900',
      color: '#0C8C5E',
      marginBottom: '5px',
      fontFamily: 'Outfit, sans-serif',
    },
    planDuration: {
      fontSize: '14px',
      color: '#999',
      marginBottom: '30px',
    },
    featuresList: {
      listStyle: 'none',
      padding: '0',
      marginBottom: '30px',
      textAlign: 'left',
    },
    feature: {
      padding: '10px 0',
      color: '#555',
      fontSize: '14px',
      borderBottom: '1px solid #f0f0f0',
    },
    button: {
      width: '100%',
      padding: '14px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
      background: '#0C8C5E',
      color: '#fff',
    },
    buttonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed',
      opacity: 0.6,
    },
    buttonLoading: {
      opacity: 0.8,
    },
    bannerSection: {
      marginTop: '80px',
      paddingTop: '60px',
      borderTop: '1px solid #eee',
    },
    bannerTitle: {
      fontSize: '32px',
      fontWeight: '900',
      color: '#0C8C5E',
      marginBottom: '10px',
      textAlign: 'center',
      fontFamily: 'Outfit, sans-serif',
    },
    bannerSubtitle: {
      fontSize: '16px',
      color: '#666',
      textAlign: 'center',
      marginBottom: '40px',
    },
    gridBanners: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
    },
    bannerCard: {
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '30px 20px',
      textAlign: 'center',
      background: '#fafafa',
    },
    bannerPeriod: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#1a1a1a',
      marginBottom: '8px',
      fontFamily: 'Outfit, sans-serif',
    },
    bannerDuration: {
      fontSize: '14px',
      color: '#999',
      marginBottom: '15px',
    },
    bannerPrice: {
      fontSize: '24px',
      fontWeight: '900',
      color: '#E8A817',
      marginBottom: '20px',
      fontFamily: 'Outfit, sans-serif',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Planos e Preços</h1>
      <p style={styles.subtitle}>Escolha o plano ideal para impulsionar seus negócios</p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.gridPlans}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              ...styles.planCard,
              ...(plan.highlight ? styles.planCardHighlight : {}),
            }}
          >
            <h2 style={styles.planName}>{plan.name}</h2>
            <div style={styles.planPrice}>{plan.price}</div>
            <div style={styles.planDuration}>{plan.duration}</div>

            <ul style={styles.featuresList}>
              {plan.features.map((feature, idx) => (
                <li key={idx} style={styles.feature}>
                  ✓ {feature}
                </li>
              ))}
            </ul>

            <button
              style={{
                ...styles.button,
                ...(plan.disabled ? styles.buttonDisabled : {}),
                ...(plan.loading ? styles.buttonLoading : {}),
              }}
              onClick={() => handlePayment(plan.id)}
              disabled={plan.disabled || plan.loading}
            >
              {plan.loading ? 'Processando...' : plan.cta}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Planos;
