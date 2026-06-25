// api/webhooks/mercadopago.js
// Recebe notificações do Mercado Pago.
// Por enquanto registra o pagamento e deixa preparado para ativação no Supabase.

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json({ ok: true, rota: "webhook Mercado Pago TáNaMão Brasil" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    console.error("Webhook recebido, mas MERCADOPAGO_ACCESS_TOKEN não está configurado.");
    return res.status(200).json({ ok: true });
  }

  try {
    const payload = req.body || {};
    const paymentId = payload?.data?.id || payload?.id || req.query?.id;
    const tipo = payload?.type || payload?.topic || req.query?.topic;

    if (tipo && tipo !== "payment") {
      return res.status(200).json({ ok: true, ignorado: tipo });
    }

    if (!paymentId) {
      return res.status(200).json({ ok: true, aviso: "Sem paymentId no webhook" });
    }

    const resposta = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const payment = await resposta.json();

    if (!resposta.ok) {
      console.error("Erro ao buscar pagamento no webhook:", payment);
      return res.status(200).json({ ok: true });
    }

    const [profissionalId, plano] = String(payment.external_reference || "").split("|");

    console.log("Webhook Mercado Pago recebido", {
      paymentId: payment.id,
      status: payment.status,
      profissionalId,
      plano,
      valor: payment.transaction_amount,
    });

    // Próximo passo de produção:
    // ativar o plano no Supabase usando SUPABASE_SERVICE_ROLE_KEY.
    // Mantemos o webhook respondendo 200 para o Mercado Pago não reenviar sem necessidade.

    return res.status(200).json({ ok: true });
  } catch (erro) {
    console.error("Erro no webhook Mercado Pago:", erro);
    return res.status(200).json({ ok: true });
  }
}
