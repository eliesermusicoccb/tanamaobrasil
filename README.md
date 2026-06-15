# TáNaMão Brasil

**Marketplace de Profissionais** — Conectando quem precisa de um serviço a profissionais qualificados da sua região.

## Sobre

TáNaMão Brasil é uma plataforma que permite:

- **Profissionais** se cadastrarem e receberem clientes
- **Empresas** divulgarem seus serviços
- **Clientes** buscarem e contratarem profissionais por categoria, localização e avaliação

## Stack

- **React 18** — Interface de usuário
- **Vite 6** — Build tool
- **CSS-in-JS** — Estilos inline com design system integrado

Sem dependências externas de UI. Zero configuração de CSS frameworks.

## Rodar localmente

```bash
git clone https://github.com/seu-usuario/tanamao-brasil.git
cd tanamao-brasil
npm install
npm run dev
```

Acesse `http://localhost:3000`

## Build para produção

```bash
npm run build
```

Os arquivos estáticos serão gerados em `dist/`.

## Deploy

### Vercel (recomendado)

1. Importe o repositório no [vercel.com](https://vercel.com)
2. O `vercel.json` já está configurado
3. Deploy automático a cada push

### Netlify

1. Importe o repositório no [netlify.com](https://netlify.com)
2. O `netlify.toml` já está configurado
3. Deploy automático a cada push

## Estrutura

```
tanamao-brasil/
├── public/
│   ├── logo-icon.svg          # Logo ícone (favicon)
│   └── logo-full.svg          # Logo completo horizontal
├── src/
│   ├── main.jsx               # Entry point React
│   └── App.jsx                # Aplicativo completo
├── docs/
│   └── brand-guide.html       # Manual de identidade visual
├── index.html                 # HTML base
├── package.json
├── vite.config.js
├── vercel.json                # Config Vercel
└── netlify.toml               # Config Netlify
```

## Telas

| Tela | Descrição |
|------|-----------|
| Home | Banner rotativo, busca, categorias, destaques |
| Categorias | Grid com 18 categorias |
| Busca | Lista de profissionais com filtros |
| Perfil | Avaliações, portfólio, contato, WhatsApp |
| Chat | Lista de conversas + chat individual |
| Notificações | Feed de atividade |
| Planos | Free / Pro / Premium |
| Cadastro | Fluxo em 3 etapas (profissional, empresa, cliente) |
| Anuncie | Pacotes de banner publicitário |
| Configurações | Perfil, assinatura, preferências |

## Identidade Visual

| Elemento | Valor |
|----------|-------|
| Cor primária | `#0C8C5E` (Verde Petróleo) |
| Cor accent | `#E8A817` (Âmbar Ouro) |
| Cor CTA | `#E8573A` (Coral Ação) |
| Fonte display | Outfit (800, 900) |
| Fonte body | DM Sans (400–700) |

Manual completo em `docs/brand-guide.html`.

## Monetização

- **Plano Free** — R$ 0/mês (perfil básico, 10 chats/mês)
- **Plano Pro** — R$ 29,90/mês (destaque, selo, chat ilimitado)
- **Plano Premium** — R$ 69,90/mês (1º nas buscas, banner incluso)
- **Banner Publicitário** — R$ 49,90 (semanal) a R$ 349,90 (trimestral)

## Licença

Projeto proprietário. Todos os direitos reservados.
