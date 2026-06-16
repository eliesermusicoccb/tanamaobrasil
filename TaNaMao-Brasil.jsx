import { useState, useEffect, useRef } from "react";

// ─── DESIGN SYSTEM ─────────────────────────────────────────
// Cores: Verde-petróleo (confiança), Âmbar (Brasil/premium), Coral (ação)
// Fontes: Outfit (display), DM Sans (body)
// Psicologia: verde = crescimento/confiança, âmbar = valor/calor, coral = urgência/CTA

const COLORS = {
  primary: "#0C8C5E",
  primaryDark: "#07634A",
  primaryLight: "#E6F5EF",
  accent: "#E8A817",
  accentLight: "#FEF7E0",
  coral: "#E8573A",
  coralLight: "#FEF0ED",
  dark: "#111827",
  darkSoft: "#1F2937",
  gray: "#6B7280",
  grayLight: "#9CA3AF",
  grayBorder: "#E5E7EB",
  grayBg: "#F3F4F6",
  white: "#FFFFFF",
};

const PLANS = [
  {
    name: "Free",
    price: "R$ 0",
    period: "/mês",
    color: COLORS.primary,
    bg: COLORS.primaryLight,
    features: [
      "Perfil básico com foto",
      "Até 3 categorias de serviço",
      "Receber avaliações",
      "Aparecer nas buscas",
      "Chat com clientes (limite 10/mês)",
    ],
    cta: "Começar Grátis",
    popular: false,
  },
  {
    name: "Pro",
    price: "R$ 29,90",
    period: "/mês",
    color: COLORS.coral,
    bg: COLORS.coralLight,
    features: [
      "Tudo do Free +",
      "Destaque nas buscas",
      "Categorias ilimitadas",
      "Chat ilimitado",
      "Selo 'Pro' no perfil",
      "Portfólio com até 20 fotos",
      "Relatório de visualizações",
    ],
    cta: "Assinar Pro",
    popular: true,
  },
  {
    name: "Premium",
    price: "R$ 69,90",
    period: "/mês",
    color: COLORS.accent,
    bg: COLORS.accentLight,
    features: [
      "Tudo do Pro +",
      "1º lugar nas buscas da região",
      "Selo 'Premium' verificado",
      "Portfólio ilimitado + vídeo",
      "Link para WhatsApp/site",
      "Suporte prioritário",
      "Anúncio em banner rotativo",
      "Dashboard de métricas avançadas",
    ],
    cta: "Assinar Premium",
    popular: false,
  },
];

const CATEGORIES = [
  { icon: "🔧", name: "Encanador", count: 342 },
  { icon: "⚡", name: "Eletricista", count: 289 },
  { icon: "🎨", name: "Pintor", count: 415 },
  { icon: "🏗️", name: "Pedreiro", count: 523 },
  { icon: "💇", name: "Cabeleireiro", count: 678 },
  { icon: "📱", name: "Técnico TI", count: 234 },
  { icon: "🚗", name: "Mecânico", count: 456 },
  { icon: "📸", name: "Fotógrafo", count: 312 },
  { icon: "🧹", name: "Diarista", count: 891 },
  { icon: "👩‍⚕️", name: "Enfermeiro(a)", count: 187 },
  { icon: "📐", name: "Arquiteto", count: 156 },
  { icon: "🍳", name: "Chef/Cozinheiro", count: 267 },
];

const PROFESSIONALS = [
  { name: "Carlos Silva", role: "Eletricista", rating: 4.9, reviews: 127, city: "São Paulo, SP", price: "A partir de R$ 80", badge: "premium", avatar: "CS", available: true },
  { name: "Ana Oliveira", role: "Designer de Interiores", rating: 4.8, reviews: 89, city: "Rio de Janeiro, RJ", price: "A partir de R$ 150", badge: "pro", avatar: "AO", available: true },
  { name: "Roberto Santos", role: "Encanador", rating: 4.7, reviews: 203, city: "Belo Horizonte, MG", price: "A partir de R$ 60", badge: "premium", avatar: "RS", available: false },
  { name: "Mariana Costa", role: "Fotógrafa", rating: 5.0, reviews: 56, city: "Curitiba, PR", price: "A partir de R$ 200", badge: "pro", avatar: "MC", available: true },
  { name: "João Pereira", role: "Pintor Residencial", rating: 4.6, reviews: 178, city: "Salvador, BA", price: "A partir de R$ 70", badge: null, avatar: "JP", available: true },
  { name: "Fernanda Lima", role: "Cabeleireira", rating: 4.9, reviews: 312, city: "Brasília, DF", price: "A partir de R$ 50", badge: "pro", avatar: "FL", available: true },
];

const BANNERS = [
  { title: "Eletricista 24h", subtitle: "JM Serviços Elétricos — Atendimento de emergência em SP", bg: "linear-gradient(135deg, #0C8C5E 0%, #07634A 100%)", label: "Anúncio" },
  { title: "Reformas & Acabamentos", subtitle: "Construtora Horizonte — Orçamento grátis para sua obra", bg: "linear-gradient(135deg, #E8A817 0%, #D4940F 100%)", label: "Anúncio" },
  { title: "Seja Premium!", subtitle: "Apareça primeiro nas buscas e conquiste mais clientes", bg: "linear-gradient(135deg, #E8573A 0%, #C9432A 100%)", label: "TáNaMão" },
];

// ─── LOGO COMPONENT ────────────────────────────────────────
function Logo({ size = 40, white = false }) {
  const c1 = white ? "#FFFFFF" : COLORS.primary;
  const c2 = white ? "rgba(255,255,255,0.7)" : COLORS.accent;
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="120" rx="28" fill={white ? "rgba(255,255,255,0.15)" : COLORS.primaryLight} />
      <g transform="translate(18, 15)">
        {/* Hand palm */}
        <path d="M42 88 C20 88 10 70 10 55 L10 38 C10 34 13 31 17 31 C21 31 24 34 24 38 L24 45" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M24 45 L24 22 C24 18 27 15 31 15 C35 15 38 18 38 22 L38 42" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M38 42 L38 18 C38 14 41 11 45 11 C49 11 52 14 52 18 L52 42" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M52 42 L52 22 C52 18 55 15 59 15 C63 15 66 18 66 22 L66 45" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M66 45 L66 35 C66 31 69 28 73 28 C77 28 80 31 80 35 L80 58 C80 75 65 88 48 88" stroke={c1} strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Connection dots */}
        <circle cx="31" cy="11" r="4" fill={c2} />
        <circle cx="45" cy="7" r="4" fill={c2} />
        <circle cx="59" cy="11" r="4" fill={c2} />
        <circle cx="73" cy="24" r="3.5" fill={c2} />
        <circle cx="17" cy="27" r="3.5" fill={c2} />
        {/* Connection lines */}
        <line x1="31" y1="11" x2="45" y2="7" stroke={c2} strokeWidth="1.5" opacity="0.5" />
        <line x1="45" y1="7" x2="59" y2="11" stroke={c2} strokeWidth="1.5" opacity="0.5" />
      </g>
    </svg>
  );
}

function LogoFull({ size = 32, white = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Logo size={size} white={white} />
      <div style={{ lineHeight: 1.1 }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: size * 0.55,
          color: white ? "#fff" : COLORS.dark,
          letterSpacing: "-0.02em"
        }}>
          TáNa<span style={{ color: white ? "rgba(255,255,255,0.85)" : COLORS.primary }}>Mão</span>
        </div>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: size * 0.28,
          color: white ? "rgba(255,255,255,0.7)" : COLORS.gray,
          fontWeight: 500,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          marginTop: 1
        }}>Brasil</div>
      </div>
    </div>
  );
}

// ─── ICON COMPONENTS ───────────────────────────────────────
function IconSearch({ size = 20, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
}
function IconHome({ size = 22, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
}
function IconGrid({ size = 22, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
}
function IconChat({ size = 22, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
}
function IconUser({ size = 22, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}
function IconStar({ size = 14, color = COLORS.accent }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>;
}
function IconCheck({ size = 16, color = COLORS.primary }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
}
function IconArrowRight({ size = 18, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
}
function IconMapPin({ size = 14, color = COLORS.gray }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
}
function IconCrown({ size = 14, color = COLORS.accent }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M2 20h20L19 8l-5 6-2-8-2 8-5-6z"/></svg>;
}
function IconBolt({ size = 14, color = COLORS.coral }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>;
}
function IconBack({ size = 22, color = COLORS.dark }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>;
}
function IconFilter({ size = 20, color = COLORS.dark }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>;
}
function IconBriefcase({ size = 20, color = COLORS.primary }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
}
function IconBuilding({ size = 20, color = COLORS.primary }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="4" y="2" width="16" height="20" rx="1"/><line x1="9" y1="6" x2="9" y2="6.01"/><line x1="15" y1="6" x2="15" y2="6.01"/><line x1="9" y1="10" x2="9" y2="10.01"/><line x1="15" y1="10" x2="15" y2="10.01"/><line x1="9" y1="14" x2="9" y2="14.01"/><line x1="15" y1="14" x2="15" y2="14.01"/><path d="M9 22v-4h6v4"/></svg>;
}

// ─── STYLES ────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --primary: ${COLORS.primary};
    --primary-dark: ${COLORS.primaryDark};
    --primary-light: ${COLORS.primaryLight};
    --accent: ${COLORS.accent};
    --accent-light: ${COLORS.accentLight};
    --coral: ${COLORS.coral};
    --coral-light: ${COLORS.coralLight};
    --dark: ${COLORS.dark};
    --gray: ${COLORS.gray};
    --gray-light: ${COLORS.grayLight};
    --gray-border: ${COLORS.grayBorder};
    --gray-bg: ${COLORS.grayBg};
  }

  body, button, input, select, textarea {
    font-family: 'DM Sans', -apple-system, sans-serif;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', -apple-system, sans-serif;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .animate-in { animation: fadeInUp 0.5s ease forwards; }
  .animate-fade { animation: fadeIn 0.4s ease forwards; }
  .animate-slide { animation: slideIn 0.4s ease forwards; }

  .stagger-1 { animation-delay: 0.05s; opacity: 0; }
  .stagger-2 { animation-delay: 0.1s; opacity: 0; }
  .stagger-3 { animation-delay: 0.15s; opacity: 0; }
  .stagger-4 { animation-delay: 0.2s; opacity: 0; }
  .stagger-5 { animation-delay: 0.25s; opacity: 0; }
  .stagger-6 { animation-delay: 0.3s; opacity: 0; }

  ::-webkit-scrollbar { width: 0; height: 0; }
`;

// ─── REUSABLE COMPONENTS ───────────────────────────────────

function Badge({ type, style: s }) {
  const styles = {
    premium: { bg: COLORS.accentLight, color: "#92600A", icon: <IconCrown size={11} color="#92600A" />, text: "Premium" },
    pro: { bg: COLORS.coralLight, color: COLORS.coral, icon: <IconBolt size={11} />, text: "Pro" },
  };
  const b = styles[type];
  if (!b) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      background: b.bg, color: b.color,
      fontSize: 11, fontWeight: 700, padding: "3px 8px",
      borderRadius: 6, letterSpacing: "0.02em", ...s
    }}>
      {b.icon} {b.text}
    </span>
  );
}

function Avatar({ initials, size = 48, badge, color }) {
  const colors = [
    ["#0C8C5E", "#E6F5EF"], ["#E8A817", "#FEF7E0"], ["#E8573A", "#FEF0ED"],
    ["#6366F1", "#EEF2FF"], ["#EC4899", "#FDF2F8"],
  ];
  const idx = initials.charCodeAt(0) % colors.length;
  const [fg, bg] = color ? [color, color + "18"] : colors[idx];
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: size * 0.32,
        background: bg, display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Outfit', sans-serif", fontWeight: 700,
        fontSize: size * 0.38, color: fg, letterSpacing: "-0.02em"
      }}>
        {initials}
      </div>
      {badge && (
        <div style={{
          position: "absolute", bottom: -2, right: -2,
          width: 18, height: 18, borderRadius: 6,
          background: badge === "premium" ? COLORS.accent : COLORS.coral,
          display: "flex", alignItems: "center", justifyContent: "center",
          border: `2px solid ${COLORS.white}`
        }}>
          {badge === "premium" ? <IconCrown size={10} color="#fff" /> : <IconBolt size={10} color="#fff" />}
        </div>
      )}
    </div>
  );
}

function Button({ children, variant = "primary", size = "md", style: s, onClick, fullWidth }) {
  const variants = {
    primary: { bg: COLORS.primary, color: "#fff", border: "none" },
    accent: { bg: COLORS.accent, color: "#fff", border: "none" },
    coral: { bg: COLORS.coral, color: "#fff", border: "none" },
    outline: { bg: "transparent", color: COLORS.primary, border: `2px solid ${COLORS.primary}` },
    ghost: { bg: COLORS.grayBg, color: COLORS.dark, border: "none" },
    dark: { bg: COLORS.dark, color: "#fff", border: "none" },
  };
  const sizes = {
    sm: { padding: "8px 16px", fontSize: 13 },
    md: { padding: "12px 24px", fontSize: 14 },
    lg: { padding: "16px 32px", fontSize: 16 },
  };
  const v = variants[variant];
  const sz = sizes[size];
  return (
    <button onClick={onClick} style={{
      ...sz, background: v.bg, color: v.color, border: v.border,
      borderRadius: 12, fontWeight: 700, fontFamily: "'Outfit', sans-serif",
      cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
      gap: 8, transition: "all 0.2s ease", letterSpacing: "-0.01em",
      width: fullWidth ? "100%" : "auto", ...s,
    }}>
      {children}
    </button>
  );
}

// ─── SCREEN: HOME ──────────────────────────────────────────
function HomeScreen({ navigate }) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ paddingBottom: 90 }}>
      {/* Header */}
      <div className="animate-in" style={{
        padding: "16px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <LogoFull size={34} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => navigate("register")} style={{
            width: 38, height: 38, borderRadius: 12, border: `1.5px solid ${COLORS.grayBorder}`,
            background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <IconUser size={18} color={COLORS.dark} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="animate-in stagger-1" style={{ padding: "16px 20px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: searchFocused ? "#fff" : COLORS.grayBg,
          border: `2px solid ${searchFocused ? COLORS.primary : "transparent"}`,
          borderRadius: 14, padding: "12px 16px",
          transition: "all 0.2s ease",
          boxShadow: searchFocused ? `0 0 0 4px ${COLORS.primary}15` : "none"
        }}>
          <IconSearch size={20} color={searchFocused ? COLORS.primary : COLORS.grayLight} />
          <input
            placeholder="Buscar profissional ou serviço..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              flex: 1, border: "none", outline: "none", background: "transparent",
              fontSize: 15, color: COLORS.dark, fontFamily: "'DM Sans', sans-serif"
            }}
          />
          <button onClick={() => {}} style={{
            width: 36, height: 36, borderRadius: 10, border: "none",
            background: COLORS.primary, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <IconFilter size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="animate-in stagger-2" style={{ padding: "16px 20px 0" }}>
        <div style={{
          borderRadius: 18, padding: "22px 24px", minHeight: 120,
          background: BANNERS[bannerIdx].bg,
          transition: "background 0.6s ease",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: 10, right: 12,
            background: "rgba(255,255,255,0.25)", borderRadius: 6,
            padding: "3px 8px", fontSize: 10, fontWeight: 700, color: "#fff",
            letterSpacing: "0.05em", textTransform: "uppercase"
          }}>{BANNERS[bannerIdx].label}</div>
          <div key={bannerIdx} className="animate-fade" style={{ color: "#fff" }}>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>
              {BANNERS[bannerIdx].title}
            </h3>
            <p style={{ fontSize: 13, opacity: 0.9, lineHeight: 1.4 }}>
              {BANNERS[bannerIdx].subtitle}
            </p>
          </div>
          <div style={{
            display: "flex", gap: 6, marginTop: 16
          }}>
            {BANNERS.map((_, i) => (
              <div key={i} onClick={() => setBannerIdx(i)} style={{
                width: i === bannerIdx ? 24 : 8, height: 8, borderRadius: 4,
                background: i === bannerIdx ? "#fff" : "rgba(255,255,255,0.35)",
                transition: "all 0.3s ease", cursor: "pointer"
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="animate-in stagger-3" style={{
        display: "flex", gap: 10, padding: "16px 20px 0"
      }}>
        {[
          { n: "4.832", l: "Profissionais", c: COLORS.primary },
          { n: "1.245", l: "Empresas", c: COLORS.accent },
          { n: "12.890", l: "Serviços", c: COLORS.coral },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: "#fff", borderRadius: 14, padding: "14px 12px",
            border: `1.5px solid ${COLORS.grayBorder}`, textAlign: "center"
          }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: s.c }}>{s.n}</div>
            <div style={{ fontSize: 11, color: COLORS.gray, fontWeight: 500, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="animate-in stagger-4">
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 20px 12px"
        }}>
          <h2 style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 800, color: COLORS.dark }}>
            Categorias
          </h2>
          <button onClick={() => navigate("categories")} style={{
            background: "none", border: "none", color: COLORS.primary,
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'"
          }}>Ver todas</button>
        </div>
        <div style={{
          display: "flex", gap: 10, padding: "0 20px", overflowX: "auto",
          scrollbarWidth: "none"
        }}>
          {CATEGORIES.slice(0, 6).map((cat, i) => (
            <div key={i} onClick={() => navigate("categories")} style={{
              minWidth: 80, background: "#fff", borderRadius: 16,
              border: `1.5px solid ${COLORS.grayBorder}`,
              padding: "16px 12px", textAlign: "center", cursor: "pointer",
              transition: "all 0.2s ease"
            }}>
              <div style={{ fontSize: 28, marginBottom: 6 }}>{cat.icon}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.dark, marginBottom: 2 }}>{cat.name}</div>
              <div style={{ fontSize: 10, color: COLORS.grayLight }}>{cat.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Professionals */}
      <div className="animate-in stagger-5">
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "20px 20px 12px"
        }}>
          <h2 style={{ fontFamily: "'Outfit'", fontSize: 18, fontWeight: 800, color: COLORS.dark }}>
            Destaques
          </h2>
          <button onClick={() => navigate("search")} style={{
            background: "none", border: "none", color: COLORS.primary,
            fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans'"
          }}>Ver todos</button>
        </div>
        <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
          {PROFESSIONALS.slice(0, 4).map((p, i) => (
            <ProfessionalCard key={i} p={p} onClick={() => navigate("profile", p)} delay={i} />
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="animate-in stagger-6" style={{ padding: "24px 20px 0" }}>
        <div style={{
          background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkSoft} 100%)`,
          borderRadius: 18, padding: "24px", position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: -20, right: -20,
            width: 100, height: 100, borderRadius: "50%",
            background: COLORS.primary, opacity: 0.1
          }} />
          <h3 style={{
            fontFamily: "'Outfit'", fontSize: 19, fontWeight: 800,
            color: "#fff", marginBottom: 8
          }}>É profissional?</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 16 }}>
            Cadastre-se e comece a receber clientes hoje mesmo. Planos a partir de R$ 0.
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <Button variant="primary" size="sm" onClick={() => navigate("register")}>Cadastrar</Button>
            <Button variant="ghost" size="sm" style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }} onClick={() => navigate("plans")}>
              Ver planos
            </Button>
          </div>
        </div>
      </div>

      {/* Advertise CTA */}
      <div style={{ padding: "16px 20px 0" }}>
        <div onClick={() => navigate("advertise")} style={{
          background: COLORS.accentLight, borderRadius: 14, padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer", border: `1.5px solid ${COLORS.accent}22`
        }}>
          <div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 14, fontWeight: 700, color: "#92600A" }}>
              📢 Anuncie no Banner
            </div>
            <div style={{ fontSize: 12, color: "#92600A", opacity: 0.7, marginTop: 2 }}>
              Sua empresa em destaque para milhares de clientes
            </div>
          </div>
          <IconArrowRight size={16} color="#92600A" />
        </div>
      </div>
    </div>
  );
}

function ProfessionalCard({ p, onClick, delay = 0 }) {
  return (
    <div onClick={onClick} className={`animate-slide stagger-${delay + 1}`} style={{
      background: "#fff", borderRadius: 16, padding: "16px",
      border: `1.5px solid ${COLORS.grayBorder}`, cursor: "pointer",
      display: "flex", gap: 14, alignItems: "center",
      transition: "all 0.2s ease"
    }}>
      <Avatar initials={p.avatar} size={52} badge={p.badge} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
          <span style={{
            fontFamily: "'Outfit'", fontSize: 15, fontWeight: 700, color: COLORS.dark
          }}>{p.name}</span>
          {p.badge && <Badge type={p.badge} />}
        </div>
        <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 4 }}>{p.role}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
            <IconStar size={13} /> <strong style={{ color: COLORS.dark }}>{p.rating}</strong>
            <span style={{ color: COLORS.grayLight }}>({p.reviews})</span>
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 3, color: COLORS.grayLight }}>
            <IconMapPin size={12} /> {p.city}
          </span>
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.primary, marginBottom: 4 }}>{p.price}</div>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: p.available ? "#22C55E" : COLORS.grayLight,
          marginLeft: "auto"
        }} />
      </div>
    </div>
  );
}

// ─── SCREEN: CATEGORIES ────────────────────────────────────
function CategoriesScreen({ navigate }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: `1px solid ${COLORS.grayBorder}`
      }}>
        <button onClick={() => navigate("home")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4
        }}><IconBack /></button>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>Categorias</h2>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10,
        padding: "16px 20px"
      }}>
        {CATEGORIES.map((cat, i) => (
          <div key={i} className={`animate-in stagger-${Math.min(i + 1, 6)}`} style={{
            background: "#fff", borderRadius: 16, border: `1.5px solid ${COLORS.grayBorder}`,
            padding: "20px 10px", textAlign: "center", cursor: "pointer"
          }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.dark, fontFamily: "'Outfit'" }}>{cat.name}</div>
            <div style={{ fontSize: 11, color: COLORS.grayLight, marginTop: 3 }}>{cat.count} profissionais</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: SEARCH / LIST ─────────────────────────────────
function SearchScreen({ navigate }) {
  const [filter, setFilter] = useState("todos");
  const filters = ["todos", "premium", "pro", "disponíveis"];
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: `1px solid ${COLORS.grayBorder}`
      }}>
        <button onClick={() => navigate("home")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4
        }}><IconBack /></button>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>Profissionais</h2>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "12px 20px", overflowX: "auto" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "8px 16px", borderRadius: 10, border: "none",
            background: filter === f ? COLORS.primary : COLORS.grayBg,
            color: filter === f ? "#fff" : COLORS.gray,
            fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "'DM Sans'", whiteSpace: "nowrap",
            textTransform: "capitalize"
          }}>{f}</button>
        ))}
      </div>
      <div style={{ padding: "8px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
        {PROFESSIONALS.filter(p => {
          if (filter === "premium") return p.badge === "premium";
          if (filter === "pro") return p.badge === "pro";
          if (filter === "disponíveis") return p.available;
          return true;
        }).map((p, i) => (
          <ProfessionalCard key={i} p={p} onClick={() => navigate("profile", p)} delay={i} />
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: PROFILE ───────────────────────────────────────
function ProfileScreen({ navigate, data }) {
  const p = data || PROFESSIONALS[0];
  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14
      }}>
        <button onClick={() => navigate("back")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4
        }}><IconBack /></button>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>Perfil</h2>
      </div>

      <div className="animate-in" style={{ textAlign: "center", padding: "0 20px 20px" }}>
        <Avatar initials={p.avatar} size={80} badge={p.badge} />
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 22, fontWeight: 800, marginTop: 12, color: COLORS.dark }}>
          {p.name}
        </h2>
        <div style={{ fontSize: 14, color: COLORS.gray, marginTop: 4 }}>{p.role}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 8, alignItems: "center" }}>
          <IconMapPin size={14} color={COLORS.grayLight} />
          <span style={{ fontSize: 13, color: COLORS.grayLight }}>{p.city}</span>
        </div>
        {p.badge && <div style={{ marginTop: 8 }}><Badge type={p.badge} /></div>}
      </div>

      {/* Stats */}
      <div className="animate-in stagger-1" style={{ display: "flex", gap: 10, padding: "0 20px 16px" }}>
        {[
          { v: p.rating, l: "Avaliação", icon: <IconStar size={16} /> },
          { v: p.reviews, l: "Avaliações", icon: null },
          { v: p.available ? "Sim" : "Não", l: "Disponível", icon: null },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1, background: COLORS.grayBg, borderRadius: 14, padding: "14px",
            textAlign: "center"
          }}>
            <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: COLORS.dark, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              {s.icon}{s.v}
            </div>
            <div style={{ fontSize: 11, color: COLORS.gray, marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* About */}
      <div className="animate-in stagger-2" style={{ padding: "0 20px 16px" }}>
        <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Sobre</h3>
        <p style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.6 }}>
          Profissional com mais de 10 anos de experiência. Atendimento rápido, qualidade garantida e preços justos.
          Atendo residências e comércios em toda a região metropolitana.
        </p>
      </div>

      {/* Portfolio placeholder */}
      <div className="animate-in stagger-3" style={{ padding: "0 20px 16px" }}>
        <h3 style={{ fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Portfólio</h3>
        <div style={{ display: "flex", gap: 10 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              flex: 1, aspectRatio: "1", borderRadius: 14,
              background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.grayBg} 100%)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, color: COLORS.grayLight
            }}>Foto {i}</div>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="animate-in stagger-4" style={{ padding: "0 20px 16px" }}>
        <div style={{
          background: COLORS.primaryLight, borderRadius: 14, padding: "16px",
          display: "flex", justifyContent: "space-between", alignItems: "center"
        }}>
          <div>
            <div style={{ fontSize: 12, color: COLORS.gray }}>Valor estimado</div>
            <div style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, color: COLORS.primary }}>{p.price}</div>
          </div>
          <Button variant="primary" size="sm">Solicitar Orçamento</Button>
        </div>
      </div>

      {/* Actions */}
      <div style={{
        position: "fixed", bottom: 70, left: 0, right: 0,
        padding: "12px 20px", background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", borderTop: `1px solid ${COLORS.grayBorder}`,
        display: "flex", gap: 10, maxWidth: 480, margin: "0 auto"
      }}>
        <Button variant="outline" fullWidth>💬 Chat</Button>
        <Button variant="primary" fullWidth>📞 Ligar</Button>
      </div>
    </div>
  );
}

// ─── SCREEN: PLANS ─────────────────────────────────────────
function PlansScreen({ navigate }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: `1px solid ${COLORS.grayBorder}`
      }}>
        <button onClick={() => navigate("home")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4
        }}><IconBack /></button>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>Planos</h2>
      </div>

      <div style={{ padding: "16px 20px", textAlign: "center" }}>
        <h3 className="animate-in" style={{
          fontFamily: "'Outfit'", fontSize: 24, fontWeight: 900, color: COLORS.dark, marginBottom: 6
        }}>Escolha seu plano</h3>
        <p className="animate-in stagger-1" style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.5 }}>
          Cresça seu negócio com mais visibilidade e ferramentas
        </p>
      </div>

      <div style={{ padding: "0 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        {PLANS.map((plan, i) => (
          <div key={i} className={`animate-in stagger-${i + 2}`} style={{
            background: "#fff", borderRadius: 20,
            border: plan.popular ? `2.5px solid ${plan.color}` : `1.5px solid ${COLORS.grayBorder}`,
            padding: "24px", position: "relative", overflow: "hidden"
          }}>
            {plan.popular && (
              <div style={{
                position: "absolute", top: 16, right: -28,
                background: plan.color, color: "#fff",
                fontSize: 10, fontWeight: 800, padding: "4px 32px",
                transform: "rotate(45deg)", letterSpacing: "0.05em"
              }}>POPULAR</div>
            )}
            <div style={{
              display: "inline-block", background: plan.bg,
              borderRadius: 10, padding: "6px 14px", marginBottom: 12
            }}>
              <span style={{
                fontFamily: "'Outfit'", fontSize: 14, fontWeight: 800, color: plan.color
              }}>{plan.name}</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 16 }}>
              <span style={{
                fontFamily: "'Outfit'", fontSize: 36, fontWeight: 900, color: COLORS.dark
              }}>{plan.price}</span>
              <span style={{ fontSize: 14, color: COLORS.grayLight }}>{plan.period}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
              {plan.features.map((f, j) => (
                <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ flexShrink: 0, marginTop: 2 }}>
                    <IconCheck size={15} color={plan.color} />
                  </div>
                  <span style={{ fontSize: 13.5, color: COLORS.dark, lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
            <Button
              variant={plan.popular ? "coral" : plan.name === "Premium" ? "accent" : "outline"}
              fullWidth size="lg"
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN: REGISTER ──────────────────────────────────────
function RegisterScreen({ navigate }) {
  const [type, setType] = useState(null);
  const [step, setStep] = useState(0);

  if (step === 0) {
    return (
      <div style={{ paddingBottom: 90 }}>
        <div style={{
          padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
          borderBottom: `1px solid ${COLORS.grayBorder}`
        }}>
          <button onClick={() => navigate("home")} style={{
            background: "none", border: "none", cursor: "pointer", padding: 4
          }}><IconBack /></button>
          <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>Cadastro</h2>
        </div>

        <div style={{ padding: "32px 20px", textAlign: "center" }}>
          <Logo size={64} />
          <h2 className="animate-in" style={{
            fontFamily: "'Outfit'", fontSize: 26, fontWeight: 900, color: COLORS.dark,
            marginTop: 20, marginBottom: 8
          }}>Junte-se ao TáNaMão</h2>
          <p className="animate-in stagger-1" style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.5, marginBottom: 32 }}>
            Escolha como deseja se cadastrar
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="animate-in stagger-2" onClick={() => { setType("profissional"); setStep(1); }} style={{
              background: "#fff", borderRadius: 18, border: `2px solid ${COLORS.grayBorder}`,
              padding: "24px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 16,
              transition: "all 0.2s ease"
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: COLORS.primaryLight,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <IconBriefcase size={24} color={COLORS.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Outfit'", fontSize: 17, fontWeight: 700, color: COLORS.dark }}>
                  Sou Profissional
                </div>
                <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 2 }}>
                  Autônomo, freelancer ou prestador de serviço
                </div>
              </div>
              <IconArrowRight color={COLORS.primary} />
            </div>

            <div className="animate-in stagger-3" onClick={() => { setType("empresa"); setStep(1); }} style={{
              background: "#fff", borderRadius: 18, border: `2px solid ${COLORS.grayBorder}`,
              padding: "24px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 16,
              transition: "all 0.2s ease"
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: COLORS.accentLight,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <IconBuilding size={24} color={COLORS.accent} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Outfit'", fontSize: 17, fontWeight: 700, color: COLORS.dark }}>
                  Sou Empresa
                </div>
                <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 2 }}>
                  Empresa, agência ou escritório
                </div>
              </div>
              <IconArrowRight color={COLORS.accent} />
            </div>

            <div className="animate-in stagger-4" onClick={() => { setType("cliente"); setStep(1); }} style={{
              background: "#fff", borderRadius: 18, border: `2px solid ${COLORS.grayBorder}`,
              padding: "24px", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 16
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, background: COLORS.coralLight,
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <IconUser size={24} color={COLORS.coral} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Outfit'", fontSize: 17, fontWeight: 700, color: COLORS.dark }}>
                  Busco Profissional
                </div>
                <div style={{ fontSize: 13, color: COLORS.gray, marginTop: 2 }}>
                  Preciso contratar um serviço
                </div>
              </div>
              <IconArrowRight color={COLORS.coral} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isProf = type === "profissional";
  const isEmpresa = type === "empresa";
  const accent = isProf ? COLORS.primary : isEmpresa ? COLORS.accent : COLORS.coral;

  const inputStyle = {
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: `2px solid ${COLORS.grayBorder}`, fontSize: 14,
    fontFamily: "'DM Sans'", outline: "none", background: "#fff",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: `1px solid ${COLORS.grayBorder}`
      }}>
        <button onClick={() => setStep(0)} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4
        }}><IconBack /></button>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>
          {isProf ? "Cadastro Profissional" : isEmpresa ? "Cadastro Empresa" : "Cadastro Cliente"}
        </h2>
      </div>

      {/* Progress */}
      <div style={{ padding: "16px 20px 0", display: "flex", gap: 6 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: s <= step ? accent : COLORS.grayBg
          }} />
        ))}
      </div>

      <div className="animate-fade" style={{ padding: "24px 20px" }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
              Dados {isEmpresa ? "da empresa" : "pessoais"}
            </h3>
            <input style={inputStyle} placeholder={isEmpresa ? "Razão Social" : "Nome completo"} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            {isEmpresa && <input style={inputStyle} placeholder="CNPJ" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />}
            <input style={inputStyle} placeholder="E-mail" type="email" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <input style={inputStyle} placeholder="Telefone / WhatsApp" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <input style={inputStyle} placeholder={isEmpresa ? "CNPJ" : "CPF"} onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <input style={inputStyle} placeholder="Cidade / Estado" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <Button variant={isProf ? "primary" : isEmpresa ? "accent" : "coral"} fullWidth size="lg" onClick={() => setStep(2)} style={{ marginTop: 8 }}>
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && (isProf || isEmpresa) && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
              {isEmpresa ? "Serviços da empresa" : "Seus serviços"}
            </h3>
            <p style={{ fontSize: 13, color: COLORS.gray, marginBottom: 4 }}>Selecione suas categorias de atuação</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {CATEGORIES.map((cat, i) => (
                <button key={i} style={{
                  padding: "10px 16px", borderRadius: 12,
                  border: `2px solid ${COLORS.grayBorder}`, background: "#fff",
                  fontSize: 13, cursor: "pointer", fontFamily: "'DM Sans'",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.15s ease"
                }}
                  onClick={e => {
                    const el = e.currentTarget;
                    const active = el.dataset.active === "true";
                    el.dataset.active = !active;
                    el.style.background = !active ? accent + "12" : "#fff";
                    el.style.borderColor = !active ? accent : COLORS.grayBorder;
                    el.style.color = !active ? accent : COLORS.dark;
                  }}>
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
            <textarea style={{ ...inputStyle, minHeight: 80, resize: "vertical" }} placeholder="Descreva seus serviços e experiência..." onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <input style={inputStyle} placeholder="Valor médio do serviço (ex: A partir de R$ 80)" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <Button variant={isProf ? "primary" : "accent"} fullWidth size="lg" onClick={() => setStep(3)} style={{ marginTop: 8 }}>
              Continuar
            </Button>
          </div>
        )}

        {step === 2 && type === "cliente" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h3 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800, marginBottom: 4 }}>
              Segurança
            </h3>
            <input style={inputStyle} placeholder="Criar senha" type="password" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <input style={inputStyle} placeholder="Confirmar senha" type="password" onFocus={e => e.target.style.borderColor = accent} onBlur={e => e.target.style.borderColor = COLORS.grayBorder} />
            <Button variant="coral" fullWidth size="lg" onClick={() => setStep(3)} style={{ marginTop: 8 }}>
              Criar conta
            </Button>
          </div>
        )}

        {step === 3 && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div className="animate-in" style={{
              width: 80, height: 80, borderRadius: 24, background: accent + "15",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 20px", fontSize: 36
            }}>🎉</div>
            <h3 className="animate-in stagger-1" style={{
              fontFamily: "'Outfit'", fontSize: 24, fontWeight: 900, color: COLORS.dark, marginBottom: 8
            }}>Cadastro realizado!</h3>
            <p className="animate-in stagger-2" style={{ fontSize: 14, color: COLORS.gray, lineHeight: 1.6, marginBottom: 24 }}>
              {isProf || isEmpresa
                ? "Seu perfil está sendo verificado. Você receberá uma confirmação por e-mail em até 24h."
                : "Sua conta foi criada. Agora você pode buscar e contratar profissionais."}
            </p>
            {(isProf || isEmpresa) && (
              <Button variant={isProf ? "primary" : "accent"} size="lg" onClick={() => navigate("plans")}>
                Escolher Plano
              </Button>
            )}
            <div style={{ marginTop: 12 }}>
              <Button variant="ghost" size="md" onClick={() => navigate("home")}>
                Ir para o início
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN: ADVERTISE ─────────────────────────────────────
function AdvertiseScreen({ navigate }) {
  return (
    <div style={{ paddingBottom: 90 }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
        borderBottom: `1px solid ${COLORS.grayBorder}`
      }}>
        <button onClick={() => navigate("home")} style={{
          background: "none", border: "none", cursor: "pointer", padding: 4
        }}><IconBack /></button>
        <h2 style={{ fontFamily: "'Outfit'", fontSize: 20, fontWeight: 800 }}>Anuncie</h2>
      </div>

      <div style={{ padding: "24px 20px" }}>
        <div className="animate-in" style={{
          borderRadius: 20, padding: "28px 24px",
          background: `linear-gradient(135deg, ${COLORS.dark} 0%, ${COLORS.darkSoft} 100%)`,
          textAlign: "center", marginBottom: 24, position: "relative", overflow: "hidden"
        }}>
          <div style={{
            position: "absolute", top: -30, right: -30, width: 120, height: 120,
            borderRadius: "50%", background: COLORS.accent, opacity: 0.1
          }} />
          <div style={{ fontSize: 40, marginBottom: 12 }}>📢</div>
          <h2 style={{
            fontFamily: "'Outfit'", fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 8
          }}>Banner Publicitário</h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>
            Seu negócio em destaque no carrossel principal do app. Milhares de visualizações diárias.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { name: "Semanal", price: "R$ 49,90", desc: "7 dias no carrossel", impressions: "~5.000 views", color: COLORS.primary },
            { name: "Mensal", price: "R$ 149,90", desc: "30 dias no carrossel", impressions: "~22.000 views", color: COLORS.coral, popular: true },
            { name: "Trimestral", price: "R$ 349,90", desc: "90 dias + destaque extra", impressions: "~70.000 views", color: COLORS.accent },
          ].map((pkg, i) => (
            <div key={i} className={`animate-in stagger-${i + 1}`} style={{
              background: "#fff", borderRadius: 16,
              border: pkg.popular ? `2.5px solid ${pkg.color}` : `1.5px solid ${COLORS.grayBorder}`,
              padding: "20px", position: "relative"
            }}>
              {pkg.popular && (
                <span style={{
                  position: "absolute", top: 12, right: 12,
                  background: pkg.color, color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "3px 8px",
                  borderRadius: 6
                }}>MELHOR CUSTO</span>
              )}
              <div style={{
                fontFamily: "'Outfit'", fontSize: 16, fontWeight: 700, color: COLORS.dark, marginBottom: 4
              }}>{pkg.name}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Outfit'", fontSize: 28, fontWeight: 900, color: pkg.color }}>{pkg.price}</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.gray, marginBottom: 4 }}>{pkg.desc}</div>
              <div style={{ fontSize: 12, color: COLORS.grayLight, marginBottom: 14 }}>📊 {pkg.impressions}</div>
              <Button variant={pkg.popular ? "coral" : "outline"} fullWidth size="md">
                Contratar
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────
export default function TaNaMaoApp() {
  const [screen, setScreen] = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [history, setHistory] = useState(["home"]);
  const containerRef = useRef(null);

  const navigate = (s, data = null) => {
    if (s === "back") {
      const newH = [...history];
      newH.pop();
      setScreen(newH[newH.length - 1] || "home");
      setHistory(newH);
    } else {
      setScreen(s);
      setScreenData(data);
      setHistory(h => [...h, s]);
    }
    if (containerRef.current) containerRef.current.scrollTop = 0;
  };

  const activeTab = screen === "home" ? 0 : screen === "categories" ? 1 : screen === "search" ? 1 : screen === "plans" ? 3 : null;
  const tabs = [
    { icon: (c) => <IconHome size={22} color={c} />, label: "Início", screen: "home" },
    { icon: (c) => <IconGrid size={22} color={c} />, label: "Categorias", screen: "categories" },
    { icon: (c) => <IconChat size={22} color={c} />, label: "Chat", screen: "home" },
    { icon: (c) => <IconUser size={22} color={c} />, label: "Perfil", screen: "register" },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{
        maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        background: COLORS.white, fontFamily: "'DM Sans', sans-serif",
        position: "relative", overflow: "hidden",
        boxShadow: "0 0 60px rgba(0,0,0,0.08)"
      }}>
        <div ref={containerRef} style={{ height: "100vh", overflowY: "auto", paddingBottom: 0 }}>
          {screen === "home" && <HomeScreen navigate={navigate} />}
          {screen === "categories" && <CategoriesScreen navigate={navigate} />}
          {screen === "search" && <SearchScreen navigate={navigate} />}
          {screen === "profile" && <ProfileScreen navigate={navigate} data={screenData} />}
          {screen === "plans" && <PlansScreen navigate={navigate} />}
          {screen === "register" && <RegisterScreen navigate={navigate} />}
          {screen === "advertise" && <AdvertiseScreen navigate={navigate} />}
        </div>

        {/* Bottom Nav */}
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 480,
          background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)",
          borderTop: `1px solid ${COLORS.grayBorder}`,
          display: "flex", padding: "8px 12px 12px", zIndex: 100
        }}>
          {tabs.map((tab, i) => {
            const active = activeTab === i;
            return (
              <button key={i} onClick={() => navigate(tab.screen)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
                gap: 3, background: "none", border: "none", cursor: "pointer",
                padding: "6px 0", transition: "all 0.2s ease"
              }}>
                {tab.icon(active ? COLORS.primary : COLORS.grayLight)}
                <span style={{
                  fontSize: 10, fontWeight: active ? 700 : 500,
                  color: active ? COLORS.primary : COLORS.grayLight,
                  fontFamily: "'DM Sans'"
                }}>{tab.label}</span>
                {active && <div style={{
                  width: 4, height: 4, borderRadius: 2,
                  background: COLORS.primary, marginTop: 1
                }} />}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
