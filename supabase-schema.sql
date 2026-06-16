-- ══════════════════════════════════════════════════════════════
-- TáNaMão Brasil — Schema Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ══════════════════════════════════════════════════════════════

-- 1. USUÁRIOS (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('profissional', 'empresa', 'cliente')),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  cpf_cnpj TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  emergency_24h BOOLEAN DEFAULT FALSE,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  plan_expires_at TIMESTAMPTZ,
  views_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CATEGORIAS
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  is_custom BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inserir categorias padrão
INSERT INTO categories (name, icon) VALUES
  ('Encanador', '🔧'), ('Eletricista', '⚡'), ('Pintor', '🎨'),
  ('Pedreiro', '🏗️'), ('Cabeleireiro', '💇'), ('Técnico TI', '📱'),
  ('Mecânico', '🚗'), ('Fotógrafo', '📸'), ('Diarista', '🧹'),
  ('Enfermeiro(a)', '👩‍⚕️'), ('Arquiteto', '📐'), ('Chef', '🍳'),
  ('Marceneiro', '🪚'), ('Ar Condicionado', '❄️'), ('Chaveiro', '🔒'),
  ('Jardineiro', '🌿'), ('Pet Care', '🐕'), ('Músico', '🎶');

-- 3. PROFISSIONAL <-> CATEGORIAS (N:N)
CREATE TABLE profile_categories (
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (profile_id, category_id)
);

-- 4. REDES SOCIAIS
CREATE TABLE social_links (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'linkedin', 'tiktok', 'youtube', 'website')),
  handle TEXT NOT NULL,
  UNIQUE(profile_id, platform)
);

-- 5. AVALIAÇÕES
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  reviewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reviewed_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_moderated BOOLEAN DEFAULT FALSE,
  is_flagged BOOLEAN DEFAULT FALSE,
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. MENSAGENS (Chat)
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICAÇÕES
CREATE TABLE notifications (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('message', 'review', 'trial', 'plan', 'system', 'promo')),
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. ASSINATURAS / PAGAMENTOS
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('pro', 'premium')),
  payment_method TEXT,
  payment_id TEXT,
  amount DECIMAL(10,2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  starts_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. BANNERS PUBLICITÁRIOS
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT,
  package TEXT CHECK (package IN ('weekly', 'monthly', 'quarterly')),
  amount DECIMAL(10,2),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  impressions INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. DENÚNCIAS / MODERAÇÃO
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  reported_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'blocked')),
  resolved_by UUID REFERENCES profiles(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. VISUALIZAÇÕES DE PERFIL
CREATE TABLE profile_views (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════════════════
CREATE INDEX idx_profiles_city ON profiles(city);
CREATE INDEX idx_profiles_plan ON profiles(plan);
CREATE INDEX idx_profiles_type ON profiles(type);
CREATE INDEX idx_profiles_emergency ON profiles(emergency_24h) WHERE emergency_24h = TRUE;
CREATE INDEX idx_reviews_reviewed ON reviews(reviewed_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, is_read);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_profile_views_profile ON profile_views(profile_id);

-- ══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ══════════════════════════════════════════════════════════════
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: público para leitura, privado para escrita
CREATE POLICY "Profiles visíveis para todos" ON profiles FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Usuário edita próprio perfil" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Messages: só remetente e destinatário
CREATE POLICY "Mensagens próprias" ON messages FOR SELECT USING (auth.uid() IN (sender_id, receiver_id));
CREATE POLICY "Enviar mensagens" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Reviews: público para leitura
CREATE POLICY "Reviews visíveis" ON reviews FOR SELECT USING (is_flagged = FALSE);
CREATE POLICY "Criar review" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Notifications: só próprias
CREATE POLICY "Notificações próprias" ON notifications FOR SELECT USING (auth.uid() = user_id);

-- ══════════════════════════════════════════════════════════════
-- FUNCTIONS
-- ══════════════════════════════════════════════════════════════

-- Incrementar views ao visitar perfil
CREATE OR REPLACE FUNCTION increment_views(p_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles SET views_count = views_count + 1 WHERE id = p_id;
  INSERT INTO profile_views (profile_id, viewer_id) VALUES (p_id, auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calcular média de avaliação
CREATE OR REPLACE FUNCTION get_avg_rating(p_id UUID)
RETURNS NUMERIC AS $$
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0) FROM reviews WHERE reviewed_id = p_id AND is_flagged = FALSE;
$$ LANGUAGE sql STABLE;

-- Notificar trial expirando (chamar via cron/edge function)
CREATE OR REPLACE FUNCTION notify_trial_expiring()
RETURNS VOID AS $$
BEGIN
  INSERT INTO notifications (user_id, type, title, body)
  SELECT id, 'trial',
    'Trial expira em ' || EXTRACT(DAY FROM trial_end - NOW())::int || ' dia(s)',
    'Assine agora para manter os recursos Pro.'
  FROM profiles
  WHERE trial_end IS NOT NULL
    AND trial_end > NOW()
    AND trial_end <= NOW() + INTERVAL '5 days'
    AND plan = 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
