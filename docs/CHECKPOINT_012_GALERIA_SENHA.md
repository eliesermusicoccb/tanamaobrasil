# CHECKPOINT 012 — Galeria no perfil e alteração de senha

## O que foi corrigido

### 1. Galeria no perfil público
A tela do perfil do profissional agora busca o perfil completo no Supabase ao abrir.

Com isso, as fotos salvas em `gallery_photos` passam a aparecer no perfil público em uma grade de imagens.

Se o profissional ainda não tiver fotos, o app mostra uma mensagem simples informando que o perfil ainda não adicionou fotos dos serviços.

### 2. Perfil atualizado com dados reais
Ao abrir o perfil, o app agora tenta atualizar:
- foto principal;
- categoria;
- biografia;
- fotos da galeria;
- avaliações;
- selo/badge.

Isso evita que o perfil abra com dados antigos ou incompletos vindos de outro ponto da navegação.

### 3. Alteração de senha
Foi adicionado um botão em:

Perfil > Segurança > Alterar senha

O usuário pode criar uma nova senha. Após trocar a senha, ele é enviado para o login novamente, por segurança.

## Arquivo alterado

- `src/App.jsx`

## Observação importante sobre banco de dados

Para a galeria funcionar, a tabela `professionals` precisa ter a coluna `gallery_photos`.

Se algum erro aparecer dizendo que a coluna não existe, rode este SQL no Supabase:

```sql
alter table professionals
add column if not exists gallery_photos jsonb default '[]'::jsonb;
```

Também é recomendado que o bucket `professional-media` esteja público ou com política de leitura liberada, para que as imagens apareçam no app.

## Teste técnico

O build foi testado com sucesso usando:

```bash
npm run build
```
