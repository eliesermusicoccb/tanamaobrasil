# CHECKPOINT 002 — Ajuste visual da tela de planos

## Situação
Após subir o Checkpoint 001 no GitHub/Vercel, o deploy demorou cerca de 7 minutos, mas foi aprovado.

O print enviado mostrou que a nova tela de planos já apareceu corretamente com os planos Pro e Premium, porém o menu inferior do aplicativo ficava por cima da parte de baixo da tela. Isso poderia atrapalhar o clique no botão de assinatura, principalmente em celular com tela menor.

## Correção aplicada
Foi ajustado o arquivo:

- `src/App.jsx`

## O que mudou

1. O menu inferior do aplicativo agora fica oculto nas telas de decisão importante:
   - `planos`
   - `editar perfil`

2. A tela de planos ganhou mais espaço livre, deixando o usuário focado na assinatura.

3. O espaçamento geral das telas foi ajustado para evitar que o menu inferior cubra botões ou textos em outras partes do app.

## Por que isso é importante
A tela de planos é uma tela de conversão. O profissional precisa olhar, entender e clicar em assinar sem distração.

Em telas como planos e edição de perfil, o menu inferior pode atrapalhar. O botão de voltar no topo já é suficiente para navegação.

## Resultado esperado
Depois de subir este checkpoint:

- A tela de planos não deve mais mostrar o menu inferior.
- O botão do plano Premium deve ficar acessível ao rolar a tela.
- A página deve parecer mais limpa e mais focada em assinatura.
- O deploy deve continuar passando normalmente.

## Teste realizado
O comando `npm run build` foi executado com sucesso antes de gerar este ZIP.

## Próximo passo recomendado
Depois de subir este checkpoint no GitHub e a Vercel concluir o deploy, testar:

1. Abrir a tela de planos.
2. Ver se o menu inferior sumiu nesta tela.
3. Rolar até o final e verificar se o botão Premium aparece corretamente.
4. Clicar em Assinar Pro e Assinar Premium para validar se abre o fluxo do Mercado Pago.
