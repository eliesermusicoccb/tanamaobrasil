# CHECKPOINT 003 — Correção de instalação do npm na Vercel

## Problema encontrado

Durante o deploy na Vercel, a etapa de instalação de dependências falhou com a mensagem:

```txt
npm error Exit handler never called!
Error: Command "npm install" exited with 1
```

Esse erro aconteceu antes do build do aplicativo. Ou seja: não foi erro da tela de planos nem erro do React. Foi uma falha na etapa em que a Vercel tenta baixar as dependências do projeto.

## Causa provável corrigida

O arquivo `package-lock.json` estava com links de pacotes apontando para um registro interno usado no ambiente onde o checkpoint foi preparado. Isso poderia causar instabilidade ou travamento no deploy da Vercel.

Neste checkpoint, o `package-lock.json` foi corrigido para usar o registro público oficial do npm:

```txt
https://registry.npmjs.org/
```

Também foi criado o arquivo `.npmrc` para forçar o uso do registro público oficial do npm durante o deploy.

## Arquivos alterados

```txt
package-lock.json
.npmrc
docs/CHECKPOINT_003_CORRECAO_NPM_VERCEL.md
```

## O que fazer no GitHub

1. Substituir o arquivo `package-lock.json` no repositório.
2. Enviar o novo arquivo `.npmrc` para a raiz do projeto.
3. Enviar este arquivo de documentação para a pasta `docs`.
4. Fazer commit com a mensagem:

```txt
Checkpoint 003 - correção npm Vercel
```

## Resultado esperado

A Vercel deve conseguir instalar as dependências e continuar o deploy normalmente.
