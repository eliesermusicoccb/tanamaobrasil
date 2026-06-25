// api/verify-payment.js
// Verifica status de pagamento no Mercado Pago sem depender de axios.

const STATUS_MESSAGES = {
  approved: "Pagamento confirmado! Seu plano foi ativado.",
  rejected: "Pagamento recusado. Tente outro método de pagamento.",
  pending: "Pagamento pendente. Você receberá uma confirmação em breve.",
  cancelled: "Pagamento cancelado.",
  in_process: "Pagamento em análise.",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    return res.status(500).json({ erro: "Pagamento não configurado no servidor." });
  }

  try {
    const { paymentId } = req.body || {};

    if (!paymentId) {
      return res.status(400).json({ erro: "paymentId obrigatório" });
    }

    const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const payment = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro ao consultar pagamento:", payment);
      return res.status(502).json({ erro: "Erro ao consultar pagamento no Mercado Pago." });
    }

    return res.status(200).json({
      status: payment.status,
      message: STATUS_MESSAGES[payment.status] || "Status desconhecido",
      paymentId: payment.id,
      amount: payment.transaction_amount,
      date: payment.date_created,
      external_reference: payment.external_reference,
    });
  } catch (erro) {
    console.error("Erro ao verificar pagamento:", erro);
    return res.status(500).json({ erro: "Erro interno ao verificar pagamento." });
  }
}
