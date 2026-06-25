// Fonte única dos planos do TáNaMão Brasil.
// Tudo que envolve nome, preço, benefícios e limites dos planos fica aqui.
// Assim evitamos uma tela mostrar um preço e outra tela mostrar outro.

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
    descricao: "Para entrar na plataforma, criar seu perfil e começar a ser encontrado.",
    cta: "Começar grátis",
    feats: [
      "Perfil público na plataforma",
      "WhatsApp visível para clientes",
      "Aparece nas buscas da sua cidade",
      "Recebe avaliações de clientes",
      "Até 5 fotos no perfil",
      "Atendimento em 1 cidade",
    ],
    restrictions: [
      "Menor prioridade nas buscas",
      "Sem selo de destaque",
      "Sem banner na Home",
    ],
    photoLimit: 5,
    videoLimit: 0,
    cityLimit: 1,
  },

  impulso: {
    id: "impulso",
    nome: "Impulso",
    tituloPagamento: "Plano Impulso - TáNaMão Brasil",
    preco: 19.90,
    periodo: "/mês",
    destaque: false,
    recomendado: true,
    pago: true,
    badge: "impulso",
    descricao: "Para quem quer sair do básico e aparecer com mais força para clientes da região.",
    cta: "Assinar Impulso",
    feats: [
      "Mais prioridade nas buscas",
      "Selo Impulso no perfil",
      "WhatsApp em evidência",
      "Avaliações dos clientes em destaque",
      "Até 10 fotos no perfil",
      "Atendimento em até 3 cidades",
    ],
    photoLimit: 10,
    videoLimit: 1,
    cityLimit: 3,
  },

  destaque: {
    id: "destaque",
    nome: "Destaque",
    tituloPagamento: "Plano Destaque - TáNaMão Brasil",
    preco: 49.90,
    periodo: "/mês",
    destaque: true,
    recomendado: false,
    pago: true,
    badge: "destaque",
    descricao: "Para profissionais e empresas que querem máxima visibilidade e mais confiança antes do cliente chamar.",
    cta: "Assinar Destaque",
    feats: [
      "Prioridade máxima nas buscas",
      "Espaço de destaque na Home",
      "Selo Destaque no perfil",
      "WhatsApp em evidência",
      "Avaliações dos clientes em destaque",
      "Suporte prioritário",
      "Atendimento em cidades ampliadas",
      "Até 15 fotos e até 3 vídeos no perfil",
    ],
    photoLimit: 15,
    videoLimit: 3,
    cityLimit: 999,
  },
};

// Mantém compatibilidade com nomes antigos, caso algum cadastro antigo ainda tenha pro/premium.
export const PLANOS_COMPATIBILIDADE = {
  pro: PLANOS_TANAMAO.impulso,
  premium: PLANOS_TANAMAO.destaque,
  start: PLANOS_TANAMAO.gratis,
};

export const PLANOS_CADASTRO = Object.values(PLANOS_TANAMAO);
export const PLANOS_PAGOS = Object.values(PLANOS_TANAMAO).filter((plano) => plano.pago);

export function getPlanoById(id) {
  const chave = String(id || "gratis").toLowerCase();
  return PLANOS_TANAMAO[chave] || PLANOS_COMPATIBILIDADE[chave] || null;
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
