// src/components/Planos.jsx
// Componente alternativo de planos. A tela principal hoje está em App.jsx,
// mas mantemos este arquivo correto para não quebrar builds futuros.

import React, { useState } from 'react';
import { iniciarPagamento } from '../services/mercadopago-service.js';
import { PLANOS_CADASTRO, formatarPrecoPlano } from '../config/plans.js';

const Planos = ({ userId, userEmail, userName }) => {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const handlePayment = async (planId) => {
    const plan = PLANOS_CADASTRO.find((item) => item.id === planId);

    if (!plan?.pago) return;

    try {
      setLoading(planId);
      setError('');
      await iniciarPagamento(planId, {
        id: userId,
        email: userEmail,
        name: userName,
      });
    } catch (err) {
      setError(err?.message || 'Erro ao iniciar pagamento. Tente novamente.');
      console.error('Erro:', err);
      setLoading(null);
    }
  };

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
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
    },
    planCard: {
      border: '2px solid #eee',
      borderRadius: '14px',
      padding: '32px 26px',
      textAlign: 'center',
      background: '#fff',
      transition: 'all 0.3s',
    },
    planCardHighlight: {
      borderColor: '#0C8C5E',
      background: '#f0faf8',
      boxShadow: '0 10px 40px rgba(12, 140, 94, 0.15)',
    },
    planName: {
      fontSize: '24px',
      fontWeight: '800',
      marginBottom: '10px',
      color: '#1a1a1a',
      fontFamily: 'Outfit, sans-serif',
    },
    planPrice: {
      fontSize: '34px',
      fontWeight: '900',
      color: '#0C8C5E',
      marginBottom: '5px',
      fontFamily: 'Outfit, sans-serif',
    },
    planDuration: {
      fontSize: '14px',
      color: '#999',
      marginBottom: '24px',
    },
    featuresList: {
      listStyle: 'none',
      padding: '0',
      marginBottom: '26px',
      textAlign: 'left',
    },
    feature: {
      padding: '9px 0',
      color: '#555',
      fontSize: '14px',
      borderBottom: '1px solid #f0f0f0',
    },
    button: {
      width: '100%',
      padding: '14px 24px',
      borderRadius: '10px',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      background: '#0C8C5E',
      color: '#fff',
    },
    buttonDisabled: {
      background: '#ccc',
      cursor: 'not-allowed',
      opacity: 0.7,
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Planos e Preços</h1>
      <p style={styles.subtitle}>Cadastre-se grátis e assine um plano quando quiser aparecer mais.</p>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.gridPlans}>
        {PLANOS_CADASTRO.map((plan) => {
          const isLoading = loading === plan.id;
          return (
            <div
              key={plan.id}
              style={{
                ...styles.planCard,
                ...(plan.destaque || plan.recomendado ? styles.planCardHighlight : {}),
              }}
            >
              <h2 style={styles.planName}>{plan.nome}</h2>
              <div style={styles.planPrice}>{formatarPrecoPlano(plan.preco)}</div>
              <div style={styles.planDuration}>{plan.periodo}</div>

              <ul style={styles.featuresList}>
                {plan.feats.map((feature, idx) => (
                  <li key={idx} style={styles.feature}>✓ {feature}</li>
                ))}
              </ul>

              <button
                style={{
                  ...styles.button,
                  ...(!plan.pago || isLoading ? styles.buttonDisabled : {}),
                }}
                onClick={() => handlePayment(plan.id)}
                disabled={!plan.pago || isLoading}
              >
                {isLoading ? 'Processando...' : plan.pago ? plan.cta : 'Plano grátis'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Planos;
