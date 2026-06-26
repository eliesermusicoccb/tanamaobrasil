# CHECKPOINT 008 — WhatsApp e logo redondo

## Objetivo
Melhorar a apresentação do link do TáNaMão Brasil quando ele for enviado pelo WhatsApp e corrigir o logo para não aparecer com fundo quadrado em espaços redondos do app.

## O que foi alterado

1. Prévia do link no WhatsApp
   - Atualização das tags sociais no `index.html`.
   - Título do link: TáNaMão Brasil.
   - Descrição convidando profissional, empresa ou loja a se cadastrar gratuitamente.
   - Nova imagem de compartilhamento com identidade do app.

2. Imagem de compartilhamento
   - Criado/atualizado o arquivo `public/og-tanamao-brasil-share.png`.
   - A imagem tem 1200x630, formato recomendado para prévia em WhatsApp e redes sociais.
   - O texto reforça cadastro gratuito, clientes da região, WhatsApp e avaliações.

3. Logo redondo
   - Atualizado `public/logo-icon.svg` para ter fundo circular.
   - Atualizado `public/logo-full.svg` para usar o ícone circular.
   - Atualizados os ícones do app:
     - `public/icon-192.png`
     - `public/icon-512.png`
     - `public/apple-touch-icon.png`
   - A área externa do logo foi deixada transparente para evitar aparência de quadrado dentro de espaços redondos.

4. Botão de compartilhamento
   - Adicionado botão “Compartilhar no WhatsApp” na Home, no bloco voltado para profissionais.
   - O botão já abre o WhatsApp com uma mensagem pronta para convidar profissionais, empresas ou lojas.

## Arquivos alterados

- `index.html`
- `src/App.jsx`
- `public/logo-icon.svg`
- `public/logo-full.svg`
- `public/icon-192.png`
- `public/icon-512.png`
- `public/apple-touch-icon.png`
- `public/og-tanamao-brasil.png`
- `public/og-tanamao-brasil-share.png`
- `docs/CHECKPOINT_008_WHATSAPP_LOGO_REDONDO.md`

## Observação importante sobre WhatsApp
O WhatsApp pode guardar a prévia antiga em cache. Por isso, a nova prévia usa o arquivo `og-tanamao-brasil-share.png`, com novo endereço de imagem.

Depois do deploy:
1. Aguarde a Vercel finalizar.
2. Envie o link para uma conversa nova.
3. Se ainda aparecer antigo, aguarde alguns minutos e teste novamente.

## Mensagem usada no botão de compartilhamento
TáNaMão Brasil

Profissional, empresa ou loja: cadastre seu serviço gratuitamente e apareça para clientes da sua região.

O cliente encontra seu perfil, vê avaliações e chama você direto no WhatsApp.

Cadastre-se grátis: https://tanamaobrasil-wine.vercel.app/
