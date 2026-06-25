// api/criar-preferencia.js
// Função serverless da Vercel que cria o checkout no Mercado Pago.
// O Access Token fica somente nas variáveis de ambiente do servidor.

import { getPlanoById } from "../src/config/plans.js";

function limparOrigem(origem, host) {
  if (origem && /^https?:\/\//i.test(origem)) return origem.replace(/\/$/, "");
  return `https://${host}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

  if (!accessToken) {
    return res.status(500).json({ erro: "Pagamento não configurado no servidor." });
  }

  try {
    const { plano, profissionalId, email, nome, origem } = req.body || {};
    const planoConfig = getPlanoById(plano);

    if (!planoConfig || !planoConfig.pago) {
      return res.status(400).json({ erro: "Plano inválido." });
    }

    if (!profissionalId || !email) {
      return res.status(400).json({ erro: "Profissional não identificado para pagamento." });
    }

    const base = limparOrigem(origem, req.headers.host);

    const preferencia = {
      items: [
        {
          id: planoConfig.id,
          title: planoConfig.tituloPagamento,
          description: planoConfig.descricao,
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(planoConfig.preco),
        },
      ],
      payer: {
        name: nome || "Profissional TáNaMão Brasil",
        email,
      },
      back_urls: {
        success: `${base}/?pagamento=sucesso`,
        failure: `${base}/?pagamento=erro`,
        pending: `${base}/?pagamento=pendente`,
      },
      auto_return: "approved",
      notification_url: `${base}/api/webhooks/mercadopago`,
      external_reference: `${profissionalId}|${planoConfig.id}|${Date.now()}`,
      metadata: {
        profissional_id: profissionalId,
        plano: planoConfig.id,
      },
      statement_descriptor: "TANAMAOBRASIL",
    };

    const respostaMercadoPago = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferencia),
    });

    const dados = await respostaMercadoPago.json();

    if (!respostaMercadoPago.ok) {
      console.error("Erro Mercado Pago:", dados);
      return res.status(502).json({ erro: "Erro ao criar o pagamento no Mercado Pago." });
    }

    return res.status(200).json({
      init_point: dados.init_point,
      preference_id: dados.id,
    });
  } catch (erro) {
    console.error("Erro na função criar-preferencia:", erro);
    return res.status(500).json({ erro: "Erro interno ao criar o pagamento." });
  }
}
