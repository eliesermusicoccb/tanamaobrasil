// src/services/mercadopago-service.js
// Inicia o pagamento: pede ao servidor (função no Vercel) para criar a
// preferência no Mercado Pago e redireciona o usuário para o checkout oficial.
// O segredo (Access Token) NUNCA fica aqui no frontend — fica só no servidor.

const PLANOS = {
  pro: {
    titulo: "Plano Pro - TáNaMão Brasil",
    preco: 29.90,
    descricao: "Destaque nas buscas, selo verificado e chat ilimitado por 30 dias",
  },
  premium: {
    titulo: "Plano Premium - TáNaMão Brasil",
    preco: 69.90,
    descricao: "1º lugar nas buscas, banner incluso e suporte prioritário por 30 dias",
  },
};

export async function iniciarPagamento(plano, profissional) {
  const config = PLANOS[plano];
  if (!config) throw new Error("Plano inválido");

  const resposta = await fetch("/api/criar-preferencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plano,
      titulo: config.titulo,
      preco: config.preco,
      descricao: config.descricao,
      profissionalId: profissional?.id || "",
      email: profissional?.email || "",
      nome: profissional?.name || "",
      origem: window.location.origin,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível iniciar o pagamento.");
  }

  const dados = await resposta.json();
  if (!dados.init_point) {
    throw new Error("Resposta inválida do servidor de pagamento.");
  }

  // Leva o usuário para a tela de pagamento do Mercado Pago
  window.location.href = dados.init_point;
}
