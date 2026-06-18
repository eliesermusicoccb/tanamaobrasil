import { useState, useEffect, useRef, useCallback } from "react";
import RegisterProfessional from "./RegisterProfessional";
import Login from "./Login";

// ══════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ══════════════════════════════════════════════════════════════
const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0",
  cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937",
  g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
  green: "#22C55E", red: "#EF4444", blue: "#3B82F6",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

// ══════════════════════════════════════════════════════════════
// META PIXEL EVENTS - PROFESSIONAL CONVERSION TRACKING
// ══════════════════════════════════════════════════════════════
function trackEvent(event, data) {
  try { 
    if(window.fbq) window.fbq('track', event, data); 
    console.log(`📊 FB Event: ${event}`, data);
  } catch(e) {}
}

// ══════════════════════════════════════════════════════════════
// NOTIFICATION SOUND SYSTEM
// ══════════════════════════════════════════════════════════════
let audioCtx = null;
function playNotifSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.type = "sine"; osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.setValueAtTime(1100, audioCtx.currentTime + 0.08);
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.16);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
    osc.start(audioCtx.currentTime); osc.stop(audioCtx.currentTime + 0.4);
  } catch(e) {}
}

// ══════════════════════════════════════════════════════════════
// MODERATION SYSTEM
// ══════════════════════════════════════════════════════════════
const BANNED_WORDS = ["idiota","burro","incompetente","lixo","porcaria","nojo","imbecil","cretino","vagabundo","preguiçoso","ladrão","caloteiro","pilantra","safado","desgraça","merda","porra","caralho","puta","fdp","arrombado","otário","trouxa"];
function moderateText(text) {
  if (!text) return { safe:true, cleaned:text };
  const lower = text.toLowerCase();
  const found = BANNED_WORDS.filter(w => lower.includes(w));
  if (found.length === 0) return { safe:true, cleaned:text };
  let cleaned = text;
  found.forEach(w => { const re = new RegExp(w, "gi"); cleaned = cleaned.replace(re, "***"); });
  return { safe:false, cleaned, flagged:found };
}

// ══════════════════════════════════════════════════════════════
// DATA
// ══════════════════════════════════════════════════════════════
const CATEGORIES = [
  { icon:"🔧", name:"Encanador", count:342 },{ icon:"⚡", name:"Eletricista", count:289 },
  { icon:"🎨", name:"Pintor", count:415 },{ icon:"🏗️", name:"Pedreiro", count:523 },
  { icon:"💇", name:"Cabeleireiro", count:678 },{ icon:"📱", name:"Técnico TI", count:234 },
  { icon:"🚗", name:"Mecânico", count:456 },{ icon:"📸", name:"Fotógrafo", count:312 },
  { icon:"🧹", name:"Diarista", count:891 },{ icon:"👩‍⚕️", name:"Enfermeiro(a)", count:187 },
  { icon:"📐", name:"Arquiteto", count:156 },{ icon:"🍳", name:"Chef", count:267 },
  { icon:"🪚", name:"Marceneiro", count:198 },{ icon:"❄️", name:"Ar Cond.", count:321 },
  { icon:"🔒", name:"Chaveiro", count:145 },{ icon:"🌿", name:"Jardineiro", count:276 },
  { icon:"🐕", name:"Pet Care", count:389 },{ icon:"🎶", name:"Músico", count:201 },
];

const PROS = [
  { id:1, name:"Carlos Silva", role:"Eletricista", rating:4.9, reviews:127, city:"São Paulo, SP", price:"R$ 80", badge:"premium", av:"CS", on:true,
    desc:"Mais de 15 anos no mercado. Instalações residenciais e comerciais, manutenção preventiva e laudos técnicos. Atendimento 24h.",
    whatsapp:"5511999990001", phone:"(11) 99999-0001", email:"carlos@email.com",
    address:"Rua Augusta, 1200 - Consolação, São Paulo - SP, 01304-001",
    hours:"Seg-Sáb: 7h às 20h | Dom: Emergências",
    social:{ ig:"@carlos.eletricista", fb:"carlos.eletricista", li:"carlos-silva-elet" },
    categories:["Eletricista","Instalações","Manutenção"],
    since:"2009", jobs:1450, views:3842, emergency24h:true,
    userReviews:[
      {n:"Maria S.",r:5,t:"Excelente! Pontual e muito atencioso. Resolveu tudo em 2h.",d:"2 dias atrás"},
      {n:"Pedro L.",r:5,t:"Trabalho impecável, super recomendo. Preço justo.",d:"1 semana atrás"},
      {n:"Ana C.",r:4,t:"Bom profissional, só demorou um pouco para chegar.",d:"2 semanas atrás"},
    ]},
  { id:2, name:"Ana Oliveira", role:"Designer de Interiores", rating:4.8, reviews:89, city:"Rio de Janeiro, RJ", price:"R$ 150", badge:"pro", av:"AO", on:true,
    desc:"Projetos residenciais e corporativos com foco em funcionalidade e estética. Consultoria online disponível.",
    whatsapp:"5521999990002", phone:"(21) 99999-0002", email:"ana@design.com",
    address:"Av. Atlântica, 500 - Copacabana, Rio de Janeiro - RJ",
    hours:"Seg-Sex: 9h às 18h",
    social:{ ig:"@ana.interiores", fb:"ana.oliveira.design", li:"ana-oliveira-design" },
    categories:["Design","Interiores","Consultoria"],
    since:"2015", jobs:320, views:1567, emergency24h:false,
    userReviews:[{n:"Lucas M.",r:5,t:"Projeto incrível! Transformou meu apê.",d:"3 dias atrás"},{n:"Carla R.",r:4,t:"Ótimo gosto, entregou no prazo.",d:"1 semana atrás"}]},
  { id:3, name:"Roberto Santos", role:"Encanador", rating:4.7, reviews:203, city:"Belo Horizonte, MG", price:"R$ 60", badge:"premium", av:"RS", on:false,
    desc:"Especialista em instalações hidráulicas, desentupimento, troca de registros e reparos em geral.",
    whatsapp:"5531999990003", phone:"(31) 99999-0003", email:"roberto@email.com",
    address:"Rua da Bahia, 800 - Centro, Belo Horizonte - MG",
    hours:"Seg-Sáb: 6h às 19h",
    social:{ ig:"@roberto.encanador" }, categories:["Encanador","Hidráulica"], since:"2010", jobs:2100, views:4210, emergency24h:true,
    userReviews:[{n:"Fernanda A.",r:5,t:"Resolveu um vazamento complexo rapidamente.",d:"5 dias atrás"}]},
  { id:4, name:"Mariana Costa", role:"Fotógrafa", rating:5.0, reviews:56, city:"Curitiba, PR", price:"R$ 200", badge:"pro", av:"MC", on:true,
    desc:"Fotografia de eventos, retratos profissionais, ensaios e fotografia de produto para e-commerce.",
    whatsapp:"5541999990004", phone:"(41) 99999-0004", email:"mari@foto.com",
    address:"Rua XV de Novembro, 300 - Centro, Curitiba - PR",
    hours:"Seg-Sáb: 8h às 20h",
    social:{ ig:"@mari.fotografia", fb:"mari.costa.foto", li:"mariana-costa-foto" },
    categories:["Fotografia","Eventos","Produto"], since:"2017", jobs:680, views:2890, emergency24h:false,
    userReviews:[{n:"Bruno K.",r:5,t:"Fotos incríveis, super atencioso no atendimento.",d:"1 semana atrás"}]},
];

// ══════════════════════════════════════════════════════════════
// TRIAL SYSTEM
// ══════════════════════════════════════════════════════════════
function useTrialSystem() {
  const [trial, setTrial] = useState(true);
  const [trialNotifs, setTrialNotifs] = useState([]);
  return { trial, setTrial, trialNotifs };
}

// ══════════════════════════════════════════════════════════════
// ICONS
// ══════════════════════════════════════════════════════════════
const I = {
  home: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  grid: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  chat: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  user: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  back: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  search: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  filter: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
  whatsapp: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M17.6 6.3c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1.1 4L2 22l4.2-1.1c1.2.6 2.5 1 3.9 1h.1c4.4 0 8-3.6 8-8 0-2.1-.9-4.2-2.5-5.7zM12 20.1c-1.2 0-2.4-.3-3.5-.9l-.3-.1-2.8.7.7-2.8-.1-.3c-.6-1.1-.9-2.3-.9-3.5 0-3.6 3-6.6 6.6-6.6 1.8 0 3.5.7 4.8 2 1.2 1.2 1.9 2.9 1.9 4.7 0 3.6-3 6.6-6.7 6.6z"/></svg>,
  logout: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5m0 0l-5-5" /></svg>,
  star: (c) => <svg width="16" height="16" viewBox="0 0 24 24" fill={c}><polygon points="12 2 15.09 10.26 24 10.27 17.18 16.70 20.27 25 12 19.54 3.73 25 6.82 16.70 0 10.27 8.91 10.26 12 2"/></svg>,
  heart: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill={c} stroke={c} strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  phone: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  bell: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  more: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill={c}><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>,
  close: (c) => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  check: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>,
  gear: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m6.08 0l4.24-4.24M1 12h6m6 0h6m-1.78 7.78l-4.24-4.24m-6.08 0l-4.24 4.24"/></svg>,
};

// ══════════════════════════════════════════════════════════════
// COMPONENTS
// ══════════════════════════════════════════════════════════════
function Avatar({ ini, size = 40, badge = null }) {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];
  const colorIndex = ini.charCodeAt(0) % colors.length;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ width: size, height: size, borderRadius: "50%", background: colors[colorIndex], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.4, fontFamily: font.d }}>
        {ini}
      </div>
      {badge && <div style={{ position: "absolute", bottom: 0, right: 0, background: badge === "premium" ? C.acc : C.pri, borderRadius: "50%", width: size * 0.35, height: size * 0.35, fontSize: size * 0.2 }}>⭐</div>}
    </div>
  );
}

function TopBar({ title, onBack, rightIcon, onRightClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: `1px solid ${C.gB}` }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>{I.back(C.g)}</button>
      <h1 style={{ fontFamily: font.d, fontSize: 18, fontWeight: 800, color: C.dk }}>{title}</h1>
      {rightIcon ? <button onClick={onRightClick} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>{rightIcon}</button> : <div style={{ width: 24 }}/>}
    </div>
  );
}

function Btn({ v = "secondary", full = false, sz = "md", onClick, children, disabled = false, style = {} }) {
  const variants = {
    primary: { bg: C.pri, color: "#fff", hover: C.priDk },
    secondary: { bg: C.gBg, color: C.dk, hover: C.gB },
    ghost: { bg: "transparent", color: C.pri, hover: "transparent" },
  };
  const sizes = { sm: { p: "8px 12px", fs: 12 }, md: { p: "12px 16px", fs: 14 }, lg: { p: "14px 20px", fs: 15 } };
  const variant = variants[v];
  const size = sizes[sz];
  return (
    <button onClick={onClick} disabled={disabled} style={{ background: variant.bg, color: variant.color, border: "none", borderRadius: 10, padding: size.p, fontSize: size.fs, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer", width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1, fontFamily: font.b, ...style }}>
      {children}
    </button>
  );
}

// ══════════════════════════════════════════════════════════════
// SCREENS
// ══════════════════════════════════════════════════════════════
function Home({ nav, trial, user }) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const banners = [
    { title: "Encontre profissionais", sub: "De forma rápida e segura", bg: `linear-gradient(135deg, ${C.pri}, ${C.priDk})` },
    { title: "7 dias grátis", sub: "Cadastre-se agora", bg: `linear-gradient(135deg, ${C.acc}, #D68910)` },
    { title: "Suporte 24/7", sub: "Sempre pronto para ajudar", bg: `linear-gradient(135deg, ${C.cor}, #D1441A)` },
  ];
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000); return () => clearInterval(t); }, []);
  return (
    <div className="screen-content">
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.d, fontSize: 28, fontWeight: 900, color: C.dk }}>TáNaMão</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {user && <div style={{ fontSize: 12, color: C.gL }}>👋 {user.name}</div>}
          <button className="icon-btn" onClick={() => nav("notifs")}>{I.bell(C.g)}</button>
        </div>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div className="search-bar">
          {I.search(C.gL)}
          <input type="text" placeholder="Procurar profissional..." style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: 14, fontFamily: font.b }} />
        </div>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div className="banner" style={{ background: banners[bannerIdx].bg, position: "relative" }}>
          <div className="banner-label">Destaque</div>
          <div className="banner-title">{banners[bannerIdx].title}</div>
          <div className="banner-sub">{banners[bannerIdx].sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {banners.map((_, i) => <div key={i} className={`dot ${i === bannerIdx ? "active" : ""}`} onClick={() => setBannerIdx(i)} style={{ width: 7, height: 7, borderRadius: "50%", background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.3)", cursor: "pointer", transition: "all .3s", ...(i === bannerIdx && { width: 22, borderRadius: 4 }) }} />)}
        </div>
      </div>

      <div className="section-header">
        <div className="section-title">Categorias</div>
        <button className="link-btn" onClick={() => nav("categories")}>Ver todas →</button>
      </div>
      <div className="cat-scroll">
        {CATEGORIES.slice(0, 6).map((c, i) => (
          <div key={i} className="cat-card" onClick={() => nav("search", { cat: c.name })}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.dk }}>{c.name}</div>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: 20 }}>
        <div className="section-title">Profissionais</div>
        <button className="link-btn" onClick={() => nav("search")}>Ver mais →</button>
      </div>
      <div className="pro-list">
        {PROS.slice(0, 3).map((p) => (
          <div key={p.id} className="pro-card" onClick={() => nav("profile", p)}>
            <Avatar ini={p.av} size={48} badge={p.badge} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.dk, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: C.g }}>{p.role}</div>
              <div style={{ fontSize: 11, color: C.gL, marginTop: 2 }}>⭐ {p.rating} ({p.reviews})</div>
            </div>
            <div style={{ color: C.pri, fontWeight: 700, fontSize: 13 }}>{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Categories({ nav }) {
  return (
    <div className="screen-content">
      <TopBar title="Categorias" onBack={() => nav("back")} />
      <div className="cat-grid">
        {CATEGORIES.map((c, i) => (
          <div key={i} className="cat-grid-card" onClick={() => nav("search", { cat: c.name })}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontWeight: 700, color: C.dk, fontSize: 13 }}>{c.name}</div>
            <div style={{ fontSize: 11, color: C.gL, marginTop: 4 }}>{c.count} prof.</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Search({ nav, data }) {
  return (
    <div className="screen-content">
      <TopBar title="Buscar" onBack={() => nav("back")} />
      <div className="pro-list" style={{ padding: "16px" }}>
        {PROS.map((p) => (
          <div key={p.id} className="pro-card" onClick={() => nav("profile", p)}>
            <Avatar ini={p.av} size={48} badge={p.badge} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.dk, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: C.g }}>{p.role}</div>
              <div style={{ fontSize: 11, color: C.gL, marginTop: 2 }}>⭐ {p.rating} ({p.reviews})</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile({ nav, data }) {
  const p = data || PROS[0];
  const [fav, setFav] = useState(false);
  return (
    <div className="screen-content" style={{ paddingBottom: 90 }}>
      <TopBar title={p.name} onBack={() => nav("back")} />
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <Avatar ini={p.av} size={64} badge={p.badge} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>⭐ {p.rating} ({p.reviews} avaliações)</div>
        <Btn v="primary" full sz="lg" onClick={() => { trackEvent("Contact", { content_name: p.name }); const msg = encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil.`); window.open(`https://wa.me/${p.whatsapp}?text=${msg}`, "_blank"); }} style={{ marginTop: 16 }}>{I.whatsapp("#fff", 16)} Chamar no WhatsApp</Btn>
      </div>
    </div>
  );
}

function ChatList({ nav }) {
  return <div className="screen-content"><TopBar title="Mensagens" onBack={() => nav("home")} /><div style={{ padding: 20, textAlign: "center", color: C.gL }}>Nenhuma conversa ainda</div></div>;
}

function Notifs({ nav }) {
  return <div className="screen-content"><TopBar title="Notificações" onBack={() => nav("home")} /><div style={{ padding: 20, textAlign: "center", color: C.gL }}>Nenhuma notificação</div></div>;
}

function PlansScreen({ nav, trial }) {
  return <div className="screen-content"><TopBar title="Planos" onBack={() => nav("home")} /><div style={{ padding: 16, textAlign: "center" }}><div style={{ fontFamily: font.d, fontSize: 20, fontWeight: 900 }}>Escolha seu plano</div><p style={{ fontSize: 13, color: C.g, marginTop: 8 }}>7 dias grátis para todos os planos</p></div></div>;
}

function Settings({ nav, trial, user, onLogout }) {
  return (
    <div className="screen-content">
      <TopBar title="Configurações" onBack={() => nav("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: C.priLt, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.pri, marginBottom: 8 }}>Sua Conta</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 4 }}>Nome: {user?.name || "Não identificado"}</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 12 }}>Email: {user?.email || "Não identificado"}</div>
          <Btn v="secondary" full sz="sm">Editar Perfil</Btn>
        </div>

        <div style={{ background: C.accLt, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.acc, marginBottom: 8 }}>Seu Plano</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 4 }}>Status: {user?.badge === "premium" ? "Premium" : user?.badge === "pro" ? "Pro" : "Gratuito"}</div>
          <div style={{ fontSize: 12, color: C.gL, marginBottom: 12 }}>Próxima cobrança: 20 de Janeiro</div>
          <Btn v="secondary" full sz="sm">Gerenciar Plano</Btn>
        </div>

        <div style={{ background: C.corLt, borderRadius: 12, padding: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.cor, marginBottom: 8 }}>Segurança</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 12 }}>Gerenciar sua conta e dados</div>
          <Btn v="secondary" full sz="sm" onClick={onLogout}>{I.logout(C.cor)} Fazer Logout</Btn>
        </div>
      </div>
    </div>
  );
}

function Advertise({ nav }) {
  return <div className="screen-content"><TopBar title="Anuncie" onBack={() => nav("home")} /><div style={{ padding: 20, textAlign: "center", color: C.gL }}>Seção em desenvolvimento</div></div>;
}

export default function App() {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [history, setHistory] = useState(["home"]);
  const scrollRef = useRef(null);
  const { trial, setTrial, trialNotifs } = useTrialSystem();

  const nav = useCallback((s, data = null) => {
    if (s === "back") {
      const h = [...history];
      h.pop();
      setScreen(h[h.length - 1] || "home");
      setHistory(h);
    } else {
      setScreen(s);
      setScreenData(data);
      setHistory(h => [...h, s]);
    }
    scrollRef.current?.scrollTo(0, 0);
  }, [history]);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setLogged(true);
    setScreen("home");
    setHistory(["home"]);
  };

  const handleLogout = () => {
    setLogged(false);
    setUser(null);
    setScreen("home");
    setHistory(["home"]);
  };

  const tabs = [
    { id: "home", icon: I.home, label: "Início" },
    { id: "categories", icon: I.grid, label: "Categorias" },
    { id: "chatlist", icon: I.chat, label: "Chat" },
    { id: "register", icon: I.user, label: logged ? "Perfil" : "Cadastro" }
  ];
  const activeTab = ["home", "categories", "chatlist", "register"].includes(screen) ? screen : null;

  const renderScreen = () => {
    if (!logged) {
      return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    switch (screen) {
      case "home": return <Home nav={nav} trial={trial} user={user} />;
      case "categories": return <Categories nav={nav} />;
      case "search": return <Search nav={nav} data={screenData} />;
      case "profile": return <Profile nav={nav} data={screenData} />;
      case "chatlist": return <ChatList nav={nav} />;
      case "notifs": return <Notifs nav={nav} />;
      case "plans": return <PlansScreen nav={nav} trial={trial} />;
      case "register": return <RegisterProfessional onBack={() => nav("home")} onSuccess={(data) => { trackEvent('Subscribe', { value: parseInt(data.plan === "VIP" ? 399 : data.plan === "Premium" ? 199 : 99), currency: 'BRL' }); handleLoginSuccess(data); }} nav={nav} />;
      case "advertise": return <Advertise nav={nav} />;
      case "settings": return <Settings nav={nav} trial={trial} user={user} onLogout={handleLogout} />;
      default: return <Home nav={nav} trial={trial} user={user} />;
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;height:0;}
        body{font-family:'DM Sans',sans-serif;background:#000;}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
        .anim-in{animation:fadeInUp .45s ease forwards}.anim-fade{animation:fadeIn .35s ease forwards}.anim-slide{animation:slideIn .4s ease forwards}
        .d1{animation-delay:.05s;opacity:0}.d2{animation-delay:.1s;opacity:0}.d3{animation-delay:.15s;opacity:0}.d4{animation-delay:.2s;opacity:0}.d5{animation-delay:.25s;opacity:0}.d6{animation-delay:.3s;opacity:0}
        .app-shell{max-width:480px;margin:0 auto;height:100vh;height:100dvh;background:${C.w};position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.12);}
        .app-scroll{height:100%;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
        .screen-content{padding-bottom:80px;min-height:100%;}
        .icon-btn{width:38px;height:38px;border-radius:11px;border:1.5px solid ${C.gB};background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;position:relative;}
        .notif-dot{position:absolute;top:7px;right:7px;width:7px;height:7px;border-radius:50%;background:${C.cor};border:1.5px solid #fff;}
        .search-bar{display:flex;align-items:center;gap:8px;background:${C.gBg};border:2px solid transparent;border-radius:14px;padding:10px 12px;transition:all .2s;}
        .search-bar.focused{background:#fff;border-color:${C.pri};box-shadow:0 0 0 4px ${C.priGlow};}
        .filter-pill{width:34px;height:34px;border-radius:10px;border:none;background:${C.pri};cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
        .banner{border-radius:16px;padding:20px;min-height:110px;position:relative;overflow:hidden;}
        .banner-label{position:absolute;top:10px;right:10px;background:rgba(255,255,255,.2);border-radius:5px;padding:2px 7px;font-size:9px;font-weight:700;color:#fff;letter-spacing:.04em;text-transform:uppercase;}
        .banner-title{font-family:${font.d};font-size:20px;font-weight:800;color:#fff;margin-bottom:4px;}
        .banner-sub{font-size:12px;color:rgba(255,255,255,.85);line-height:1.4;}
        .dot{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.3);cursor:pointer;transition:all .3s;}
        .dot.active{width:22px;border-radius:4px;background:#fff;}
        .stats-row{display:flex;gap:8px;padding:10px 16px 0;}
        .stat-card{flex:1;background:#fff;border-radius:12px;padding:12px 8px;border:1.5px solid ${C.gB};text-align:center;}
        .section-header{display:flex;justify-content:space-between;align-items:center;padding:16px 16px 10px;}
        .section-title{font-family:${font.d};font-size:17px;font-weight:800;color:${C.dk};}
        .link-btn{background:none;border:none;color:${C.pri};font-size:12px;font-weight:700;cursor:pointer;font-family:${font.b};}
        .cat-scroll{display:flex;gap:8px;padding:0 16px;overflow-x:auto;-webkit-overflow-scrolling:touch;}
        .cat-card{min-width:72px;max-width:72px;background:#fff;border-radius:14px;border:1.5px solid ${C.gB};padding:12px 8px;text-align:center;cursor:pointer;flex-shrink:0;}
        .cat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px 16px;}
        .cat-grid-card{background:#fff;border-radius:14px;border:1.5px solid ${C.gB};padding:16px 8px;text-align:center;cursor:pointer;}
        .pro-list{padding:0 16px;display:flex;flex-direction:column;gap:8px;}
        .pro-card{background:#fff;border-radius:14px;padding:14px;border:1.5px solid ${C.gB};cursor:pointer;display:flex;gap:12px;align-items:center;}
        .ad-cta{background:${C.accLt};border-radius:12px;padding:14px 16px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;border:1.5px solid ${C.acc}22;}
        .filter-scroll{display:flex;gap:7px;padding:10px 16px;overflow-x:auto;}
        .filter-chip{padding:8px 14px;border-radius:10px;border:none;background:${C.gBg};color:${C.g};font-size:12px;font-weight:600;cursor:pointer;font-family:${font.b};white-space:nowrap;text-transform:capitalize;}
        .filter-chip.active{background:${C.pri};color:#fff;}
        .bottom-nav{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.97);backdrop-filter:blur(16px);border-top:1px solid ${C.gB};display:flex;padding:6px 8px 10px;max-width:480px;margin:0 auto;width:100%;}
        .nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;background:none;border:none;cursor:pointer;padding:5px 0;}
        .nav-label{font-size:10px;font-weight:500;color:${C.gL};font-family:${font.b};}
        .nav-label.active{font-weight:700;color:${C.pri};}
        .nav-dot{width:4px;height:4px;border-radius:2px;background:${C.pri};margin-top:1px;}
      `}</style>
      <div className="app-shell">
        <div ref={scrollRef} className="app-scroll">
          {renderScreen()}
        </div>
        {logged && activeTab && (
          <div className="bottom-nav">
            {tabs.map(tab => {
              const active = activeTab === tab.id;
              return (
                <button key={tab.id} onClick={() => nav(tab.id)} className="nav-tab">
                  {tab.icon(active ? C.pri : C.gL)}
                  <span className={`nav-label ${active ? "active" : ""}`}>{tab.label}</span>
                  {active && <div className="nav-dot" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
