# 🚨 CORREÇÃO URGENTE DO REPOSITÓRIO

## Passo 1: Deletar Arquivos Problemáticos

No seu terminal (na pasta do projeto), execute:

```bash
git rm --cached ESTRATEGIA_CONVERSAO_v1.md
git rm --cached GUIA_REGISTRO_PROFISSIONAL.md
git rm --cached estrategia-marketing-SP.md
git rm --cached roteiros-video-ads.md
git rm --cached ads-tanamao-SP.jsx
git rm --cached landing-page-tanamao.html
git rm --cached supabase-schema.sql
git rm --cached TaNaMao-Brasil.jsx
git rm --cached vite_config.js
```

## Passo 2: Substituir Arquivos Principais

Copie do `/outputs` para seu projeto:

1. **src/App.jsx** ← Use `App_COMPLETO_COM_REGISTRO.jsx` (renomeie para App.jsx)
2. **src/RegisterProfessional.jsx** ← Copie inteiro
3. **vite.config.js** ← Copie para RAIZ (não em src/)
4. **package.json** ← Use o novo (copie do outputs)
5. **.gitignore** ← Copie do outputs

## Passo 3: Verificar Estrutura

A pasta deve ter EXATAMENTE isto:

```
tanamaobrasil/
├── .gitignore
├── README.md
├── index.html
├── package.json
├── vite.config.js          (SEM underscore!)
├── src/
│   ├── main.jsx
│   ├── App.jsx             (renomeado de App_COMPLETO_COM_REGISTRO.jsx)
│   └── RegisterProfessional.jsx
└── (nada mais)
```

## Passo 4: Fazer Commit

```bash
git add .
git commit -m "Fix: corrigir estrutura do projeto e remover arquivos desnecessários"
git push
```

## Passo 5: Verificar se Build Passou

Vá para Vercel e espere o build completar. Deve passar! ✅

---

## ⚠️ IMPORTANTE

Se o build AINDA falhar, execute no terminal:

```bash
npm install
npm run build
```

E copie a **MENSAGEM DE ERRO COMPLETA** para corrigi-la.
