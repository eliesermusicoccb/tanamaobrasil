import { useState } from "react";

const ads = [
  {
    id: "agenda",
    title: "Sua agenda\ntá vazia?",
    sub: "A gente lota.",
    desc: "Cadastre-se grátis no TáNaMão Brasil e receba clientes da sua região direto no WhatsApp.",
    cta: "CADASTRE-SE GRÁTIS",
    badge: "7 DIAS GRÁTIS",
    bg: "linear-gradient(145deg, #0C8C5E 0%, #07634A 50%, #064D3A 100%)",
    accent: "#E8A817",
    emoji: "📱",
    stats: "4.832 profissionais já cadastrados",
    format: "Stories"
  },
  {
    id: "concorrente",
    title: "Seus\nconcorrentes\njá estão aqui.",
    sub: "E você?",
    desc: "Eletricistas, pintores, encanadores, diaristas — seus clientes procuram profissionais no TáNaMão todo dia.",
    cta: "CADASTRAR AGORA",
    badge: "GRÁTIS",
    bg: "linear-gradient(145deg, #111827 0%, #1F2937 100%)",
    accent: "#E8573A",
    emoji: "🔥",
    stats: "12.890 serviços solicitados",
    format: "Reels"
  },
  {
    id: "avaliacao",
    title: "⭐⭐⭐⭐⭐",
    sub: "Sua reputação\ntrabalhando\npor você.",
    desc: "Receba avaliações de clientes, monte seu portfólio e seja encontrado por quem precisa.",
    cta: "COMEÇAR GRÁTIS",
    badge: "SEM CARTÃO",
    bg: "linear-gradient(145deg, #E8A817 0%, #D4940F 50%, #B87D0A 100%)",
    accent: "#FFFFFF",
    emoji: "🏆",
    stats: "Nota média dos profissionais: 4.8",
    format: "Feed"
  },
  {
    id: "whatsapp",
    title: "Cliente direto\nno seu\nWhatsApp.",
    sub: "Sem intermediário.",
    desc: "O cliente te encontra, vê seu perfil, suas avaliações e fala direto com você pelo WhatsApp ou chat.",
    cta: "QUERO CLIENTES",
    badge: "100% GRÁTIS",
    bg: "linear-gradient(145deg, #075E54 0%, #128C7E 50%, #25D366 100%)",
    accent: "#FFFFFF",
    emoji: "💬",
    stats: "Contato direto, sem comissão",
    format: "Stories"
  }
];

function AdCard({ ad, selected, onSelect }) {
  return (
    <div onClick={onSelect} style={{
      width: 68, cursor: "pointer", textAlign: "center", opacity: selected ? 1 : 0.5,
      transition: "all .2s", transform: selected ? "scale(1.05)" : "scale(1)"
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: ad.bg, margin: "0 auto 4px",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        border: selected ? "2.5px solid #0C8C5E" : "2px solid transparent"
      }}>{ad.emoji}</div>
      <div style={{ fontSize: 10, fontWeight: 600, color: selected ? "#111827" : "#9CA3AF" }}>{ad.format}</div>
    </div>
  );
}

export default function AdsPreview() {
  const [idx, setIdx] = useState(0);
  const ad = ads[idx];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'DM Sans', sans-serif; background: #F3F4F6; }
      `}</style>
      <div style={{ maxWidth: 480, margin: "0 auto", padding: "20px 16px", minHeight: "100vh" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <h1 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 900, color: "#111827", marginBottom: 4 }}>
            Artes para Tráfego Pago
          </h1>
          <p style={{ fontSize: 13, color: "#6B7280" }}>TáNaMão Brasil — Lançamento SP</p>
        </div>

        {/* Ad Selector */}
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 20 }}>
          {ads.map((a, i) => <AdCard key={a.id} ad={a} selected={i === idx} onSelect={() => setIdx(i)} />)}
        </div>

        {/* Phone Mockup */}
        <div style={{
          width: 300, margin: "0 auto", borderRadius: 36, overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2), 0 0 0 8px #1F2937",
          background: "#1F2937", padding: "8px"
        }}>
          {/* Notch */}
          <div style={{ display: "flex", justifyContent: "center", paddingBottom: 6 }}>
            <div style={{ width: 80, height: 24, borderRadius: 12, background: "#111827" }} />
          </div>

          {/* Ad Content */}
          <div key={ad.id} style={{
            borderRadius: 28, overflow: "hidden", background: ad.bg,
            minHeight: 520, position: "relative", display: "flex", flexDirection: "column",
            animation: "fadeIn .4s ease"
          }}>
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
            <div style={{ position: "absolute", bottom: -60, left: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

            {/* Instagram header simulation */}
            <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
                <svg width="18" height="18" viewBox="0 0 120 120" fill="none"><rect width="120" height="120" rx="28" fill="rgba(255,255,255,0.3)"/></svg>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>tanamaobrasil</div>
                <div style={{ fontSize: 9, color: "rgba(255,255,255,0.6)" }}>Patrocinado</div>
              </div>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", position: "relative" }}>
              {/* Badge */}
              <div style={{
                display: "inline-flex", alignSelf: "flex-start",
                background: ad.accent, color: ad.accent === "#FFFFFF" ? "#111827" : "#fff",
                padding: "5px 14px", borderRadius: 8, fontSize: 11, fontWeight: 800,
                fontFamily: "'Outfit'", letterSpacing: "0.04em", marginBottom: 16
              }}>{ad.badge}</div>

              {/* Emoji */}
              <div style={{ fontSize: 48, marginBottom: 12 }}>{ad.emoji}</div>

              {/* Title */}
              <h2 style={{
                fontFamily: "'Outfit'", fontSize: 34, fontWeight: 900, color: "#fff",
                lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 8,
                whiteSpace: "pre-line"
              }}>{ad.title}</h2>

              {/* Subtitle */}
              <div style={{
                fontFamily: "'Outfit'", fontSize: 22, fontWeight: 700,
                color: ad.accent, marginBottom: 16, whiteSpace: "pre-line", lineHeight: 1.15
              }}>{ad.sub}</div>

              {/* Description */}
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.55, marginBottom: 20 }}>{ad.desc}</p>

              {/* Stats bar */}
              <div style={{
                background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 14px",
                fontSize: 12, color: "rgba(255,255,255,0.9)", fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6, marginBottom: 16
              }}>
                <span>📊</span> {ad.stats}
              </div>
            </div>

            {/* CTA Button */}
            <div style={{ padding: "0 24px 24px" }}>
              <div style={{
                background: ad.accent === "#FFFFFF" ? "#fff" : ad.accent,
                color: ad.accent === "#FFFFFF" ? "#111827" : "#fff",
                padding: "16px", borderRadius: 14, textAlign: "center",
                fontFamily: "'Outfit'", fontSize: 15, fontWeight: 800,
                letterSpacing: "0.02em"
              }}>{ad.cta}</div>
            </div>

            {/* Swipe up hint */}
            <div style={{ textAlign: "center", paddingBottom: 16 }}>
              <div style={{ fontSize: 18, opacity: 0.5, animation: "bounce 2s infinite" }}>⌃</div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Arraste para cima</div>
            </div>
          </div>
        </div>

        {/* Ad Details Below */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginTop: 20,
          border: "1.5px solid #E5E7EB"
        }}>
          <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 800, marginBottom: 12, color: "#111827" }}>
            Detalhes do Anúncio #{idx + 1}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { l: "Formato", v: ad.format },
              { l: "Plataforma", v: "Instagram + Facebook" },
              { l: "Objetivo", v: "Cadastro (Conversão)" },
              { l: "Público", v: "25-55 anos, SP" },
            ].map((d, i) => (
              <div key={i} style={{ background: "#F3F4F6", borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{d.l}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#111827", marginTop: 2 }}>{d.v}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Copy do anúncio</div>
            <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, background: "#F9FAFB", borderRadius: 10, padding: 12 }}>
              {ad.desc} {ad.stats}. {ad.badge}. Baixe agora o TáNaMão Brasil.
            </div>
          </div>
        </div>

        {/* Dimensions guide */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginTop: 12,
          border: "1.5px solid #E5E7EB"
        }}>
          <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 800, marginBottom: 12, color: "#111827" }}>
            Dimensões para Exportação
          </h3>
          <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.8 }}>
            <div><strong>Stories/Reels:</strong> 1080 × 1920px (9:16)</div>
            <div><strong>Feed quadrado:</strong> 1080 × 1080px (1:1)</div>
            <div><strong>Feed paisagem:</strong> 1200 × 628px (1.91:1)</div>
            <div><strong>Carrossel:</strong> 1080 × 1080px por card</div>
            <div style={{ marginTop: 8, color: "#9CA3AF", fontSize: 11 }}>Exporte cada arte em PNG ou JPG com qualidade máxima.</div>
          </div>
        </div>
      </div>
    </>
  );
}
