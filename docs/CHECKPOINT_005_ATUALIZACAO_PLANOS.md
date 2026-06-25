# CHECKPOINT 005 — Atualização dos planos do TáNaMão Brasil

## Objetivo
Atualizar nomes, preços e textos dos planos para uma comunicação mais simples e mais adequada ao lançamento do app.

## Nova estrutura de planos

### Grátis — R$ 0,00/mês
Para o profissional entrar na plataforma, criar perfil e começar a ser encontrado.

Inclui:
- Perfil público na plataforma
- WhatsApp visível para clientes
- Aparece nas buscas da cidade
- Recebe avaliações de clientes
- Até 5 fotos no perfil
- Atendimento em 1 cidade

### Impulso — R$ 19,90/mês
Para quem quer sair do básico e aparecer com mais força para clientes da região.

Inclui:
- Mais prioridade nas buscas
- Selo Impulso no perfil
- WhatsApp em evidência
- Avaliações dos clientes em destaque
- Até 10 fotos no perfil
- Atendimento em até 3 cidades

### Destaque — R$ 49,90/mês
Para profissionais e empresas que querem máxima visibilidade e mais confiança antes do cliente chamar.

Inclui:
- Prioridade máxima nas buscas
- Espaço de destaque na Home
- Selo Destaque no perfil
- WhatsApp em evidência
- Avaliações dos clientes em destaque
- Suporte prioritário
- Atendimento em cidades ampliadas
- Até 15 fotos e até 3 vídeos no perfil

## Arquivos alterados
- src/config/plans.js
- src/App.jsx
- src/RegisterProfessional.jsx
- src/Subscriptionmanager.js
- src/components/TrialBanner.jsx
- src/paymentManager.js
- docs/CHECKPOINT_005_ATUALIZACAO_PLANOS.md

## Observações importantes
- Os planos antigos Pro e Premium foram mantidos apenas como compatibilidade técnica, para evitar erro caso algum cadastro antigo ainda tenha esses nomes salvos.
- A tela pública passa a exibir Impulso e Destaque.
- O cadastro profissional passa a oferecer Grátis, Impulso e Destaque.
- O Mercado Pago continua pegando preço do servidor pela configuração central dos planos, evitando alteração de preço pelo navegador.

## Teste técnico
O comando `npm run build` foi executado e passou com sucesso neste checkpoint.
