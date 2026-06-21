// api/criar-preferencia.js
// Função serverless (Vercel) que cria a preferência de pagamento no Mercado Pago.
// O Access Token é lido das variáveis de ambiente do Vercel — NUNCA fica no código.
// Variável necessária no Vercel:  MERCADOPAGO_ACCESS_TOKEN

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ erro: "Método não permitido" });
  }

  const ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!ACCESS_TOKEN) {
    return res.status(500).json({ erro: "Pagamento não configurado no servidor." });
  }

  try {
    const { plano, titulo, preco, descricao, profissionalId, email, nome, origem } = req.body || {};

    const base = origem || `https://${req.headers.host}`;

    const preferencia = {
      items: [
        {
          title: titulo || "Assinatura TáNaMão Brasil",
          description: descricao || "",
          quantity: 1,
          currency_id: "BRL",
          unit_price: Number(preco),
        },
      ],
      payer: {
        name: nome || "Cliente",
        email: email || "",
      },
      back_urls: {
        success: `${base}/?pagamento=sucesso`,
        failure: `${base}/?pagamento=erro`,
        pending: `${base}/?pagamento=pendente`,
      },
      auto_return: "approved",
      external_reference: `${profissionalId}|${plano}|${Date.now()}`,
      statement_descriptor: "TANAMAOBRASIL",
    };

    const r = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferencia),
    });

    const dados = await r.json();

    if (!r.ok) {
      console.error("Erro Mercado Pago:", dados);
      return res.status(502).json({ erro: "Erro ao criar o pagamento no Mercado Pago." });
    }

    return res.status(200).json({
      init_point: dados.init_point,
      preference_id: dados.id,
    });
  } catch (e) {
    console.error("Erro na função criar-preferencia:", e);
    return res.status(500).json({ erro: "Erro interno ao criar o pagamento." });
  }
}
