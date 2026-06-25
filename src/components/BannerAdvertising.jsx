import { useState, useEffect } from "react";

// Cores do design system
const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

/**
 * Componente Banner para exibição de publicidade na home
 * Busca banner ativo no Supabase e exibe com CTA
 */
export default function BannerAdvertising() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clicks, setClicks] = useState(0);

  useEffect(() => {
    fetchActiveBanner();
  }, []);

  const fetchActiveBanner = async () => {
    try {
      if (!window.SupabaseAPI) {
        console.warn("SupabaseAPI não disponível");
        setLoading(false);
        return;
      }

      window.SupabaseAPI.initSupabase();

      // Busca banner ativo (data início <= hoje <= data fim)
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await window.SupabaseAPI.client
        .from("banners")
        .select("*")
        .eq("active", true)
        .lte("date_start", today)
        .gte("date_end", today)
        .limit(1)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 = nenhuma linha encontrada (normal)
        console.error("Erro ao buscar banner:", error);
      }

      if (data) {
        setBanner(data);
      }
    } catch (err) {
      console.error("Erro ao carregar banner:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerClick = async () => {
    if (!banner) return;

    try {
      // Registra clique no banco
      await window.SupabaseAPI.client
        .from("banner_clicks")
        .insert([
          {
            banner_id: banner.id,
            clicked_at: new Date().toISOString(),
            user_agent: navigator.userAgent,
          },
        ]);

      setClicks(clicks + 1);

      // Abre link externo
      if (banner.cta_link) {
        window.open(banner.cta_link, "_blank");
      }
    } catch (err) {
      console.error("Erro ao registrar clique:", err);
    }
  };

  // Não renderiza se não há banner ou está carregando
  if (loading || !banner) {
    return null;
  }

  return (
    <div
      style={{
        width: "100%",
        height: 120,
        background: banner.background_color || C.priLt,
        borderRadius: 12,
        marginBottom: 20,
        padding: 16,
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
        transition: "all 0.3s ease",
        border: `2px solid ${banner.border_color || C.pri}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
      onClick={handleBannerClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
      }}
    >
      {/* IMAGEM */}
      {banner.image_url && (
        <img
          src={banner.image_url}
          alt={banner.title}
          style={{
            width: 80,
            height: 80,
            borderRadius: 8,
            objectFit: "cover",
          }}
        />
      )}

      {/* CONTEÚDO (TEXTO + CTA) */}
      <div style={{ flex: 1 }}>
        {banner.title && (
          <div
            style={{
              fontFamily: font.d,
              fontSize: 16,
              fontWeight: 800,
              color: banner.text_color || C.dk,
              marginBottom: 6,
            }}
          >
            {banner.title}
          </div>
        )}

        {banner.description && (
          <div
            style={{
              fontFamily: font.b,
              fontSize: 13,
              color: banner.text_color || C.g,
              marginBottom: 8,
              lineHeight: 1.4,
            }}
          >
            {banner.description}
          </div>
        )}

        {banner.cta_text && (
          <div
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: banner.cta_color || C.pri,
              color: "#fff",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              fontFamily: font.b,
            }}
          >
            {banner.cta_text} →
          </div>
        )}
      </div>

      {/* ÍCONE DE DESTAQUE (opcional) */}
      {banner.icon && (
        <div style={{ fontSize: 40, lineHeight: 1 }}>{banner.icon}</div>
      )}
    </div>
  );
}
