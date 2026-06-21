import { useState, useEffect, useRef, useCallback } from "react";
import RegisterProfessional from "./RegisterProfessional";
import Login from "./Login";
import { iniciarPagamento } from "./services/mercadopago-service";

// ══════════════════════════════════════════════════════════════
// SUPABASE INIT
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
    const { data, error } = await sb.from('professionals').select('*').eq('email', email).limit(1);
    if (error) return { data: null, error };
    return { data: data && data.length > 0 ? data[0] : null, error: null };
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

// ---- Autenticação segura (Supabase Auth) ----
async function signUpUser(email, password, metadata) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: { message: 'Supabase não carregou' } };
  return await sb.auth.signUp({ email, password, options: { data: metadata || {} } });
}

async function signInUser(email, password) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: { message: 'Supabase não carregou' } };
  return await sb.auth.signInWithPassword({ email, password });
}

async function signOutUser() {
  const sb = supabase || initSupabase();
  if (!sb) return;
  return await sb.auth.signOut();
}

async function resetPassword(email) {
  const sb = supabase || initSupabase();
  if (!sb) return { error: { message: 'Supabase não carregou' } };
  return await sb.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
}

async function updatePassword(newPassword) {
  const sb = supabase || initSupabase();
  if (!sb) return { error: { message: 'Supabase não carregou' } };
  return await sb.auth.updateUser({ password: newPassword });
}

async function getProfileById(id) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').select('*').eq('id', id).limit(1);
    if (error) return { data: null, error };
    return { data: data && data.length > 0 ? data[0] : null, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function updateProfile(id, fields) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').update(fields).eq('id', id).select();
    return { data: data && data.length > 0 ? data[0] : null, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

window.SupabaseAPI = {
  initSupabase, createUser, getUserByEmail, createSubscription,
  signUpUser, signInUser, signOutUser, resetPassword, updatePassword, getProfileById, updateProfile,
};

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
  { id:1, name:"Carlos Silva", role:"Eletricista", rating:4.9, reviews:127, city:"São Paulo", uf:"SP", price:"R$ 80", badge:"premium", av:"CS", on:true,
    whatsapp:"5511999990001", categories: ["Eletricista"],
    userReviews:[
      {n:"Maria S.",r:5,t:"Excelente! Pontual e muito atencioso.",d:"2 dias atrás"},
      {n:"Pedro L.",r:5,t:"Trabalho impecável, super recomendo.",d:"1 semana atrás"},
    ]},
  { id:2, name:"Ana Oliveira", role:"Designer de Interiores", rating:4.8, reviews:89, city:"Rio de Janeiro", uf:"RJ", price:"R$ 150", badge:"pro", av:"AO", on:true,
    whatsapp:"5521999990002", categories: ["Design"],
    userReviews:[{n:"Lucas M.",r:5,t:"Projeto incrível!",d:"3 dias atrás"}]},
  { id:3, name:"Roberto Santos", role:"Encanador", rating:4.7, reviews:203, city:"Belo Horizonte", uf:"MG", price:"R$ 60", badge:"premium", av:"RS", on:false,
    whatsapp:"5531999990003", categories: ["Encanador"]},
  { id:4, name:"Mariana Costa", role:"Fotógrafa", rating:5.0, reviews:56, city:"Curitiba", uf:"PR", price:"R$ 200", badge:"pro", av:"MC", on:true,
    whatsapp:"5541999990004", categories: ["Fotografia"]},
  { id:5, name:"João Técnico", role:"Técnico TI", rating:4.6, reviews:45, city:"São Paulo", uf:"SP", price:"R$ 120", badge: null, av:"JT", on:true,
    whatsapp:"5511999990005", categories: ["Técnico TI"]},
];

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
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>←</button>
      <h1 style={{ fontFamily: font.d, fontSize: 18, fontWeight: 800, color: C.dk }}>{title}</h1>
      <div style={{ width: 24 }}/>
    </div>
  );
}

function VisitorHome({ nav, onLogin, onRegister }) {
  const [bannerIdx, setBannerIdx] = useState(0);
  const banners = [
    { title: "Encontre profissionais", sub: "De forma rápida e segura", bg: `linear-gradient(135deg, ${C.pri}, ${C.priDk})` },
    { title: "Qualidade garantida", sub: "Profissionais avaliados", bg: `linear-gradient(135deg, ${C.acc}, #D68910)` },
  ];
  useEffect(() => { const t = setInterval(() => setBannerIdx(i => (i + 1) % banners.length), 4000); return () => clearInterval(t); }, []);
  
  return (
    <div className="screen-content">
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.d, fontSize: 28, fontWeight: 900, color: C.dk }}>TáNaMão</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={onLogin} style={{ padding: "8px 12px", background: C.gBg, color: C.pri, border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>Entrar</button>
          <button onClick={onRegister} style={{ padding: "8px 12px", background: C.pri, color: "#fff", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>Cadastrar</button>
        </div>
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.gBg, borderRadius: 14, padding: "10px 12px" }}>
          <input type="text" placeholder="Procurar profissional..." style={{ flex: 1, border: "none", background: "none", outline: "none", fontSize: 14, fontFamily: font.b }} />
          <button onClick={() => nav("search")} style={{ background: "none", border: "none", cursor: "pointer", color: C.pri, fontSize: 18, padding: 0 }}>🔍</button>
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
          <div key={i} onClick={() => nav("search")} style={{ minWidth: 72, background: "#fff", borderRadius: 14, border: `1.5px solid ${C.gB}`, padding: "12px 8px", textAlign: "center", cursor: "pointer", flexShrink: 0 }}>
            <div style={{ fontSize: 28, marginBottom: 4 }}>{c.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: C.dk }}>{c.name}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "20px 16px 10px" }}>
        <div style={{ fontFamily: font.d, fontSize: 17, fontWeight: 800, color: C.dk }}>Profissionais próximos</div>
      </div>
      <div style={{ padding: "0 16px 100px", display: "flex", flexDirection: "column", gap: 8 }}>
        {PROS.slice(0, 3).map((p) => (
          <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
            <Avatar ini={p.av} size={48} badge={p.badge} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, color: C.dk, fontSize: 14 }}>{p.name}</div>
              <div style={{ fontSize: 12, color: C.g }}>{p.role} • {p.city}, {p.uf}</div>
              <div style={{ fontSize: 11, color: C.gL, marginTop: 2 }}>⭐ {p.rating} ({p.reviews})</div>
            </div>
            <div style={{ color: C.pri, fontWeight: 700, fontSize: 13 }}>{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisitorSearch({ nav, searchFilter, setSearchFilter }) {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [sortBy, setSortBy] = useState("rating");

  const filtered = PROS.filter(p => {
    const matchSearch = !searchFilter || p.name.toLowerCase().includes(searchFilter.toLowerCase()) || p.role.toLowerCase().includes(searchFilter.toLowerCase());
    const matchCat = !filterCategory || p.categories.includes(filterCategory);
    const matchCity = !filterCity || p.city.toLowerCase().includes(filterCity.toLowerCase());
    return matchSearch && matchCat && matchCity;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    if (sortBy === "price") return parseInt(a.price) - parseInt(b.price);
    return 0;
  });

  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title="Buscar" onBack={() => nav("home")} />
      
      <div style={{ padding: "16px", borderBottom: `1px solid ${C.gB}` }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input 
            type="text" 
            value={searchFilter} 
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Nome ou profissão..." 
            style={{ flex: 1, padding: "10px 12px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 13, outline: "none", fontFamily: font.b }} 
          />
          <button style={{ background: C.pri, color: "#fff", border: "none", borderRadius: 10, width: 44, cursor: "pointer", fontSize: 18 }}>🔍</button>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 12, overflowX: "auto" }}>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={{ padding: "8px 10px", border: `1.5px solid ${C.gB}`, borderRadius: 10, fontSize: 12, outline: "none", fontFamily: font.b }}>
            <option value="">Todas categorias</option>
            {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>

          <input 
            type="text" 
            value={filterCity} 
            onChange={(e) => setFilterCity(e.target.value)}
            placeholder="Cidade..." 
            style={{ padding: "8px 10px", border: `1.5px solid ${C.gB}`, borderRadius: 10, fontSize: 12, outline: "none", fontFamily: font.b, minWidth: 100 }} 
          />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: "8px 10px", border: `1.5px solid ${C.gB}`, borderRadius: 10, fontSize: 12, outline: "none", fontFamily: font.b }}>
            <option value="rating">⭐ Avaliação</option>
            <option value="reviews">💬 Mais avaliados</option>
            <option value="price">💰 Preço</option>
          </select>
        </div>

        {filtered.length > 0 && <div style={{ fontSize: 11, color: C.gL }}>Encontrados: {filtered.length}</div>}
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar ini={p.av} size={48} badge={p.badge} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: C.dk, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.g }}>{p.role}</div>
                <div style={{ fontSize: 11, color: C.gL, marginTop: 2 }}>📍 {p.city}, {p.uf} • ⭐ {p.rating}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: C.pri, fontWeight: 700, fontSize: 13 }}>{p.price}</div>
                <div style={{ fontSize: 10, color: p.on ? C.pri : C.gL }}>
                  {p.on ? "🟢 Online" : "🔴 Offline"}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 16px", color: C.gL }}>
            Nenhum profissional encontrado
          </div>
        )}
      </div>
    </div>
  );
}

function VisitorProfile({ nav, data, onNeedLogin }) {
  const p = data || PROS[0];
  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title={p.name} onBack={() => nav("home")} />
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <Avatar ini={p.av} size={64} badge={p.badge} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>📍 {p.city}, {p.uf} • ⭐ {p.rating} ({p.reviews} avaliações)</div>

        <button onClick={() => { const msg = encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil.`); window.open(`https://wa.me/${p.whatsapp}?text=${msg}`, "_blank"); }} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.pri, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          💬 Chamar no WhatsApp
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
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log("Geolocalização negada", err)
      );
    }
  }, []);

  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <div style={{ padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontFamily: font.d, fontSize: 28, fontWeight: 900, color: C.dk }}>TáNaMão</div>
        <button onClick={() => nav("settings")} style={{ width: 38, height: 38, borderRadius: 11, border: `1.5px solid ${C.gB}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>⚙️</button>
      </div>

      <div style={{ padding: "0 16px 20px" }}>
        <div style={{ background: `linear-gradient(135deg, ${C.pri}, ${C.priDk})`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: "#fff" }}>Bem-vindo, {user.name}!</div>
          {userLocation && <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginTop: 8 }}>📍 Localização ativa</div>}
        </div>
      </div>

      <div style={{ padding: "16px 16px 10px" }}>
        <div style={{ fontFamily: font.d, fontSize: 17, fontWeight: 800, color: C.dk }}>Profissionais próximos</div>
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
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title={p.name} onBack={() => nav("home")} />
      <div style={{ padding: "20px 16px", textAlign: "center" }}>
        <Avatar ini={p.av} size={64} badge={p.badge} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>⭐ {p.rating} ({p.reviews} avaliações)</div>

        <button onClick={() => { const msg = encodeURIComponent(`Olá ${p.name}! Vi seu perfil no TáNaMão Brasil.`); window.open(`https://wa.me/${p.whatsapp}?text=${msg}`, "_blank"); }} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.pri, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          💬 Chamar no WhatsApp
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

        <button onClick={() => nav("home")} style={{ width: "100%", padding: "14px", marginTop: 16, background: C.acc, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>
          ➕ Adicionar Avaliação
        </button>
      </div>
    </div>
  );
}

function ChatScreen({ nav }) {
  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title="Chat" onBack={() => nav("home")} />
      <div style={{ padding: 20, textAlign: "center", color: C.gL }}>
        Nenhuma conversa ainda
      </div>
    </div>
  );
}

function Settings({ nav, user, onLogout }) {
  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title="Configurações" onBack={() => nav("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: C.priLt, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.pri, marginBottom: 8 }}>Sua Conta</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 4 }}>Nome: {user?.name}</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 12 }}>Email: {user?.email}</div>
          <button onClick={() => nav("editar")} style={{ width: "100%", padding: "8px", background: C.gBg, color: C.dk, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.b }}>Editar Perfil</button>
        </div>

        <div style={{ background: C.accLt, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.acc, marginBottom: 8 }}>Planos</div>
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 12 }}>Destaque seu perfil e apareça primeiro nas buscas.</div>
          <button onClick={() => nav("planos")} style={{ width: "100%", padding: "10px", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>Ver planos e assinar</button>
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

function PlanosScreen({ nav, user }) {
  const [loading, setLoading] = useState(null);
  const [erro, setErro] = useState("");

  const assinar = async (planoId) => {
    try {
      setErro("");
      setLoading(planoId);
      await iniciarPagamento(planoId, user);
      // a partir daqui o navegador é redirecionado para o Mercado Pago
    } catch (e) {
      setErro("Não foi possível iniciar o pagamento. Tente novamente em instantes.");
      setLoading(null);
    }
  };

  const planos = [
    { id: "pro", nome: "Pro", preco: "R$ 29,90", periodo: "/mês", destaque: false,
      feats: ["Destaque nas buscas", "Selo verificado", "Chat ilimitado"] },
    { id: "premium", nome: "Premium", preco: "R$ 69,90", periodo: "/mês", destaque: true,
      feats: ["1º lugar nas buscas", "Banner publicitário incluso", "Suporte prioritário"] },
  ];

  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title="Planos" onBack={() => nav("settings")} />
      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: 13, color: C.g, textAlign: "center", marginBottom: 16 }}>
          Escolha um plano para impulsionar seu perfil.
        </p>

        {erro && (
          <div style={{ background: C.corLt, color: C.cor, padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 14, textAlign: "center" }}>
            {erro}
          </div>
        )}

        {planos.map((p) => (
          <div key={p.id} style={{ background: p.destaque ? C.priLt : "#fff", border: `2px solid ${p.destaque ? C.pri : C.gB}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: font.d, fontSize: 18, fontWeight: 800, color: C.dk }}>{p.nome}</div>
              <div><span style={{ fontSize: 22, fontWeight: 900, color: C.pri, fontFamily: font.d }}>{p.preco}</span><span style={{ fontSize: 12, color: C.gL }}>{p.periodo}</span></div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "12px 0" }}>
              {p.feats.map((f, i) => (
                <li key={i} style={{ fontSize: 13, color: C.dk, padding: "5px 0" }}>✓ {f}</li>
              ))}
            </ul>
            <button onClick={() => assinar(p.id)} disabled={loading === p.id} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading === p.id ? "wait" : "pointer", fontFamily: font.d, opacity: loading === p.id ? 0.7 : 1 }}>
              {loading === p.id ? "Abrindo pagamento..." : "Assinar"}
            </button>
          </div>
        ))}

        <p style={{ fontSize: 11, color: C.gL, textAlign: "center", marginTop: 8 }}>
          Pagamento processado com segurança pelo Mercado Pago.
        </p>
      </div>
    </div>
  );
}

function PaymentStatusOverlay({ status, onClose }) {
  const cfg = {
    sucesso: { cor: C.pri, icone: "✓", titulo: "Pagamento aprovado!", msg: "Recebemos seu pagamento. Em instantes seu plano estará ativo." },
    pendente: { cor: C.acc, icone: "⏳", titulo: "Pagamento pendente", msg: "Estamos aguardando a confirmação. Você será avisado assim que for aprovado." },
    erro: { cor: C.cor, icone: "✕", titulo: "Pagamento não concluído", msg: "Não foi possível concluir o pagamento. Você pode tentar novamente quando quiser." },
  }[status] || null;
  if (!cfg) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: "32px 24px", maxWidth: 360, width: "100%", textAlign: "center", borderTop: `4px solid ${cfg.cor}` }}>
        <div style={{ fontSize: 48, color: cfg.cor, marginBottom: 12 }}>{cfg.icone}</div>
        <h2 style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: cfg.cor, marginBottom: 10 }}>{cfg.titulo}</h2>
        <p style={{ fontSize: 14, color: C.g, marginBottom: 20, lineHeight: 1.5 }}>{cfg.msg}</p>
        <button onClick={onClose} style={{ width: "100%", padding: "12px", background: cfg.cor, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>Fechar</button>
      </div>
    </div>
  );
}

function EditProfile({ nav, user, onUpdated }) {
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  const [f, setF] = useState({ name: "", whatsapp: "", city: "", bio: "" });

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { data } = await window.SupabaseAPI.getProfileById(user?.id);
        if (ativo && data) {
          setF({
            name: data.name || "",
            whatsapp: data.whatsapp || "",
            city: data.city || "",
            bio: data.bio || "",
          });
        }
      } catch (e) {}
      if (ativo) setCarregando(false);
    })();
    return () => { ativo = false; };
  }, [user?.id]);

  const salvar = async () => {
    setErro(""); setOk(false);
    if (!f.name.trim()) { setErro("O nome não pode ficar vazio."); return; }
    setSalvando(true);
    try {
      const fields = {
        name: f.name.trim(),
        whatsapp: f.whatsapp.trim(),
        city: f.city.trim(),
        bio: f.bio.trim(),
        avatar_initials: f.name.trim().substring(0, 2).toUpperCase(),
      };
      const { error } = await window.SupabaseAPI.updateProfile(user.id, fields);
      if (error) throw error;
      setOk(true);
      if (onUpdated) onUpdated({ name: fields.name, avatar_initials: fields.avatar_initials });
    } catch (e) {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const inputStyle = { width: "100%", padding: "12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", fontFamily: font.b, marginBottom: 14 };
  const labelStyle = { display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 };

  return (
    <div className="screen-content" style={{ paddingBottom: 100 }}>
      <TopBar title="Editar Perfil" onBack={() => nav("settings")} />
      <div style={{ padding: 16 }}>
        {carregando ? (
          <p style={{ fontSize: 14, color: C.gL, textAlign: "center", marginTop: 20 }}>Carregando seus dados...</p>
        ) : (
          <>
            {erro && <div style={{ background: C.corLt, color: C.cor, border: `1px solid ${C.cor}`, borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, fontWeight: 600 }}>{erro}</div>}
            {ok && <div style={{ background: C.priLt, color: C.priDk, border: `1px solid ${C.pri}`, borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 12, fontWeight: 600 }}>Perfil atualizado com sucesso!</div>}

            <label style={labelStyle}>Nome</label>
            <input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} disabled={salvando} />

            <label style={labelStyle}>WhatsApp</label>
            <input style={inputStyle} value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} placeholder="Ex: 5511999998888" disabled={salvando} />

            <label style={labelStyle}>Cidade</label>
            <input style={inputStyle} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} disabled={salvando} />

            <label style={labelStyle}>Bio</label>
            <textarea style={{ ...inputStyle, resize: "vertical" }} rows="4" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} disabled={salvando} />

            <button onClick={salvar} disabled={salvando} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: salvando ? "wait" : "pointer", fontFamily: font.d, opacity: salvando ? 0.6 : 1, marginTop: 4 }}>
              {salvando ? "Salvando..." : "Salvar alterações"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function NovaSenhaScreen({ onConcluido }) {
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);

  const salvar = async () => {
    setErro("");
    if (senha.length < 8) { setErro("A senha deve ter no mínimo 8 caracteres."); return; }
    if (senha !== senha2) { setErro("As senhas não são iguais."); return; }
    setLoading(true);
    try {
      const { error } = await window.SupabaseAPI.updatePassword(senha);
      if (error) throw error;
      setOk(true);
      await window.SupabaseAPI.signOutUser();
    } catch (e) {
      setErro("Não foi possível salvar a nova senha. Abra o link do email novamente e tente de novo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.w, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 20 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap'); *{margin:0;padding:0;box-sizing:border-box;}`}</style>
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontFamily: font.d, fontSize: 36, fontWeight: 900, color: C.pri }}>TáNaMão</div>
      </div>
      <div style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 16, border: `1.5px solid ${C.gB}`, padding: 24 }}>
        <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginBottom: 8 }}>Definir nova senha</h1>
        {ok ? (
          <>
            <p style={{ fontSize: 14, color: C.g, marginBottom: 20 }}>Senha alterada com sucesso! Agora é só entrar com a nova senha.</p>
            <button onClick={onConcluido} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: font.d }}>Ir para o login</button>
          </>
        ) : (
          <>
            <p style={{ fontSize: 13, color: C.gL, marginBottom: 20 }}>Digite a sua nova senha abaixo.</p>
            {erro && <div style={{ background: C.corLt, color: C.cor, border: `1px solid ${C.cor}`, borderRadius: 10, padding: 12, marginBottom: 16, fontSize: 12, fontWeight: 600 }}>{erro}</div>}
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Nova senha (mín. 8)" style={{ width: "100%", padding: "12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", marginBottom: 12, fontFamily: font.b }} disabled={loading} />
            <input type="password" value={senha2} onChange={(e) => setSenha2(e.target.value)} placeholder="Repita a nova senha" style={{ width: "100%", padding: "12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", marginBottom: 20, fontFamily: font.b }} disabled={loading} onKeyPress={(e) => e.key === "Enter" && salvar()} />
            <button onClick={salvar} disabled={loading} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: font.d, opacity: loading ? 0.6 : 1 }}>{loading ? "Salvando..." : "Salvar nova senha"}</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("visitor");
  const [user, setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [screenData, setScreenData] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [recoveryMode, setRecoveryMode] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    // Ao voltar do Mercado Pago, a URL traz ?pagamento=sucesso|pendente|erro
    const params = new URLSearchParams(window.location.search);
    const pg = params.get("pagamento");
    if (pg) {
      setPaymentStatus(pg);
      // limpa a URL para não repetir a mensagem ao recarregar
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // Detecta o retorno do link de "recuperar senha" enviado por email
    if ((window.location.hash || "").includes("type=recovery")) {
      setRecoveryMode(true);
    }
    const sb = window.SupabaseAPI?.initSupabase?.();
    if (!sb) return;
    const { data: sub } = sb.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => { sub?.subscription?.unsubscribe?.(); };
  }, []);

  const nav = useCallback((s, data = null) => {
    setScreen(s);
    if (data) setScreenData(data);
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  const renderScreen = () => {
    if (mode === "login") {
      return <Login onLoginSuccess={(userData) => { setUser(userData); setMode("logged"); setScreen("home"); }} />;
    }

    if (mode === "register") {
      return <RegisterProfessional onBack={() => setMode("visitor")} onSuccess={(data) => { setUser(data); setMode("logged"); setScreen("home"); }} nav={nav} />;
    }

    if (mode === "visitor") {
      switch (screen) {
        case "home": return <VisitorHome nav={nav} onLogin={() => setMode("login")} onRegister={() => setMode("register")} />;
        case "search": return <VisitorSearch nav={nav} searchFilter={searchFilter} setSearchFilter={setSearchFilter} />;
        case "profile": return <VisitorProfile nav={nav} data={screenData} onNeedLogin={() => setMode("login")} />;
        default: return <VisitorHome nav={nav} onLogin={() => setMode("login")} onRegister={() => setMode("register")} />;
      }
    }

    if (mode === "logged") {
      switch (screen) {
        case "home": return <LoggedHome nav={nav} user={user} />;
        case "search": return <VisitorSearch nav={nav} searchFilter={searchFilter} setSearchFilter={setSearchFilter} />;
        case "profile": return <LoggedProfile nav={nav} data={screenData} user={user} />;
        case "chat": return <ChatScreen nav={nav} />;
        case "settings": return <Settings nav={nav} user={user} onLogout={() => { window.SupabaseAPI?.signOutUser?.(); setMode("visitor"); setUser(null); setScreen("home"); }} />;
        case "planos": return <PlanosScreen nav={nav} user={user} />;
        case "editar": return <EditProfile nav={nav} user={user} onUpdated={(u) => setUser((prev) => ({ ...prev, ...u }))} />;
        default: return <LoggedHome nav={nav} user={user} />;
      }
    }
  };

  const navItems = mode === "logged" 
    ? [
        { id: "home", icon: "🏠", label: "Início", onClick: () => { setScreen("home"); } },
        { id: "search", icon: "🔍", label: "Buscar", onClick: () => { setScreen("search"); } },
        { id: "chat", icon: "💬", label: "Chat", onClick: () => { setScreen("chat"); } },
        { id: "settings", icon: "👤", label: "Conta", onClick: () => { setScreen("settings"); } },
      ]
    : [
        { id: "home", icon: "🏠", label: "Início", onClick: () => { setScreen("home"); } },
        { id: "search", icon: "🔍", label: "Buscar", onClick: () => { setScreen("search"); } },
      ];

  if (recoveryMode) {
    return <NovaSenhaScreen onConcluido={() => { setRecoveryMode(false); window.history.replaceState({}, "", window.location.pathname); setMode("login"); }} />;
  }

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
        .navbar{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-top:1px solid ${C.gB};display:flex;max-width:480px;margin:0 auto;width:100%;z-index:100;}
        .nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px 0;background:none;border:none;cursor:pointer;font-family:${font.b};font-size:10px;font-weight:600;color:${C.gL};gap:4px;}
        .nav-tab.active{color:${C.pri};font-weight:700;}
      `}</style>
      <div className="app-shell">
        <div ref={scrollRef} className="app-scroll">
          {renderScreen()}
        </div>
        <div className="navbar">
          {navItems.map(item => (
            <button 
              key={item.id} 
              onClick={item.onClick} 
              className={`nav-tab ${screen === item.id ? "active" : ""}`}
            >
              <div>{item.icon}</div>
              <div>{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {paymentStatus && (
        <PaymentStatusOverlay status={paymentStatus} onClose={() => setPaymentStatus(null)} />
      )}
    </>
  );
}
