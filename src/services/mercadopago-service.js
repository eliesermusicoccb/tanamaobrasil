// src/services/mercadopago-service.js
// Inicia o pagamento pedindo ao servidor para criar o checkout no Mercado Pago.
// Regra importante: o preço NÃO é confiado ao navegador. O servidor valida o plano.

import { getPlanoById } from "../config/plans.js";

export async function iniciarPagamento(plano, profissional) {
  const config = getPlanoById(plano);

  if (!config || !config.pago) {
    throw new Error("Plano inválido para pagamento.");
  }

  if (!profissional?.id || !profissional?.email) {
    throw new Error("Usuário não identificado. Entre novamente na sua conta e tente assinar de novo.");
  }

  const resposta = await fetch("/api/criar-preferencia", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      plano,
      profissionalId: profissional.id,
      email: profissional.email,
      nome: profissional.name || profissional.email,
      origem: window.location.origin,
    }),
  });

  let dados = null;

  try {
    dados = await resposta.json();
  } catch (erro) {
    throw new Error("A API de pagamento não retornou uma resposta válida.");
  }

  if (!resposta.ok) {
    throw new Error(dados?.erro || "Não foi possível iniciar o pagamento.");
  }

  if (!dados?.init_point) {
    throw new Error("O Mercado Pago não retornou o link de checkout.");
  }

  window.location.href = dados.init_point;
}
