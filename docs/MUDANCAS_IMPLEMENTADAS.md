# MELHORIAS IMPLEMENTADAS NO CADASTRO - TáNaMão Brasil

## 📋 RESUMO DAS ALTERAÇÕES

### 1. ✅ FOTOS OBRIGATÓRIAS NO CADASTRO (STEP 1)

**Problema:** O usuário criava a conta, depois precisava entrar em "perfil" para adicionar fotos, afastando-o do fluxo.

**Solução Implementada:**
- Adicionado campo de **Foto de Perfil** no Step 1
- Adicionado campo de **Foto de Capa** no Step 1
- Campos exibidos em caixa destacada com background diferenciado (priLt)
- Preview em tempo real das fotos antes de submeter
- Validação: ambas as fotos são OBRIGATÓRIAS antes de continuar
- As fotos são enviadas para o Supabase durante o cadastro (junto com outros dados)

**Como ficou:**
```
📸 Suas Fotos
[✓ Preview Foto de Perfil]  ← 80x80px, circular
[✓ Preview Foto de Capa]    ← Full width, 100px height
```

---

### 2. 🔍 BUSCA DE CIDADES POR LETRAS INICIAIS

**Problema:** Select com todas as ~5000 cidades era lento e difícil de navegar.

**Solução Implementada:**
- Substituído `<select>` por campo `<input>` + dropdown dinâmico
- Filtra cidades conforme o usuário digita
- Mostra até 15 sugestões (com scroll se precisar)
- Feedback visual: "✓ Cidade - UF selecionado" em verde quando escolhida
- O UF (estado) é preenchido automaticamente quando a cidade é selecionada

**Como funciona:**
```
Digite: "São"
↓
Sugestões aparecem:
- São Paulo - SP
- São João da Boa Vista - SP
- São Bernardo do Campo - SP
- São Caetano do Sul - SP
...
```

**Lógica:**
```javascript
filteredCities = CIDADES_BRASIL.filter(c =>
  c.nome.toLowerCase().startsWith(citySearch.toLowerCase())
).slice(0, 15);
```

---

### 3. ⚠️ VALIDAÇÃO COMPLETA AO FINALIZAR

**Problema:** Usuário tentava finalizar e recebia erro genérico sem saber qual campo faltava.

**Solução Implementada:**
- Validação reforçada na função `v()` que agora inclui fotos
- Mensagens de erro específicas para cada campo (cor vermelha)
- Cada campo inválido mostra erro inline
- Validação executada ANTES de submeter (step 3 → submit)
- Se algo faltar, o botão não funciona e mostra o erro

**Campos Validados:**
- Nome completo (obrigatório, não vazio)
- Email (formato válido)
- Senha (mínimo 8 caracteres)
- Confirmação de senha (deve combinar)
- WhatsApp (mínimo 10 dígitos)
- Cidade (obrigatório)
- Estado/UF (obrigatório)
- Categorias (mínimo 1 selecionada)
- Bio (mínimo 20 caracteres)
- **[NOVO] Foto de Perfil (obrigatório)**
- **[NOVO] Foto de Capa (obrigatório)**

**Feedback Visual:**
```
❌ Campos com erro: borda vermelha + mensagem em vermelho
✓ Validação passa: continua normalmente
```

---

## 🔧 ALTERAÇÕES TÉCNICAS

### Estado (State)
```javascript
// NOVO: campos adicionados ao estado `f`
profilePhoto: null,              // arquivo da foto de perfil
profilePhotoPreview: null,       // preview em base64
coverPhoto: null,                // arquivo da foto de capa
coverPhotoPreview: null,         // preview em base64

// NOVO: estado para busca de cidades
citySearch: string               // input do usuário
filteredCities: array            // resultado da filtragem
```

### Novas Funções
```javascript
handlePhotoUpload(type, file)    // gerencia upload e preview
```

### Fluxo de Upload
1. User seleciona foto no input
2. `handlePhotoUpload()` lê o arquivo
3. Cria preview (base64) exibido imediatamente
4. Armazena em estado
5. Durante `submit()`, envia para Supabase:
   ```javascript
   await window.SupabaseAPI.uploadProfilePhoto(userId, formData)
   await window.SupabaseAPI.uploadCoverPhoto(userId, formData)
   ```
6. Recebe URLs retornadas e salva no perfil do usuário

---

## 📱 FLUXO DO CADASTRO (NOVO)

### Step 1: Seus Dados + Fotos
```
┌─────────────────────────────────────┐
│  📸 Suas Fotos                      │  ← NOVO: fotos aqui agora
│  [Foto de Perfil] (obrigatório)    │
│  [Foto de Capa] (obrigatório)      │
│                                     │
│  Nome Completo *                    │
│  Email *                            │
│  Senha *                            │
│  Confirmar Senha *                  │
│  WhatsApp *                         │
│  Cidade * (com autocomplete)        │  ← NOVO: busca por letras
│  Estado/UF *                        │
│  Categorias * (até 5)               │
│  Bio * (20-100 chars)               │
│                                     │
│  [Continuar → Escolher Plano]       │
└─────────────────────────────────────┘
```

### Step 2: Escolha do Plano
```
┌─────────────────────────────────────┐
│  Escolha seu plano                  │
│  [START] [IMPULSO] [DESTAQUE]       │
│  [Continuar → Confirmar]            │
└─────────────────────────────────────┘
```

### Step 3: Confirmação
```
┌─────────────────────────────────────┐
│  Confirme seu cadastro              │
│  Seus Dados (review)                │
│  📸 Suas Fotos (preview)            │  ← NOVO: mostra previews
│  Seu Plano                          │
│  [🎉 Finalizar Cadastro]            │
└─────────────────────────────────────┘
```

---

## 🎨 STYLING & UX

### Campos de Foto
- Background destacado: `C.priLt` (verde claro)
- Border em erro: `C.cor` (vermelho)
- Preview dimensionado:
  - Foto de Perfil: 80x80px, circular
  - Foto de Capa: full-width, 100px height

### Dropdown de Cidades
- Posicionamento absoluto abaixo do input
- Max-height com scroll
- Hover effect: background muda para `C.gBg`
- Desaparece quando cidade é selecionada
- Confirmação visual: "✓ Cidade - UF selecionado" em verde

### Feedback de Validação
- Erros em **tempo real** (à medida que o usuário digita, erro desaparece)
- Mensagens específicas para cada campo
- Cor vermelha: `C.cor`
- Fonte pequena: 12px

---

## ⚙️ CONFIGURAÇÃO NO SUPABASE

Para que tudo funcione, você precisa ter no `SupabaseAPI`:

```javascript
uploadProfilePhoto(userId, formData) {
  // Upload da foto de perfil
  // Armazena em bucket 'profiles'
  // Retorna: { url: "caminho/para/foto" }
}

uploadCoverPhoto(userId, formData) {
  // Upload da foto de capa
  // Armazena em bucket 'covers'
  // Retorna: { url: "caminho/para/foto" }
}
```

E no banco de dados, adicione colunas na tabela `professionals`:
```sql
avatar_url TEXT,      -- URL da foto de perfil
cover_photo_url TEXT  -- URL da foto de capa
```

---

## ✨ PRÓXIMOS PASSOS SUGERIDOS

1. **Testar upload de fotos:** Certifique-se de que as URLs retornadas funcionam
2. **Validação de tipo de arquivo:** Aceitar apenas imagens (PNG, JPG, WEBP)
3. **Compressão de imagens:** Reduzir tamanho antes de enviar
4. **Limite de tamanho:** Ex: máximo 5MB por foto
5. **Mensagem pós-cadastro:** Informar que pode melhorar fotos depois em "Perfil"
6. **Recuperação de senha:** Link para mudança de senha (segurança)

---

## 📝 NOTAS IMPORTANTES

- O arquivo foi salvo como `RegisterProfessional_MELHORADO.jsx`
- Substitua o original apenas após testar tudo
- A lista de cidades (`CIDADES_BRASIL`) continua a mesma (apenas cortada no início para brevidade)
- Todas as cores e fontes seguem o design system existente (C.pri, C.cor, font.b, etc)

---

**Última atualização:** 24 de Junho de 2026
