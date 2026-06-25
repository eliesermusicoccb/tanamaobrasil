# PASSO A PASSO — Testar o TáNaMão Brasil localmente

Este guia é para testar o app sem complicar.

## 1. Instalar dependências

No terminal, dentro da pasta do projeto, rode:

```bash
npm install
```

## 2. Criar o arquivo de ambiente

Copie o arquivo:

`.env.example`

E crie um novo chamado:

`.env.local`

Preencha suas chaves reais nele.

Atenção: não envie `.env.local` para ninguém.

## 3. Rodar o app

Para abrir o app no computador:

```bash
npm run dev
```

Depois abra o link que aparecer no terminal.

## 4. Testar cadastro

Faça o teste como se fosse um profissional real:

1. Clique em cadastrar.
2. Preencha nome, email, senha e WhatsApp.
3. Escolha cidade, categoria, foto de perfil e foto de capa.
4. Escolha o plano Grátis.
5. Finalize o cadastro.

## 5. Testar busca

Depois do cadastro:

1. Vá na tela Buscar.
2. Procure pelo nome ou categoria.
3. Abra o perfil.
4. Veja se aparece WhatsApp, nota e avaliação.

## 6. Testar planos

Para testar pagamento local com função da Vercel, o ideal é rodar:

```bash
vercel dev
```

Se rodar apenas `npm run dev`, a tela pode abrir, mas a rota `/api/criar-preferencia` pode não funcionar igual ao ambiente da Vercel.

## 7. Variáveis importantes na Vercel

Configure na Vercel:

```env
MERCADOPAGO_ACCESS_TOKEN=seu_token_privado
```

No frontend, só use chaves públicas com `VITE_`.
