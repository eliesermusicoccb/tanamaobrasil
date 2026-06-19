import { useState, useEffect, useRef, useCallback } from "react";
import RegisterProfessional from "./RegisterProfessional";
import Login from "./Login";

// ══════════════════════════════════════════════════════════════
// SUPABASE INIT - INLINE
// ══════════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://awkabegjsamyeqdwcngt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3a2FiZWdqc2FteWVxZHdjbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2MDAsImV4cCI6MjA5NzIyNjYwMH0.TKZjFZ6lmpDbOwD_wEdo5jJdqVWywLRoR3gkaSvtO7o';

let supabase = null;

function initSupabase() {
  if (!supabase && window.supabase) {
    const { createClient } = window.supabase;
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

async function createUser(userData) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').insert([userData]).select();
    return { data: data?.[0], error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function getUserByEmail(email) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').select('*').eq('email', email).single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function createSubscription(subData) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('subscriptions').insert([subData]).select();
    return { data: data?.[0], error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Expõe globalmente
window.SupabaseAPI = { initSupabase, createUser, getUserByEmail, createSubscription };

// ══════════════════════════════════════════════════════════════
// DESIGN SYSTEM
// ══════════════════════════════════════════════════════════════
const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0",
  cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937",
  g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

function trackEvent(event, data) {
  try { 
    if(window.fbq) window.fbq('track', event, data); 
  } catch(e) {}
}

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
    desc:"Mais de 15 anos no mercado.",
    whatsapp:"5511999990001", categories:["Eletricista","Instalações","Manutenção"],
    userReviews:[
      {n:"Maria S.",r:5,t:"Excelente! Pontual e muito atencioso.",d:"2 dias atrás"},
      {n:"Pedro L.",r:5,t:"Trabalho impecável, super recomendo.",d:"1 semana atrás"},
    ]},
  { id:2, name:"Ana Oliveira", role:"Designer de Interiores", rating:4.8, reviews:89, city:"Rio de Janeiro, RJ", price:"R$ 150", badge:"pro", av:"AO", on:true,
    desc:"Projetos residenciais e corporativos.",
    whatsapp:"5521999990002", categories:["Design","Interiores","Consultoria"],
    userReviews:[{n:"Lucas M.",r:5,t:"Projeto incrível!",d:"3 dias atrás"}]},
  { id:3, name:"Roberto Santos", role:"Encanador", rating:4.7, reviews:203, city:"Belo Horizonte, MG", price:"R$ 60", badge:"premium", av:"RS", on:false,
    desc:"Especialista em instalações hidráulicas.",
    whatsapp:"5531999990003", categories:["Encanador","Hidráulica"]},
  { id:4, name:"Mariana Costa", role:"Fotógrafa", rating:5.0, reviews:56, city:"Curitiba, PR", price:"R$ 200", badge:"pro", av:"MC", on:true,
    desc:"Fotografia de eventos e ensaios.",
    whatsapp:"5541999990004", categories:["Fotografia","Eventos","Produto"]},
];

const I = {
  home: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  grid: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  back: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>,
  search: (c) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  whatsapp: (c, s) => <svg width={s} height={s} viewBox="0 0 24 24" fill={c}><path d="M17.6 6.3c-1.5-1.5-3.5-2.3-5.6-2.3-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1.1 4L2 22l4.2-1.1c1.2.6 2.5 1 3.9 1h.1c4.4 0 8-3.6 8-8 0-2.1-.9-4.2-2.5-5.7zM12 20.1c-1.2 0-2.4-.3-3.5-.9l-.3-.1-2.8.7.7-2.8-.1-.3c-.6-1.1-.9-2.3-.9-3.5 0-3.6 3-6.6 6.6-6.6 1.8 0 3.5.7 4.8 2 1.2 1.2 1.9 2.9 1.9 4.7 0 3.6-3 6.6-6.7 6.6z"/></svg>,
  logout: (c) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5m0 0l-5-5" /></svg>,
};

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

function TopBar({ title, onBack }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: `1px solid ${C.gB}` }}>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>{I.back(C.g)}</button>
      <h1 style={{ fontFamily: font.d, fontSize: 18, fontWeight: 800, color: C.dk }}>{title}</h1>
      <div style={{ width: 24 }}/>
    </div>
  );
}

function VisitorHome({ nav, onLogin }) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const banners = [
    { title: "Encontre profissionais", sub: "De forma rápida e segura", bg: `linear-gradient(135deg, ${C.pri}, ${C.priDk})` },
    { title: "Qualidade garantida", sub: "Profissionais avaliados", bg: `linear-gradient(135deg, ${C.acc}, #D68910)` },
    { title: "Suporte 24/7", sub: "Sempre pronto para ajudar", bg: `linear-gradient(135deg, ${C.cor}, #D1441A)` },
  ];
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000); return () => clearInterval(t); }, []);
  
  return (
    <div className="screen-content">
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.d, fontSize: 28, fontWeight: 900, color: C.dk }}>TáNaMão</div>
        <button onClick={onLogin} style={{ padding: "8px 16px", background: C.pri, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>Entrar</button>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.gBg, borderRadius: 14, padding: "10px 12px" }}>
          {I.search(C.gL)}
          <input type="text" placeholder="Procurar profissional..." style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: 14, fontFamily: font.b }} />
        </div>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ background: banners[bannerIdx].bg, borderRadius: 16, padding: 20, position: "relative" }}>
          <div style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: "#fff", marginBottom: 4 }}>{banners[bannerIdx].title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.85)" }}>{banners[bannerIdx].sub}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {banners.map((_, i) => <div key={i} onClick={() => setBannerIdx(i)} style={{ width: i === bannerIdx ? 22 : 7, height: 7, borderRadius: i === bannerIdx ? 4 : "50%", background: i === bannerIdx ? "#fff" : "rgba(255,255,255,.3)", cursor: "pointer", transition: "all .3s" }} />)}
        </div>
      </div>

      <div style={{ padding: "16px 16px 10px" }}>
        <div style={{ fontFamily: font.d, fontSize: 17, fontWeight: 800, color: C.dk }}>Categorias</div>
      </div>
      <div style={{ display: "flex", gap: 8, padding: "0 16px", overflowX: "auto" }}>
        {CATEGORIES.slice(0, 6).map((c, i) => (
          <div key={i} onClick={() => nav("search", { cat: c.name })} style={{ minWidth: 72, background: "#fff", borderRadius: 14, border: `1.5px solid ${C.gB}`, padding: "12px 8px", textAlign: "center", cursor: "pointer", flexShrink: 0 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.dk }}>{c.name}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 16px 10px" }}>
        <div style={{ fontFamily: font.d, fontSize: 17, fontWeight: 800, color: C.dk }}>Profissionais</div>
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {PROS.slice(0, 3).map((p) => (
          <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
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

function VisitorSearch({ nav }) {
  return (
    <div className="screen-content">
      <TopBar title="Buscar" onBack={() => nav("back")} />
      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {PROS.map((p) => (
          <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
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

function VisitorProfile({ nav, data, onNeedLogin }) {
  const p = data || PROS[0];
  return (
    <div className="screen-content" style={{ paddingBottom: 90 }}>
      <TopBar title={p.name} onBack={() => nav("back")} />
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <Avatar ini={p.av} size={64} badge={p.badge} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>⭐ {p.rating} ({p.reviews} avaliações)</div>

        <button onClick={() => { const msg = encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil.`); window.open(`https://wa.me/${p.whatsapp}?text=${msg}`, "_blank"); }} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.pri, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          {I.whatsapp("#fff", 16)} Chamar no WhatsApp
        </button>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.dk, marginBottom: 12 }}>Avaliações ({p.userReviews?.length || 0})</h3>
          {p.userReviews?.map((rev, i) => (
            <div key={i} style={{ background: C.gBg, borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontWeight: 700, color: C.dk }}>{rev.n}</div>
                <div>{"⭐".repeat(rev.r)}</div>
              </div>
              <div style={{ fontSize: 13, color: C.dk }}>{rev.t}</div>
              <div style={{ fontSize: 11, color: C.gL, marginTop: 4 }}>{rev.d}</div>
            </div>
          ))}
        </div>

        <button onClick={onNeedLogin} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.acc, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          ➕ Adicionar Avaliação
        </button>
      </div>
    </div>
  );
}

function LoggedHome({ nav, user }) {
  const [bannerIdx, setBannerIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i + 1) % 2), 4000); return () => clearInterval(t); }, []);
  
  return (
    <div className="screen-content">
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.d, fontSize: 28, fontWeight: 900, color: C.dk }}>TáNaMão</div>
        <button onClick={() => nav("settings")} style={{ width: 38, height: 38, borderRadius: 11, border: `1.5px solid ${C.gB}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</button>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.pri}, ${C.priDk})`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: "#fff" }}>Bem-vindo, {user.name}!</div>
        </div>
      </div>

      <div style={{ padding: "16px 16px 10px" }}>
        <div style={{ fontFamily: font.d, fontSize: 17, fontWeight: 800, color: C.dk }}>Profissionais</div>
      </div>
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {PROS.slice(0, 3).map((p) => (
          <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
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

function LoggedProfile({ nav, data, user }) {
  const p = data || PROS[0];
  return (
    <div className="screen-content" style={{ paddingBottom: 90 }}>
      <TopBar title={p.name} onBack={() => nav("back")} />
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <Avatar ini={p.av} size={64} badge={p.badge} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>⭐ {p.rating} ({p.reviews} avaliações)</div>

        <button onClick={() => { const msg = encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil.`); window.open(`https://wa.me/${p.whatsapp}?text=${msg}`, "_blank"); }} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.pri, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          {I.whatsapp("#fff", 16)} Chamar no WhatsApp
        </button>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.dk, marginBottom: 12 }}>Avaliações ({p.userReviews?.length || 0})</h3>
          {p.userReviews?.map((rev, i) => (
            <div key={i} style={{ background: C.gBg, borderRadius: 10, padding: 12, marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ fontWeight: 700, color: C.dk }}>{rev.n}</div>
                <div>{"⭐".repeat(rev.r)}</div>
              </div>
              <div style={{ fontSize: 13, color: C.dk }}>{rev.t}</div>
              <div style={{ fontSize: 11, color: C.gL, marginTop: 4 }}>{rev.d}</div>
            </div>
          ))}
        </div>

        <button onClick={() => nav("review", p)} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.acc, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          ➕ Adicionar Avaliação
        </button>
      </div>
    </div>
  );
}

function Settings({ nav, user, onLogout }) {
  return (
    <div className="screen-content">
      <TopBar title="Configurações" onBack={() => nav("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: C.priLt, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.pri, marginBottom: 8 }}>Sua Conta</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 4 }}>Nome: {user?.name}</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 12 }}>Email: {user?.email}</div>
          <button style={{ width: "100%", padding: "8px", background: C.gBg, color: C.dk, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.b }}>Editar Perfil</button>
        </div>

        <div style={{ background: C.corLt, borderRadius: 12, padding: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.cor, marginBottom: 8 }}>Segurança</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 12 }}>Gerenciar sua conta</div>
          <button onClick={onLogout} style={{ width: "100%", padding: "8px", background: C.gBg, color: C.cor, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.b }}>Fazer Logout</button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("visitor");
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [history, setHistory] = useState(["home"]);
  const scrollRef = useRef(null);

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

  const renderScreen = () => {
    if (mode === "login") {
      return <Login onLoginSuccess={(userData) => { setUser(userData); setMode("logged"); setScreen("home"); setHistory(["home"]); }} />;
    }

    if (mode === "visitor") {
      switch (screen) {
        case "home": return <VisitorHome nav={nav} onLogin={() => setMode("login")} />;
        case "search": return <VisitorSearch nav={nav} />;
        case "profile": return <VisitorProfile nav={nav} data={screenData} onNeedLogin={() => setMode("login")} />;
        default: return <VisitorHome nav={nav} onLogin={() => setMode("login")} />;
      }
    }

    if (mode === "logged") {
      switch (screen) {
        case "home": return <LoggedHome nav={nav} user={user} />;
        case "profile": return <LoggedProfile nav={nav} data={screenData} user={user} />;
        case "settings": return <Settings nav={nav} user={user} onLogout={() => { setMode("visitor"); setUser(null); setScreen("home"); setHistory(["home"]); }} />;
        case "register": return <RegisterProfessional onBack={() => nav("home")} onSuccess={(data) => { setUser(data); nav("home"); }} nav={nav} />;
        default: return <LoggedHome nav={nav} user={user} />;
      }
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;height:0;}
        body{font-family:'DM Sans',sans-serif;background:#000;}
        .app-shell{max-width:480px;margin:0 auto;height:100vh;height:100dvh;background:${C.w};position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.12);}
        .app-scroll{height:100%;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
        .screen-content{padding-bottom:20px;min-height:100%;}
      `}</style>
      <div className="app-shell">
        <div ref={scrollRef} className="app-scroll">
          {renderScreen()}
        </div>
      </div>
    </>
  );
}
