# 🎪 IMPLEMENTAÇÃO DE BANNERS - GUIA COMPLETO

## 📊 BANCO DE DADOS (Supabase)

### 1. Criar tabela `banners`

```sql
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  cta_text VARCHAR(100) DEFAULT 'Saiba mais',
  cta_link VARCHAR(500) NOT NULL,
  cta_color VARCHAR(7) DEFAULT '#0C8C5E',
  background_color VARCHAR(7) DEFAULT '#E6F5EF',
  border_color VARCHAR(7) DEFAULT '#0C8C5E',
  text_color VARCHAR(7) DEFAULT '#111827',
  icon VARCHAR(10) DEFAULT '📢',
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_banners_active ON banners(active);
CREATE INDEX idx_banners_date ON banners(date_start, date_end);
```

### 2. Criar tabela `banner_clicks` (Analytics)

```sql
CREATE TABLE banner_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  banner_id UUID NOT NULL REFERENCES banners(id) ON DELETE CASCADE,
  clicked_at TIMESTAMP DEFAULT NOW(),
  user_agent TEXT
);

-- Índice para queries rápidas
CREATE INDEX idx_banner_clicks_banner_id ON banner_clicks(banner_id);
CREATE INDEX idx_banner_clicks_date ON banner_clicks(clicked_at);
```

### 3. RLS (Row Level Security) - Opcional mas recomendado

```sql
-- Banners: públicos para leitura, admin para escrita
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Banners públicos" ON banners
  FOR SELECT USING (true);

CREATE POLICY "Admin apenas" ON banners
  FOR ALL USING (
    auth.uid() = (
      SELECT id FROM professionals 
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Banner clicks: apenas insert, sem read direto
ALTER TABLE banner_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas insert" ON banner_clicks
  FOR INSERT WITH CHECK (true);
```

---

## 🔧 INTEGRAÇÃO NO FRONTEND

### 1. Adicionar BannerAdvertising na Home

**Arquivo: `src/App.jsx` ou onde estiver a home**

```javascript
import BannerAdvertising from "./components/BannerAdvertising.jsx";

export default function Home() {
  return (
    <div>
      {/* ... outros componentes ... */}
      
      {/* BANNER AQUI - logo após header, antes da lista de profissionais */}
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "0 16px" }}>
        <BannerAdvertising />
      </div>

      {/* Lista de profissionais */}
      {/* ... */}
    </div>
  );
}
```

### 2. Admin Panel (Acesso restrito)

**Arquivo: `src/pages/AdminBanners.jsx`**

```javascript
// Apenas acesso de admin (proteger com autenticação)
import AdminBanners from "../pages/AdminBanners.jsx";

// Na rota:
<Route path="/admin/banners" element={<AdminBanners />} />
```

**Proteção recomendada:**
```javascript
function ProtectedAdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await window.SupabaseAPI.client.auth.getUser();
      
      if (!user) {
        window.location.href = "/login";
        return;
      }

      // Verifica se é admin
      const { data } = await window.SupabaseAPI.client
        .from("professionals")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      setIsAdmin(data?.is_admin || false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (!isAdmin) return <div>Acesso negado</div>;

  return children;
}
```

---

## 💾 ATUALIZAR TABELA `professionals`

Adicionar coluna para marcar admins:

```sql
ALTER TABLE professionals ADD COLUMN is_admin BOOLEAN DEFAULT false;
```

---

## 📋 COMO USAR (Operacional)

### Criar um novo banner

1. Acesse `/admin/banners`
2. Clique em "+ Novo Banner"
3. Preencha os campos:
   - **Título**: "Plano ELITE - 50% off" (255 chars max)
   - **Descrição**: "Domine as pesquisas com nosso plano premium" (texto)
   - **Link CTA**: `https://tanamao.com.br/upgrade`
   - **Data Início**: `2026-06-24`
   - **Data Fim**: `2026-07-07`
   - **Cores**: customize conforme marca (CTA, background, texto)
   - **Emoji**: 📢, 💎, 🔥, etc
4. Clique em "Criar Banner"
5. Banner aparece automaticamente na home quando ativo

### Editar banner

1. Clique em "Editar" no banner que quer alterar
2. Modifique os campos necessários
3. Clique em "Atualizar Banner"

### Pausar/Ativar banner

- Clique em "Desativar" para remover da home temporariamente
- Clique em "Ativar" para exibir novamente
- *(Alternativa: edite as datas para pausar automaticamente)*

### Remover banner

- Clique em "Remover" para deletar permanentemente
- Estatísticas de cliques também são removidas

### Ver estatísticas

- Cada banner mostra "👆 X cliques" em tempo real
- Dados armazenados em `banner_clicks`

---

## 📊 ANALYTICS AVANÇADO (Opcional)

Para dashboard mais detalhado, adicione query ao admin:

```javascript
const getDetailedStats = async (bannerId) => {
  const { data } = await window.SupabaseAPI.client
    .from("banner_clicks")
    .select("clicked_at, user_agent")
    .eq("banner_id", bannerId)
    .order("clicked_at", { ascending: false });

  // Processar dados:
  // - Cliques por hora/dia
  // - Dispositivos (mobile/desktop)
  // - Taxa de conversão (se integrar com evento de upgrade)
};
```

---

## 🎨 EXEMPLOS DE BANNERS PRONTOS

### 1. Promoção ELITE
```
Título: "Domine as buscas com ELITE"
Descrição: "Topo garantido + Relatórios + Suporte VIP"
Link: https://tanamao.com.br/upgrade/elite
Emoji: 💎
Cor CTA: #0C8C5E (verde)
Background: #E6F5EF
```

### 2. Trial PROFISSIONAL
```
Título: "15 dias grátis no PROFISSIONAL"
Descrição: "Sem cartão. Sem compromisso. Cancele quando quiser."
Link: https://tanamao.com.br/upgrade/professional
Emoji: ⭐
Cor CTA: #E8A817 (dourado)
Background: #FEF7E0
```

### 3. Parceria/Patrocínio
```
Título: "Seguros para profissionais"
Descrição: "Proteção completa. Taxa especial para TáNaMão"
Link: https://parceiro.com.br/tanamao
Emoji: 🛡️
Imagem: Logo do parceiro
```

---

## ⚙️ FLUXO TÉCNICO RESUMIDO

```
1. User acessa Home
        ↓
2. BannerAdvertising.jsx monta
        ↓
3. useEffect busca banner ativo no Supabase
   - Filtro: date_start ≤ today ≤ date_end
   - Filtro: active = true
        ↓
4. Se encontrou, renderiza com preview da imagem
        ↓
5. User clica no banner
        ↓
6. handleBannerClick() executa:
   - Insere clique em banner_clicks (analytics)
   - Abre link externo em nova aba
        ↓
7. Cada clique é rastreado e contabilizado
```

---

## 🚨 TROUBLESHOOTING

**Banner não aparece na home?**
- ✅ Confirme `active = true` no banco
- ✅ Confirme datas (date_start ≤ hoje ≤ date_end)
- ✅ Verifique SupabaseAPI está inicializado

**Cliques não registram?**
- ✅ Tabela `banner_clicks` existe e está vazia?
- ✅ RLS está bloqueando INSERT?
- ✅ Abra console (F12) para ver erros

**Admin panel não abre?**
- ✅ Confirme is_admin = true para seu usuário
- ✅ Verifique rota `/admin/banners` está mapeada

---

## 📝 RESUMO DOS ARQUIVOS

| Arquivo | Função |
|---------|--------|
| `BannerAdvertising.jsx` | Componente que exibe banner na home |
| `AdminBanners.jsx` | Dashboard admin para gerenciar banners |
| `MUDANCAS_IMPLEMENTADAS.md` | Docs dos planos novos (Básico/Profissional/Elite) |
| `RegisterProfessional_MELHORADO.jsx` | Cadastro com fotos + novos nomes de planos |

---

**Status:** ✅ Pronto para produção
**Última atualização:** 24 de Junho de 2026
