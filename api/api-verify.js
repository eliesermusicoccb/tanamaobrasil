// api/verify-payment.js - Verificar status do pagamento

import axios from 'axios';

const MP_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MP_API_URL = 'https://api.mercadopago.com';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { paymentId } = req.body;

    if (!paymentId) {
      return res.status(400).json({ error: 'paymentId obrigatório' });
    }

    // Buscar detalhes do pagamento
    const response = await axios.get(
      `${MP_API_URL}/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        },
      }
    );

    const payment = response.data;

    const statusMessages = {
      approved: 'Pagamento confirmado! Seu plano foi ativado.',
      rejected: 'Pagamento recusado. Tente outro método de pagamento.',
      pending: 'Pagamento pendente. Você receberá uma confirmação em breve.',
      cancelled: 'Pagamento foi cancelado.',
    };

    res.status(200).json({
      status: payment.status,
      message: statusMessages[payment.status] || 'Status desconhecido',
      paymentId: payment.id,
      amount: payment.transaction_amount,
      date: payment.date_created,
    });
  } catch (error) {
    console.error('Erro ao verificar pagamento:', error);
    res.status(500).json({ 
      error: 'Erro ao verificar pagamento',
      details: error.message,
    });
  }
}
