# SQL SUGERIDO — Avaliações e planos

Este arquivo é uma sugestão para a próxima etapa. Execute no Supabase apenas depois de revisar.

## 1. Colunas úteis em professionals

```sql
ALTER TABLE professionals
ADD COLUMN IF NOT EXISTS rating NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS reviews INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'gratis',
ADD COLUMN IF NOT EXISTS badge TEXT,
ADD COLUMN IF NOT EXISTS cover_photo_url TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;
```

## 2. Tabela de avaliações

```sql
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_id UUID NOT NULL,
  client_name TEXT NOT NULL,
  client_whatsapp TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
```

## 3. Índice para buscar avaliações rápido

```sql
CREATE INDEX IF NOT EXISTS reviews_professional_id_idx
ON reviews (professional_id);
```

## 4. Atualizar nota média manualmente

Depois que uma nova avaliação entrar, a média do profissional precisa ser recalculada. Uma versão simples:

```sql
UPDATE professionals p
SET
  rating = sub.avg_rating,
  reviews = sub.total_reviews
FROM (
  SELECT
    professional_id,
    ROUND(AVG(rating)::numeric, 1) AS avg_rating,
    COUNT(*) AS total_reviews
  FROM reviews
  GROUP BY professional_id
) sub
WHERE p.id = sub.professional_id;
```

## Observação importante

A avaliação deve ser real. O plano pago pode dar destaque, mas não pode comprar nota. A nota precisa vir do cliente.
