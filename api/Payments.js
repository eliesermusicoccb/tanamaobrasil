// backend/routes/payments.js

const express = require('express');
const router = express.Router();
const axios = require('axios');

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MP_API_URL = 'https://api.mercadopago.com';

// 1. Criar preferência de pagamento
router.post('/create-preference', async (req, res) => {
  try {
    const { preference, plan, userId } = req.body;

    const response = await axios.post(
      `${MP_API_URL}/checkout/preferences`,
      preference,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      preferenceId: response.data.id,
      initPoint: response.data.init_point,
    });
  } catch (error) {
    console.error('Erro ao criar preferência:', error);
    res.status(500).json({ error: 'Erro ao criar preferência de pagamento' });
  }
});

// 2. Webhook para receber notificação de pagamento
router.post('/webhooks/mercadopago', async (req, res) => {
  try {
    const { type, data } = req.body;

    if (type !== 'payment') {
      return res.sendStatus(200);
    }

    const paymentId = data.id;

    // Buscar detalhes do pagamento
    const paymentResponse = await axios.get(
      `${MP_API_URL}/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = paymentResponse.data;
    const externalReference = payment.external_reference; // userId-plan-timestamp
    const status = payment.status; // approved, rejected, pending, cancelled

    // Parse da referência
    const [userId, plan] = externalReference.split('-');

    // Aqui você atualiza o banco de dados do usuário
    // Exemplo:
    if (status === 'approved') {
      // UPDATE user SET plan = 'pro', planExpires = DATE_ADD(NOW(), INTERVAL 30 DAY) WHERE id = userId
      console.log(`✓ Pagamento aprovado para usuário ${userId}, plano ${plan}`);
      
      // Salvar pagamento no DB
      // await savePayment({ userId, plan, paymentId, status, amount: payment.transaction_amount });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro no webhook MercadoPago:', error);
    res.sendStatus(500);
  }
});

// 3. Verificar status do pagamento
router.post('/verify', async (req, res) => {
  try {
    const { paymentId, preferenceId, status } = req.body;

    let paymentData = null;

    if (paymentId) {
      const response = await axios.get(
        `${MP_API_URL}/v1/payments/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
          },
        }
      );
      paymentData = response.data;
    }

    // Retornar status e mensagem
    const statusMessages = {
      approved: 'Pagamento confirmado! Seu plano foi ativado.',
      rejected: 'Pagamento recusado. Tente outro método.',
      pending: 'Pagamento pendente. Você receberá uma confirmação em breve.',
      cancelled: 'Pagamento cancelado.',
    };

    res.json({
      status: paymentData?.status || status,
      message: statusMessages[paymentData?.status || status] || 'Status desconhecido',
      paymentData,
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({ error: 'Erro ao verificar pagamento' });
  }
});

module.exports = router;
