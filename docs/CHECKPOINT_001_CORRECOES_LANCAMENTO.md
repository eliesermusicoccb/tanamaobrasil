# CHECKPOINT 001 — Correções iniciais para lançamento do TáNaMão Brasil

Data do checkpoint: 2026-06-25

## Contexto do projeto

O TáNaMão Brasil é um marketplace de profissionais e empresas. A lógica principal é:

1. O cliente entra no app.
2. Busca um profissional por profissão, cidade ou nome.
3. Visualiza o perfil do profissional.
4. Confere nota, avaliações e informações.
5. Chama o profissional direto pelo WhatsApp.
6. O profissional se cadastra para aparecer na plataforma.
7. Depois pode assinar um plano pago para ganhar mais destaque.

O objetivo de lançamento é cadastrar o máximo possível de profissionais, começando com uma entrada simples e de baixo atrito: cadastro gratuito primeiro, plano pago depois.

## Decisões estratégicas mantidas

- O app precisa valorizar avaliações e nota do profissional.
- A nota deve aparecer na lista, no perfil e nos cards.
- O cadastro gratuito é importante para atrair os primeiros profissionais.
- Os planos pagos devem ser vendidos como aumento de visibilidade, não como barreira para entrar.
- O Mercado Pago deve ficar seguro: token privado nunca no frontend.

## Correções feitas nesta etapa

### 1. Planos centralizados

Foi criado o arquivo:

`src/config/plans.js`

Agora os planos ficam em uma fonte única:

- Grátis
- Pro
- Premium

Isso evita o problema antigo de cada tela ter nomes e preços diferentes.

### 2. Tela de planos melhorada

Arquivo ajustado:

`src/App.jsx`

A tela de planos agora usa os planos centralizados e mostra melhor a promessa:

- Aparecer mais para clientes da região.
- Plano pago aumenta visibilidade.
- Avaliação continua sendo dos clientes.

### 3. Serviço do Mercado Pago mais seguro

Arquivo ajustado:

`src/services/mercadopago-service.js`

Melhorias:

- O frontend não envia preço como verdade final.
- O servidor valida o plano.
- Erros aparecem com mensagem mais clara.
- O app só tenta pagamento se o profissional estiver logado e identificado.

### 4. API do Mercado Pago corrigida

Arquivos ajustados:

- `api/criar-preferencia.js`
- `api/verify-payment.js`
- `api/webhooks/mercadopago.js`
- `api/Payments.js`

Melhorias:

- Removida dependência de axios.
- Removida rota antiga baseada em Express.
- Webhook deixou de ter código de frontend dentro da pasta API.
- A rota oficial para pagamento agora é `/api/criar-preferencia`.

### 5. Cadastro do profissional ajustado para lançamento

Arquivo ajustado:

`src/RegisterProfessional.jsx`

Melhorias:

- O plano padrão agora é o Grátis.
- A mensagem incentiva o profissional a entrar primeiro e assinar depois.
- Corrigido upload de foto de perfil e capa usando `uploadProfessionalMedia`.
- Planos do cadastro agora usam a mesma fonte dos demais planos.

### 6. Avaliação ficou mais visível

Arquivo ajustado:

`src/App.jsx`

Melhorias:

- Criado badge de nota do profissional.
- Criado resumo de avaliação no perfil.
- Profissional sem avaliação aparece como “Novo sem avaliações”.
- A avaliação passa a ser tratada como pilar de confiança do app.

### 7. Segurança de variáveis de ambiente

Criado arquivo:

`.env.example`

Importante:

- `.env.local` não deve ser enviado em ZIP público.
- `MERCADOPAGO_ACCESS_TOKEN` deve ser configurado na Vercel.
- Não usar `VITE_MERCADOPAGO_ACCESS_TOKEN`, porque qualquer variável `VITE_` pode ir para o navegador.

## Resultado de teste técnico

Foi executado:

`npm install`

Depois:

`npm run build`

Resultado:

Build concluído com sucesso.

## Próximo passo recomendado

Antes de tráfego pago, testar manualmente:

1. Abrir o app localmente.
2. Fazer cadastro de profissional novo.
3. Verificar se foto de perfil sobe.
4. Verificar se foto de capa sobe.
5. Verificar se profissional aparece na busca.
6. Entrar no perfil e conferir se nota/avaliações aparecem.
7. Ir em Conta > Planos.
8. Clicar em Assinar Pro ou Premium.
9. Conferir se abre Mercado Pago.

## Próximo checkpoint sugerido

Depois do teste manual, criar o CHECKPOINT 002 com:

- Resultado dos testes.
- Erros encontrados.
- Prints das telas.
- Próximas correções.
