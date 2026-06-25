// Fonte única dos planos do TáNaMão Brasil.
// Mantendo tudo em um arquivo só, evitamos preço diferente em telas diferentes.

export const PLANOS_TANAMAO = {
  gratis: {
    id: "gratis",
    nome: "Grátis",
    tituloPagamento: "Cadastro Grátis - TáNaMão Brasil",
    preco: 0,
    periodo: "/mês",
    destaque: false,
    recomendado: false,
    pago: false,
    badge: null,
    descricao: "Para começar a aparecer na plataforma sem pagar nada.",
    cta: "Começar grátis",
    feats: [
      "Perfil público na plataforma",
      "WhatsApp visível para clientes",
      "Aparece nas buscas",
      "Recebe avaliações de clientes",
      "Até 5 fotos no perfil",
    ],
    restrictions: [
      "Menor prioridade nas buscas",
      "Sem selo verificado",
      "Sem banner de destaque",
    ],
    photoLimit: 5,
    videoLimit: 0,
    cityLimit: 1,
  },

  pro: {
    id: "pro",
    nome: "Pro",
    tituloPagamento: "Plano Pro - TáNaMão Brasil",
    preco: 29.90,
    periodo: "/mês",
    destaque: false,
    recomendado: true,
    pago: true,
    badge: "pro",
    descricao: "Destaque nas buscas, selo verificado e mais confiança para receber contatos.",
    cta: "Assinar Pro",
    feats: [
      "Destaque nas buscas",
      "Selo verificado no perfil",
      "WhatsApp em evidência",
      "Recebe avaliações de clientes",
      "Até 10 fotos no perfil",
      "Até 3 cidades de atendimento",
    ],
    photoLimit: 10,
    videoLimit: 1,
    cityLimit: 3,
  },

  premium: {
    id: "premium",
    nome: "Premium",
    tituloPagamento: "Plano Premium - TáNaMão Brasil",
    preco: 69.90,
    periodo: "/mês",
    destaque: true,
    recomendado: false,
    pago: true,
    badge: "premium",
    descricao: "Mais visibilidade para profissionais que querem aparecer no topo e vender mais.",
    cta: "Assinar Premium",
    feats: [
      "Prioridade máxima nas buscas",
      "Banner publicitário incluso",
      "Selo Premium no perfil",
      "WhatsApp em evidência",
      "Recebe avaliações de clientes",
      "Suporte prioritário",
      "Cidades de atendimento ampliadas",
    ],
    photoLimit: 15,
    videoLimit: 3,
    cityLimit: 999,
  },
};

export const PLANOS_CADASTRO = Object.values(PLANOS_TANAMAO);
export const PLANOS_PAGOS = Object.values(PLANOS_TANAMAO).filter((plano) => plano.pago);

export function getPlanoById(id) {
  return PLANOS_TANAMAO[id] || null;
}

export function formatarPrecoPlano(valor) {
  const numero = Number(valor || 0);
  if (numero === 0) return "R$ 0,00";
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}
