// api/Payments.js
// Rota antiga mantida apenas para não quebrar chamadas antigas.
// A rota oficial de pagamento agora é /api/criar-preferencia.

export default async function handler(req, res) {
  return res.status(410).json({
    erro: "Rota antiga. Use /api/criar-preferencia para iniciar pagamento.",
  });
}
