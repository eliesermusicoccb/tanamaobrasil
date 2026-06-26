# CHECKPOINT 009 — URL nova e prévia do WhatsApp

## Objetivo
Corrigir a prévia do link compartilhado no WhatsApp após a mudança da URL oficial para:

https://tanamaobrasilprofissionais.vercel.app/

## Alterações realizadas

1. Atualização das tags de compartilhamento social no arquivo `index.html`.
2. Atualização da URL canônica para o novo endereço.
3. Atualização do `og:url`, `og:image`, `twitter:image` e demais metadados para o novo domínio.
4. Criação de uma nova imagem com nome diferente para evitar cache antigo do WhatsApp:
   `public/og-whatsapp-tanamao-brasil.png`
5. Atualização do link usado no botão de compartilhamento do app, dentro de `src/App.jsx`.

## Observação importante sobre o WhatsApp
O WhatsApp costuma guardar em cache a prévia antiga do link. Mesmo depois da correção, pode demorar um pouco para aparecer a imagem e o texto novos.

Para forçar uma nova leitura, depois do deploy, teste enviando:

https://tanamaobrasilprofissionais.vercel.app/?v=2

Depois de um tempo, o link normal também tende a mostrar a prévia correta.

## Arquivos alterados

- `index.html`
- `src/App.jsx`
- `public/og-whatsapp-tanamao-brasil.png`
- `docs/CHECKPOINT_009_URL_NOVA_WHATSAPP.md`
