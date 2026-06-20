// src/pages/PaymentStatus.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const status = searchParams.get('status');
  const paymentId = searchParams.get('payment_id');
  const preferenceId = searchParams.get('preference_id');
  const externalReference = searchParams.get('external_reference');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const processPaymentStatus = async () => {
      try {
        // Notificar seu backend sobre o status do pagamento
        const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId,
            preferenceId,
            externalReference,
            status,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessage(data.message || 'Processando pagamento...');
        }
      } catch (error) {
        console.error('Erro ao verificar pagamento:', error);
      } finally {
        setLoading(false);
      }
    };

    if (paymentId || preferenceId) {
      processPaymentStatus();
    } else {
      setLoading(false);
    }
  }, [paymentId, preferenceId, status, externalReference]);

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f5f5f5',
      fontFamily: 'DM Sans, sans-serif',
    },
    card: {
      background: '#fff',
      borderRadius: '12px',
      padding: '60px 40px',
      textAlign: 'center',
      maxWidth: '500px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    success: {
      borderTop: '4px solid #0C8C5E',
    },
    error: {
      borderTop: '4px solid #E8573A',
    },
    pending: {
      borderTop: '4px solid #E8A817',
    },
    icon: {
      fontSize: '60px',
      marginBottom: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: '900',
      marginBottom: '12px',
      fontFamily: 'Outfit, sans-serif',
    },
    titleSuccess: {
      color: '#0C8C5E',
    },
    titleError: {
      color: '#E8573A',
    },
    titlePending: {
      color: '#E8A817',
    },
    message: {
      fontSize: '16px',
      color: '#666',
      marginBottom: '30px',
      lineHeight: '1.6',
    },
    details: {
      background: '#f9f9f9',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '30px',
      fontSize: '14px',
      color: '#777',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'center',
      flexWrap: 'wrap',
    },
    button: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s',
    },
    buttonPrimary: {
      background: '#0C8C5E',
      color: '#fff',
    },
    buttonSecondary: {
      background: '#eee',
      color: '#333',
    },
    spinner: {
      display: 'inline-block',
      width: '40px',
      height: '40px',
      border: '4px solid #f3f3f3',
      borderTop: '4px solid #0C8C5E',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ ...styles.card, ...styles.pending }}>
          <div style={styles.spinner}></div>
          <h2 style={{ ...styles.title, ...styles.titlePending }}>Processando...</h2>
          <p style={styles.message}>Estamos verificando seu pagamento</p>
        </div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const pageConfig = {
    approved: {
      style: styles.success,
      icon: '✓',
      title: 'Pagamento Aprovado!',
      titleStyle: styles.titleSuccess,
      message: 'Seu plano foi ativado com sucesso. Aproveite todos os benefícios!',
      primaryButton: 'Ir para Dashboard',
      primaryAction: () => navigate('/dashboard'),
      secondaryButton: 'Voltar ao Início',
      secondaryAction: () => navigate('/'),
    },
    failure: {
      style: styles.error,
      icon: '✕',
      title: 'Pagamento Recusado',
      titleStyle: styles.titleError,
      message: 'Não conseguimos processar seu pagamento. Verifique os dados e tente novamente.',
      primaryButton: 'Tentar Novamente',
      primaryAction: () => navigate('/planos'),
      secondaryButton: 'Suporte',
      secondaryAction: () => window.open('https://wa.me/1133334444', '_blank'),
    },
    pending: {
      style: styles.pending,
      icon: '⏳',
      title: 'Pagamento Pendente',
      titleStyle: styles.titlePending,
      message: 'Seu pagamento está sendo processado. Você receberá uma confirmação em breve.',
      primaryButton: 'Ir para Dashboard',
      primaryAction: () => navigate('/dashboard'),
      secondaryButton: 'Verificar Status',
      secondaryAction: () => navigate('/'),
    },
  };

  const config = pageConfig[status] || pageConfig.pending;

  return (
    <div style={styles.container}>
      <div style={{ ...styles.card, ...config.style }}>
        <div style={styles.icon}>{config.icon}</div>
        <h2 style={{ ...styles.title, ...config.titleStyle }}>{config.title}</h2>
        <p style={styles.message}>{config.message}</p>

        {paymentId && (
          <div style={styles.details}>
            <strong>ID do Pagamento:</strong> {paymentId}
          </div>
        )}

        <div style={styles.buttonGroup}>
          <button
            style={{ ...styles.button, ...styles.buttonPrimary }}
            onClick={config.primaryAction}
          >
            {config.primaryButton}
          </button>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={config.secondaryAction}
          >
            {config.secondaryButton}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
