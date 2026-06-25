import { useState, useEffect, useRef, useCallback } from "react";
import RegisterProfessional from "./RegisterProfessional";
import Login from "./Login";
import { iniciarPagamento } from "./services/mercadopago-service";
import { PLANOS_PAGOS, formatarPrecoPlano } from "./config/plans.js";

// ══════════════════════════════════════════════════════════════
// SUPABASE INIT
// ══════════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://awkabegjsamyeqdwcngt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3a2FiZWdqc2FteWVxZHdjbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2MDAsImV4cCI6MjA5NzIyNjYwMH0.TKZjFZ6lmpDbOwD_wEdo5jJdqVWywLRoR3gkaSvtO7o';
const MEDIA_BUCKET = 'professional-media';

let supabase = null;

function initSupabase() {
  if (!supabase && window.supabase) {
    const { createClient } = window.supabase;
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      },
    });
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
    // Importante: não usamos .select() aqui.
    // O .select() força o Supabase a tentar LER a linha logo depois de INSERIR.
    // Em tabelas com RLS, isso pode causar erro mesmo quando o INSERT foi permitido.
    const { error } = await sb
      .from('subscriptions')
      .insert([subData]);

    if (error) {
      return { data: null, error };
    }

    // Como não buscamos a linha de volta, retornamos os próprios dados enviados.
    return { data: { ...subData, id: null }, error: null };
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

async function getAllProfessionals() {
  const sb = supabase || initSupabase();
  if (!sb) return { data: [], error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return { data: [], error };
    return { data: data || [], error: null };
  } catch (err) {
    return { data: [], error: err };
  }
}

async function updateProfile(id, fields) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };

  try {
    // A tabela professionals exige email NOT NULL.
    // Na tela de editar perfil, o app não envia email porque o usuário não edita esse campo.
    // Como usamos upsert, o Supabase pode tentar inserir a linha caso não encontre o perfil.
    // Por isso buscamos o email do usuário logado e garantimos que ele vá junto.
    const { data: authData } = await sb.auth.getUser();
    const authEmail = authData?.user?.email || null;

    const profileData = {
      id,
      ...fields,
      email: fields?.email || authEmail,
    };

    if (!profileData.email) {
      return {
        data: null,
        error: { message: 'Não foi possível identificar o email do usuário logado. Faça login novamente.' }
      };
    }

    const { error } = await sb
      .from('professionals')
      .upsert([profileData], { onConflict: 'id' });

    if (error) {
      return { data: null, error };
    }

    // Não usamos .select() aqui para evitar conflito com RLS de leitura.
    return { data: profileData, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}


function normalizeGalleryPhotos(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch (e) {
      return value.split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return [];
}

function getFileExtension(file) {
  const fromName = (file?.name || "").split(".").pop()?.toLowerCase();
  if (fromName && fromName.length <= 5) return fromName;
  const mime = file?.type || "";
  if (mime.includes("png")) return "png";
  if (mime.includes("webp")) return "webp";
  return "jpg";
}

async function uploadProfessionalMedia(userId, kind, file) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: { message: 'Supabase não carregou' } };
  if (!userId) return { data: null, error: { message: 'Usuário não identificado' } };
  if (!file) return { data: null, error: { message: 'Nenhum arquivo selecionado' } };
  if (!file.type?.startsWith('image/')) {
    return { data: null, error: { message: 'Envie apenas arquivos de imagem' } };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { data: null, error: { message: 'Imagem muito grande. Use até 5 MB.' } };
  }

  const ext = getFileExtension(file);
  const safeKind = String(kind || 'image').replace(/[^a-z0-9_-]/gi, '').toLowerCase();
  const path = `${userId}/${safeKind}-${Date.now()}.${ext}`;

  const { data, error } = await sb
    .storage
    .from(MEDIA_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) return { data: null, error };

  const { data: publicData } = sb.storage.from(MEDIA_BUCKET).getPublicUrl(data.path);
  return {
    data: {
      path: data.path,
      publicUrl: publicData?.publicUrl,
    },
    error: null,
  };
}

async function uploadProfilePhoto(userId, formDataOrFile) {
  const file = formDataOrFile instanceof FormData ? formDataOrFile.get("file") : formDataOrFile;
  const result = await uploadProfessionalMedia(userId, "profile", file);
  return { ...result, url: result?.data?.publicUrl || null };
}

async function uploadCoverPhoto(userId, formDataOrFile) {
  const file = formDataOrFile instanceof FormData ? formDataOrFile.get("file") : formDataOrFile;
  const result = await uploadProfessionalMedia(userId, "cover", file);
  return { ...result, url: result?.data?.publicUrl || null };
}

window.SupabaseAPI = {
  initSupabase, createUser, getUserByEmail, getAllProfessionals, createSubscription,
  signUpUser, signInUser, signOutUser, resetPassword, updatePassword, getProfileById, updateProfile, uploadProfessionalMedia, uploadProfilePhoto, uploadCoverPhoto,
  get client() { return supabase || initSupabase(); },
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
  { id:1, name:"Carlos Silva", role:"Eletricista", rating:4.9, reviews:127, city:"São Paulo", uf:"SP", price:"R$ 80", badge:"premium", av:"CS", on:true, attends_24h:true,
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

function parseCategories(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch (e) {}
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function initialsFromName(name) {
  const parts = String(name || "Profissional").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PR";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return `${parts[0][0] || ""}${parts[parts.length - 1][0] || ""}`.toUpperCase();
}

function normalizeProfessionalRecord(row) {
  const categories = parseCategories(row?.categories);
  const rawCity = String(row?.city || "").trim();
  const cityParts = rawCity.split(",").map((part) => part.trim()).filter(Boolean);
  const cityName = cityParts[0] || rawCity || "Cidade não informada";
  const uf = String(row?.uf || cityParts[1] || "").trim();
  const name = row?.name || "Profissional";
  const rating = Number(row?.rating || row?.average_rating || 0);
  const reviews = Number(row?.reviews || row?.review_count || 0);

  return {
    id: row?.id,
    name,
    role: categories[0] || row?.role || "Profissional",
    rating: Number.isFinite(rating) ? rating : 0,
    reviews: Number.isFinite(reviews) ? reviews : 0,
    city: cityName,
    uf,
    price: row?.price || row?.starting_price || "Consultar",
    badge: row?.badge || null,
    av: row?.avatar_initials || initialsFromName(name),
    avatar_url: row?.avatar_url || "",
    cover_url: row?.cover_url || row?.cover_photo_url || "",
    gallery_photos: normalizeGalleryPhotos(row?.gallery_photos || row?.photos),
    on: true,
    whatsapp: String(row?.whatsapp || "").replace(/\D/g, ""),
    categories,
    bio: row?.bio || "",
    attends_24h: row?.attends_24h === true,
    userReviews: [],
    _source: "database",
  };
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function parseMoneyValue(value) {
  const raw = String(value || "").replace(/[^\d,.-]/g, "").replace(",", ".");
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

function Avatar({ ini = "?", size = 40, badge = null, src = null }) {
  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F"];
  const safeIni = String(ini || "?").substring(0, 2).toUpperCase();
  const colorIndex = safeIni.charCodeAt(0) % colors.length;
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {src ? (
        <img
          src={src}
          alt="Foto do perfil"
          style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", display: "block", border: "2px solid #fff" }}
        />
      ) : (
        <div style={{ width: size, height: size, borderRadius: "50%", background: colors[colorIndex], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: size * 0.4, fontFamily: font.d }}>
          {safeIni}
        </div>
      )}
      {badge && <div style={{ position: "absolute", bottom: 0, right: 0, background: badge === "premium" ? C.acc : C.pri, borderRadius: "50%", width: size * 0.35, height: size * 0.35, fontSize: size * 0.2, display: "flex", alignItems: "center", justifyContent: "center" }}>⭐</div>}
    </div>
  );
}


function Badge24h({ small = false }) {
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: small ? "3px 7px" : "5px 9px",
      borderRadius: 999,
      background: C.accLt,
      color: "#9A6400",
      border: `1px solid ${C.acc}`,
      fontSize: small ? 10 : 12,
      fontWeight: 800,
      fontFamily: font.d,
      whiteSpace: "nowrap",
    }}>
      ⚡ 24h
    </span>
  );
}

function formatRatingValue(value) {
  const n = Number(value || 0);
  if (!Number.isFinite(n) || n <= 0) return "Novo";
  return n.toFixed(1).replace(".", ",");
}

function RatingBadge({ rating = 0, reviews = 0, compact = false }) {
  const hasReviews = Number(reviews || 0) > 0 && Number(rating || 0) > 0;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: hasReviews ? C.accLt : C.gBg, color: hasReviews ? "#9A6400" : C.g, border: `1px solid ${hasReviews ? C.acc : C.gB}`, borderRadius: 999, padding: compact ? "3px 7px" : "6px 10px", fontSize: compact ? 10 : 12, fontWeight: 800, fontFamily: font.d }}>
      <span>{hasReviews ? "⭐" : "☆"}</span>
      <span>{hasReviews ? `${formatRatingValue(rating)} (${reviews})` : "Novo sem avaliações"}</span>
    </div>
  );
}

function RatingSummary({ professional }) {
  const reviews = Number(professional?.reviews || 0);
  const rating = Number(professional?.rating || 0);
  const hasReviews = reviews > 0 && rating > 0;

  return (
    <div style={{ marginTop: 14, background: hasReviews ? C.accLt : C.gBg, border: `1.5px solid ${hasReviews ? C.acc : C.gB}`, borderRadius: 14, padding: 14, textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <div>
          <div style={{ fontFamily: font.d, fontSize: 15, fontWeight: 900, color: hasReviews ? "#9A6400" : C.dk }}>
            {hasReviews ? `⭐ Nota ${formatRatingValue(rating)} de 5` : "☆ Profissional novo"}
          </div>
          <div style={{ fontSize: 12, color: C.g, marginTop: 3 }}>
            {hasReviews ? `${reviews} avaliação${reviews !== 1 ? "ões" : ""} de clientes` : "Ainda não recebeu avaliações de clientes."}
          </div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, color: hasReviews ? C.acc : C.gL, fontFamily: font.d }}>
          {hasReviews ? formatRatingValue(rating) : "--"}
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.g, marginTop: 10, lineHeight: 1.45 }}>
        As avaliações ajudam o cliente a escolher com mais confiança e valorizam profissionais que atendem bem.
      </div>
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


function MarketplaceHome({ nav, mode, user, onLogin, onRegister, setSearchFilter }) {
  const [query, setQuery] = useState("");
  const [bannerIdx, setBannerIdx] = useState(0);

  const banners = [
    {
      title: "Encontre profissionais avaliados",
      sub: "Busque por serviço, cidade e veja a nota antes de chamar no WhatsApp.",
      cta: "Buscar agora",
      bg: `linear-gradient(135deg, ${C.pri}, ${C.priDk})`,
    },
    {
      title: "Profissional: apareça para clientes",
      sub: "Cadastre seu serviço e seja encontrado por pessoas da sua região.",
      cta: "Cadastrar grátis",
      bg: `linear-gradient(135deg, ${C.acc}, #D68910)`,
    },
  ];

  useEffect(() => {
    const t = setInterval(() => setBannerIdx((i) => (i + 1) % banners.length), 4500);
    return () => clearInterval(t);
  }, [banners.length]);

  const buscar = () => {
    setSearchFilter(query.trim());
    nav("search");
  };

  const buscarCategoria = (categoria) => {
    setSearchFilter(categoria);
    nav("search");
  };

  const atalhos = [
    { label: "Tudo", value: "" },
    { label: "Casa", value: "Diarista" },
    { label: "Obras", value: "Pedreiro" },
    { label: "Beleza", value: "Cabeleireiro" },
    { label: "Auto", value: "Mecânico" },
    { label: "Tecnologia", value: "Técnico TI" },
  ];

  return (
    <div className="screen-content" style={{ background: C.gBg }}>
      <div style={{ background: `linear-gradient(180deg, ${C.acc} 0%, ${C.acc} 72%, ${C.gBg} 72%)`, padding: "14px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "rgba(255,255,255,.92)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid rgba(255,255,255,.7)" }}>
            <img src="/logo-icon.svg" alt="TáNaMão Brasil" style={{ width: 30, height: 30, objectFit: "contain" }} />
          </div>
          <div style={{ flex: 1, background: "#fff", borderRadius: 999, padding: "11px 14px", boxShadow: "0 6px 18px rgba(17,24,39,.12)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🔎</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="Buscar profissional ou serviço"
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontFamily: font.b, fontSize: 14, color: C.dk }}
            />
          </div>
          <button onClick={mode === "logged" ? () => nav("settings") : onLogin} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", background: "rgba(255,255,255,.88)", fontSize: 18, cursor: "pointer", boxShadow: "0 6px 18px rgba(17,24,39,.10)" }}>
            {mode === "logged" ? "👤" : "🔐"}
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#3B2A00", fontWeight: 700, marginBottom: 12 }}>
          <span>📍</span>
          <span>Profissionais perto de você</span>
          <span style={{ fontWeight: 900 }}>›</span>
        </div>

        <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 12 }}>
          {atalhos.map((a, i) => (
            <button key={a.label} onClick={() => buscarCategoria(a.value)} style={{ background: "transparent", border: "none", borderBottom: i === 0 ? `3px solid ${C.dk}` : "3px solid transparent", padding: "0 0 7px", fontFamily: font.d, fontSize: 15, fontWeight: 800, color: C.dk, whiteSpace: "nowrap", cursor: "pointer" }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ borderRadius: 18, padding: 18, background: banners[bannerIdx].bg, color: "#fff", boxShadow: "0 10px 22px rgba(17,24,39,.14)", minHeight: 138, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -24, bottom: -28, fontSize: 92, opacity: .16 }}>🤝</div>
          <div style={{ position: "relative" }}>
            <div style={{ fontFamily: font.d, fontSize: 21, lineHeight: 1.05, fontWeight: 900, maxWidth: 280 }}>{banners[bannerIdx].title}</div>
            <div style={{ fontSize: 13, lineHeight: 1.35, marginTop: 8, color: "rgba(255,255,255,.9)", maxWidth: 310 }}>{banners[bannerIdx].sub}</div>
          </div>
          <button onClick={bannerIdx === 0 ? buscar : onRegister} style={{ alignSelf: "flex-start", marginTop: 14, border: "none", borderRadius: 999, padding: "8px 13px", background: "#fff", color: bannerIdx === 0 ? C.pri : "#9A6400", fontFamily: font.d, fontSize: 12, fontWeight: 900, cursor: "pointer" }}>
            {banners[bannerIdx].cta}
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 10 }}>
          {banners.map((_, i) => <div key={i} onClick={() => setBannerIdx(i)} style={{ width: i === bannerIdx ? 22 : 7, height: 7, borderRadius: 999, background: i === bannerIdx ? C.pri : C.gB, cursor: "pointer", transition: "all .2s" }} />)}
        </div>
      </div>

      <div style={{ padding: "0 16px 14px" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: `1px solid ${C.gB}`, padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ fontFamily: font.d, fontSize: 14, fontWeight: 900, color: C.dk }}>Avaliações ajudam na escolha</div>
            <div style={{ fontSize: 12, color: C.g, marginTop: 2 }}>Veja nota e comentários antes de chamar.</div>
          </div>
          <div style={{ background: C.accLt, color: "#9A6400", border: `1px solid ${C.acc}`, borderRadius: 999, padding: "7px 10px", fontFamily: font.d, fontWeight: 900, fontSize: 12, whiteSpace: "nowrap" }}>⭐ Nota</div>
        </div>
      </div>

      <div style={{ padding: "0 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: font.d, fontSize: 18, fontWeight: 900, color: C.dk }}>Categorias</div>
        <button onClick={() => nav("categories")} style={{ border: "none", background: "transparent", color: C.pri, fontFamily: font.d, fontSize: 12, fontWeight: 900, cursor: "pointer" }}>Ver todas</button>
      </div>
      <div style={{ display: "flex", gap: 10, padding: "0 16px 16px", overflowX: "auto" }}>
        {CATEGORIES.slice(0, 8).map((c) => (
          <button key={c.name} onClick={() => buscarCategoria(c.name)} style={{ minWidth: 82, background: "#fff", borderRadius: 16, border: `1.5px solid ${C.gB}`, padding: "12px 8px", textAlign: "center", cursor: "pointer", flexShrink: 0 }}>
            <div style={{ fontSize: 28, marginBottom: 5 }}>{c.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.dk, lineHeight: 1.15 }}>{c.name}</div>
          </button>
        ))}
      </div>

      <div style={{ padding: "0 16px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontFamily: font.d, fontSize: 18, fontWeight: 900, color: C.dk }}>Profissionais em destaque</div>
        <button onClick={() => nav("search")} style={{ border: "none", background: "transparent", color: C.pri, fontFamily: font.d, fontSize: 12, fontWeight: 900, cursor: "pointer" }}>Buscar</button>
      </div>
      <div style={{ padding: "0 16px 110px", display: "flex", flexDirection: "column", gap: 10 }}>
        <ProfessionalsPreview nav={nav} />
        <div style={{ background: C.priLt, border: `1px solid ${C.pri}`, borderRadius: 14, padding: 14, textAlign: "center" }}>
          <div style={{ fontFamily: font.d, fontSize: 15, fontWeight: 900, color: C.pri }}>Você é profissional?</div>
          <div style={{ fontSize: 12, color: C.dk, marginTop: 4, marginBottom: 10 }}>Cadastre seu serviço e apareça para clientes da sua região.</div>
          <button onClick={mode === "logged" ? () => nav("settings") : onRegister} style={{ border: "none", borderRadius: 999, padding: "10px 14px", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", fontFamily: font.d, fontWeight: 900, cursor: "pointer" }}>
            {mode === "logged" ? "Ver meu perfil" : "Cadastrar grátis"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CategoriesScreen({ nav, setSearchFilter }) {
  const escolher = (categoria) => {
    setSearchFilter(categoria);
    nav("search");
  };

  return (
    <div className="screen-content" style={{ background: C.gBg, paddingBottom: 110 }}>
      <TopBar title="Categorias" onBack={() => nav("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: C.priLt, border: `1px solid ${C.pri}`, borderRadius: 14, padding: 14, marginBottom: 14 }}>
          <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 900, color: C.pri }}>Escolha o tipo de serviço</div>
          <div style={{ fontSize: 12, color: C.dk, marginTop: 4 }}>Ao tocar em uma categoria, o app já abre a busca filtrada.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {CATEGORIES.map((c) => (
            <button key={c.name} onClick={() => escolher(c.name)} style={{ background: "#fff", border: `1.5px solid ${C.gB}`, borderRadius: 16, padding: "14px 8px", minHeight: 92, cursor: "pointer" }}>
              <div style={{ fontSize: 30, marginBottom: 7 }}>{c.icon}</div>
              <div style={{ fontFamily: font.d, fontSize: 12, fontWeight: 900, color: C.dk, lineHeight: 1.15 }}>{c.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function FavoritesScreen({ nav, mode, onLogin }) {
  return (
    <div className="screen-content" style={{ background: C.gBg, paddingBottom: 110 }}>
      <TopBar title="Favoritos" onBack={() => nav("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: "#fff", border: `1.5px solid ${C.gB}`, borderRadius: 16, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>💛</div>
          <div style={{ fontFamily: font.d, fontSize: 18, fontWeight: 900, color: C.dk, marginBottom: 8 }}>Favoritos e já contratados</div>
          <div style={{ fontSize: 13, color: C.g, lineHeight: 1.45, marginBottom: 14 }}>
            Aqui vamos guardar os profissionais que o cliente favoritar ou já chamou pelo WhatsApp. Isso ajuda o cliente a contratar de novo e fortalece a confiança no app.
          </div>
          {mode !== "logged" ? (
            <button onClick={onLogin} style={{ border: "none", borderRadius: 999, padding: "11px 16px", background: C.pri, color: "#fff", fontFamily: font.d, fontWeight: 900, cursor: "pointer" }}>Entrar para salvar favoritos</button>
          ) : (
            <button onClick={() => nav("search")} style={{ border: "none", borderRadius: 999, padding: "11px 16px", background: C.pri, color: "#fff", fontFamily: font.d, fontWeight: 900, cursor: "pointer" }}>Buscar profissionais</button>
          )}
        </div>
      </div>
    </div>
  );
}

function LoginNeededScreen({ nav, title, message, onLogin }) {
  return (
    <div className="screen-content" style={{ background: C.gBg, paddingBottom: 110 }}>
      <TopBar title={title} onBack={() => nav("home")} />
      <div style={{ padding: 16 }}>
        <div style={{ background: "#fff", border: `1.5px solid ${C.gB}`, borderRadius: 16, padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>🔐</div>
          <div style={{ fontFamily: font.d, fontSize: 18, fontWeight: 900, color: C.dk, marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 13, color: C.g, lineHeight: 1.45, marginBottom: 14 }}>{message}</div>
          <button onClick={onLogin} style={{ border: "none", borderRadius: 999, padding: "11px 16px", background: C.pri, color: "#fff", fontFamily: font.d, fontWeight: 900, cursor: "pointer" }}>Entrar ou cadastrar</button>
        </div>
      </div>
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
        <ProfessionalsPreview nav={nav} />
      </div>
    </div>
  );
}


function ProfessionalsPreview({ nav }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error } = await window.SupabaseAPI.getAllProfessionals();
        if (!active) return;
        if (error) {
          console.error("Erro ao carregar prévia de profissionais:", error);
          setItems([]);
          return;
        }
        setItems((data || []).map(normalizeProfessionalRecord));
      } catch (err) {
        if (active) {
          console.error("Erro ao carregar prévia de profissionais:", err);
          setItems([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => { active = false; };
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", padding: "18px 8px", color: C.gL, fontSize: 13 }}>Carregando profissionais...</div>;
  }

  const preview = items.length > 0 ? items.slice(0, 3) : PROS.slice(0, 3);

  return (
    <>
      {preview.map((p) => (
        <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
          <Avatar ini={p.av} size={48} badge={p.badge} src={p.avatar_url} />
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: C.dk, fontSize: 14 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.g }}>{p.role}{p.city ? ` • ${p.city}${p.uf ? `, ${p.uf}` : ""}` : ""}</div>
            {p.attends_24h && <div style={{ marginTop: 4 }}><Badge24h small /></div>}
            <div style={{ marginTop: 5 }}><RatingBadge rating={p.rating} reviews={p.reviews} compact /></div>
          </div>
          <div style={{ color: C.pri, fontWeight: 700, fontSize: 13 }}>{p.price}</div>
        </div>
      ))}
    </>
  );
}

function VisitorSearch({ nav, searchFilter, setSearchFilter }) {
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [professionalsFromDb, setProfessionalsFromDb] = useState([]);
  const [loadingProfessionals, setLoadingProfessionals] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProfessionals = async () => {
      setLoadingProfessionals(true);
      setLoadError("");

      try {
        const { data, error } = await window.SupabaseAPI.getAllProfessionals();
        if (!active) return;

        if (error) {
          console.error("Erro ao carregar profissionais:", error);
          setLoadError(error?.message || "Não foi possível carregar profissionais do banco.");
          setProfessionalsFromDb([]);
          return;
        }

        setProfessionalsFromDb((data || []).map(normalizeProfessionalRecord));
      } catch (err) {
        if (!active) return;
        console.error("Erro ao carregar profissionais:", err);
        setLoadError(err?.message || "Não foi possível carregar profissionais do banco.");
        setProfessionalsFromDb([]);
      } finally {
        if (active) setLoadingProfessionals(false);
      }
    };

    loadProfessionals();
    return () => { active = false; };
  }, []);

  // Quando o banco já tem profissionais cadastrados, usamos o banco.
  // Os profissionais fixos ficam só como fallback para ambiente de teste sem dados.
  const baseProfessionals = professionalsFromDb.length > 0 ? professionalsFromDb : PROS;

  const filtered = baseProfessionals.filter(p => {
    const searchable = normalizeText(`${p.name} ${p.role} ${p.bio || ""} ${(p.categories || []).join(" ")}`);
    const citySearchable = normalizeText(`${p.city || ""} ${p.uf || ""}`);
    const categorySearchable = (p.categories || []).map(normalizeText);

    const matchSearch = !searchFilter || searchable.includes(normalizeText(searchFilter));
    const matchCat = !filterCategory || categorySearchable.includes(normalizeText(filterCategory)) || normalizeText(p.role).includes(normalizeText(filterCategory));
    const matchCity = !filterCity || citySearchable.includes(normalizeText(filterCity));

    return matchSearch && matchCat && matchCity;
  }).sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "reviews") return (b.reviews || 0) - (a.reviews || 0);
    if (sortBy === "price") return parseMoneyValue(a.price) - parseMoneyValue(b.price);
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

        {loadingProfessionals && <div style={{ fontSize: 11, color: C.gL }}>Carregando profissionais...</div>}
        {!loadingProfessionals && loadError && <div style={{ fontSize: 11, color: C.cor }}>{loadError}</div>}
        {!loadingProfessionals && !loadError && filtered.length > 0 && <div style={{ fontSize: 11, color: C.gL }}>Encontrados: {filtered.length}</div>}
      </div>

      <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {loadingProfessionals ? (
          <div style={{ textAlign: "center", padding: "40px 16px", color: C.gL }}>
            Carregando profissionais...
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((p) => (
            <div key={p.id} onClick={() => nav("profile", p)} style={{ background: "#fff", borderRadius: 14, padding: 14, border: `1.5px solid ${C.gB}`, cursor: "pointer", display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar ini={p.av} size={48} badge={p.badge} src={p.avatar_url} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: C.dk, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: C.g }}>{p.role}</div>
                {p.attends_24h && <div style={{ marginTop: 4 }}><Badge24h small /></div>}
                <div style={{ fontSize: 11, color: C.gL, marginTop: 2 }}>📍 {p.city}{p.uf ? `, ${p.uf}` : ""}</div>
                <div style={{ marginTop: 5 }}><RatingBadge rating={p.rating} reviews={p.reviews} compact /></div>
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
        <Avatar ini={p.av} size={64} badge={p.badge} src={p.avatar_url} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        {p.attends_24h && <div style={{ marginTop: 8 }}><Badge24h /></div>}
        <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>📍 {p.city}{p.uf ? `, ${p.uf}` : ""}</div>
        <RatingSummary professional={p} />
        {p.bio && <div style={{ marginTop: 14, padding: 12, background: C.gBg, borderRadius: 12, fontSize: 13, color: C.dk, textAlign: "left", lineHeight: 1.5 }}>{p.bio}</div>}

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
          {(!p.userReviews || p.userReviews.length === 0) && (
            <div style={{ background: C.gBg, borderRadius: 10, padding: 12, fontSize: 12, color: C.g, textAlign: "center" }}>
              Ainda não há comentários escritos. As próximas avaliações aparecerão aqui.
            </div>
          )}
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
        <ProfessionalsPreview nav={nav} />
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
        <Avatar ini={p.av} size={64} badge={p.badge} src={p.avatar_url} />
        <h2 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk, marginTop: 12 }}>{p.name}</h2>
        <div style={{ fontSize: 13, color: C.g, marginTop: 3 }}>{p.role}</div>
        {p.attends_24h && <div style={{ marginTop: 8 }}><Badge24h /></div>}
        <RatingSummary professional={p} />

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
          {(!p.userReviews || p.userReviews.length === 0) && (
            <div style={{ background: C.gBg, borderRadius: 10, padding: 12, fontSize: 12, color: C.g, textAlign: "center" }}>
              Ainda não há comentários escritos. As próximas avaliações aparecerão aqui.
            </div>
          )}
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
          <div style={{ fontSize: 13, color: C.dk, marginBottom: 8 }}>Email: {user?.email}</div>
          {user?.attends_24h && <div style={{ marginBottom: 12 }}><Badge24h small /></div>}
          <button onClick={() => nav("editar")} style={{ width: "100%", padding: "8px", background: C.gBg, color: C.dk, border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.b }}>Editar perfil, fotos e mídia</button>
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
    } catch (e) {
      console.error("Erro ao iniciar pagamento:", e);
      setErro(e?.message || "Não foi possível iniciar o pagamento. Tente novamente em instantes.");
      setLoading(null);
    }
  };

  return (
    <div className="screen-content" style={{ paddingBottom: 36 }}>
      <TopBar title="Planos" onBack={() => nav("settings")} />
      <div style={{ padding: "16px" }}>
        <div style={{ background: C.priLt, border: `1.5px solid ${C.pri}`, borderRadius: 14, padding: 14, marginBottom: 16 }}>
          <div style={{ fontFamily: font.d, fontSize: 17, fontWeight: 900, color: C.pri, marginBottom: 4 }}>Planos para profissionais</div>
          <p style={{ fontSize: 12, color: C.dk, lineHeight: 1.45 }}>
            O cadastro continua grátis. Os planos pagos servem para dar mais visibilidade ao seu perfil. A nota e as avaliações continuam vindo dos clientes, porque confiança precisa ser real.
          </p>
        </div>

        {erro && (
          <div style={{ background: C.corLt, color: C.cor, padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 600, marginBottom: 14, textAlign: "center" }}>
            {erro}
          </div>
        )}

        {PLANOS_PAGOS.map((p) => (
          <div key={p.id} style={{ position: "relative", background: p.destaque ? C.priLt : "#fff", border: `2px solid ${p.destaque ? C.pri : C.gB}`, borderRadius: 14, padding: 18, marginBottom: 14 }}>
            {p.destaque && (
              <div style={{ position: "absolute", top: -11, right: 14, background: C.pri, color: "#fff", borderRadius: 999, padding: "4px 10px", fontSize: 10, fontWeight: 900, fontFamily: font.d }}>MAIOR VISIBILIDADE</div>
            )}
            {p.recomendado && (
              <div style={{ position: "absolute", top: -11, right: 14, background: C.acc, color: "#fff", borderRadius: 999, padding: "4px 10px", fontSize: 10, fontWeight: 900, fontFamily: font.d }}>RECOMENDADO</div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
              <div>
                <div style={{ fontFamily: font.d, fontSize: 18, fontWeight: 900, color: C.dk }}>{p.nome}</div>
                <div style={{ fontSize: 12, color: C.g, marginTop: 3 }}>{p.descricao}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: C.pri, fontFamily: font.d }}>{formatarPrecoPlano(p.preco)}</span>
                <span style={{ fontSize: 12, color: C.gL }}>{p.periodo}</span>
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "14px 0" }}>
              {p.feats.map((f, i) => (
                <li key={i} style={{ fontSize: 13, color: C.dk, padding: "5px 0" }}>✓ {f}</li>
              ))}
            </ul>
            <button onClick={() => assinar(p.id)} disabled={loading === p.id} style={{ width: "100%", padding: "13px", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: loading === p.id ? "wait" : "pointer", fontFamily: font.d, opacity: loading === p.id ? 0.7 : 1 }}>
              {loading === p.id ? "Abrindo pagamento..." : p.cta}
            </button>
          </div>
        ))}

        <p style={{ fontSize: 11, color: C.gL, textAlign: "center", marginTop: 8, lineHeight: 1.4 }}>
          Pagamento processado com segurança pelo Mercado Pago. Nunca envie token privado do Mercado Pago no app.
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
  const [uploading, setUploading] = useState("");
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState(false);
  const [f, setF] = useState({
    name: "",
    whatsapp: "",
    city: "",
    bio: "",
    avatar_url: "",
    cover_url: "",
    gallery_photos: [],
    attends_24h: false,
  });

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
            avatar_url: data.avatar_url || "",
            cover_url: data.cover_url || "",
            gallery_photos: normalizeGalleryPhotos(data.gallery_photos || data.photos),
            attends_24h: data.attends_24h === true,
          });
        }
      } catch (e) {}
      if (ativo) setCarregando(false);
    })();
    return () => { ativo = false; };
  }, [user?.id]);

  const handleUpload = async (kind, file) => {
    setErro("");
    setOk(false);
    if (!file) return;
    setUploading(kind);
    try {
      const { data, error } = await window.SupabaseAPI.uploadProfessionalMedia(user.id, kind, file);
      if (error) throw error;
      if (kind === "avatar") {
        setF((prev) => ({ ...prev, avatar_url: data.publicUrl }));
      } else if (kind === "cover") {
        setF((prev) => ({ ...prev, cover_url: data.publicUrl }));
      }
    } catch (e) {
      setErro(e?.message || "Não foi possível enviar a imagem. Confira o bucket professional-media no Supabase.");
    } finally {
      setUploading("");
    }
  };

  const handleGalleryUpload = async (files) => {
    const selected = Array.from(files || []);
    if (selected.length === 0) return;
    setErro("");
    setOk(false);

    const freeSlots = Math.max(0, 10 - f.gallery_photos.length);
    if (freeSlots === 0) {
      setErro("Você já adicionou 10 fotos. Remova alguma para enviar outra.");
      return;
    }

    setUploading("gallery");
    try {
      const uploadedUrls = [];
      for (const file of selected.slice(0, freeSlots)) {
        const { data, error } = await window.SupabaseAPI.uploadProfessionalMedia(user.id, "gallery", file);
        if (error) throw error;
        if (data?.publicUrl) uploadedUrls.push(data.publicUrl);
      }
      setF((prev) => ({ ...prev, gallery_photos: [...prev.gallery_photos, ...uploadedUrls] }));
    } catch (e) {
      setErro(e?.message || "Não foi possível enviar as fotos. Confira o bucket professional-media no Supabase.");
    } finally {
      setUploading("");
    }
  };

  const removeGalleryPhoto = (index) => {
    setF((prev) => ({
      ...prev,
      gallery_photos: prev.gallery_photos.filter((_, i) => i !== index),
    }));
  };

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
        avatar_url: f.avatar_url || null,
        cover_url: f.cover_url || null,
        gallery_photos: f.gallery_photos || [],
        attends_24h: f.attends_24h === true,
      };
      const { error } = await window.SupabaseAPI.updateProfile(user.id, fields);
      if (error) throw error;
      setOk(true);
      if (onUpdated) onUpdated({
        name: fields.name,
        avatar_initials: fields.avatar_initials,
        avatar_url: fields.avatar_url,
        cover_url: fields.cover_url,
        attends_24h: fields.attends_24h,
      });
    } catch (e) {
      setErro(e?.message || "Não foi possível salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  const inputStyle = { width: "100%", padding: "12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", fontFamily: font.b, marginBottom: 14 };
  const labelStyle = { display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 };
  const fileInputStyle = { width: "100%", padding: "10px", border: `2px dashed ${C.gB}`, borderRadius: 10, fontSize: 12, fontFamily: font.b, marginBottom: 12, background: C.gBg };
  const sectionStyle = { background: "#fff", border: `1.5px solid ${C.gB}`, borderRadius: 14, padding: 14, marginBottom: 14 };

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

            <div style={sectionStyle}>
              <div
                style={{
                  height: 128,
                  borderRadius: 14,
                  background: f.cover_url ? `url(${f.cover_url}) center/cover` : `linear-gradient(135deg, ${C.pri}, ${C.acc})`,
                  position: "relative",
                  marginBottom: 44,
                  overflow: "visible",
                }}
              >
                <div style={{ position: "absolute", left: 16, bottom: -34 }}>
                  <Avatar ini={f.name || user?.name || "?"} size={78} src={f.avatar_url} />
                </div>
              </div>
              <div style={{ fontFamily: font.d, fontWeight: 800, fontSize: 16, color: C.dk, marginBottom: 4 }}>Fotos do perfil</div>
              <div style={{ fontSize: 12, color: C.gL, marginBottom: 12 }}>Adicione a foto principal e a imagem de fundo do seu perfil.</div>

              <label style={labelStyle}>Foto de perfil</label>
              <input type="file" accept="image/*" style={fileInputStyle} disabled={salvando || !!uploading} onChange={(e) => handleUpload("avatar", e.target.files?.[0])} />

              <label style={labelStyle}>Imagem de fundo</label>
              <input type="file" accept="image/*" style={fileInputStyle} disabled={salvando || !!uploading} onChange={(e) => handleUpload("cover", e.target.files?.[0])} />

              {uploading && <div style={{ fontSize: 12, color: C.pri, fontWeight: 700 }}>Enviando imagem...</div>}
            </div>

            <div style={sectionStyle}>
              <div style={{ fontFamily: font.d, fontWeight: 800, fontSize: 16, color: C.dk, marginBottom: 4 }}>Galeria de fotos</div>
              <div style={{ fontSize: 12, color: C.gL, marginBottom: 12 }}>Adicione fotos dos seus serviços. Limite visual desta tela: 10 fotos.</div>

              <input type="file" accept="image/*" multiple style={fileInputStyle} disabled={salvando || !!uploading} onChange={(e) => handleGalleryUpload(e.target.files)} />

              {f.gallery_photos.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {f.gallery_photos.map((url, i) => (
                    <div key={`${url}-${i}`} style={{ position: "relative", borderRadius: 10, overflow: "hidden", background: C.gBg, height: 86 }}>
                      <img src={url} alt={`Foto ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                      <button type="button" onClick={() => removeGalleryPhoto(i)} disabled={salvando} style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: "50%", border: "none", background: "rgba(0,0,0,.65)", color: "#fff", cursor: "pointer", fontWeight: 800 }}>×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: C.gBg, borderRadius: 10, padding: 14, textAlign: "center", color: C.gL, fontSize: 12 }}>Nenhuma foto adicionada ainda.</div>
              )}
            </div>

            <div style={sectionStyle}>
              <div style={{ fontFamily: font.d, fontWeight: 800, fontSize: 16, color: C.dk, marginBottom: 4 }}>Atendimento</div>
              <div style={{ fontSize: 12, color: C.gL, marginBottom: 12 }}>Marque esta opção se você atende chamados a qualquer horário.</div>
              <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: 12, border: `1.5px solid ${f.attends_24h ? C.acc : C.gB}`, borderRadius: 12, background: f.attends_24h ? C.accLt : C.gBg, cursor: salvando ? "wait" : "pointer" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 14, color: C.dk }}>Atendo 24 horas</div>
                  <div style={{ fontSize: 12, color: C.g, marginTop: 2 }}>Mostra o selo <strong>⚡ 24h</strong> no perfil.</div>
                </div>
                <input type="checkbox" checked={f.attends_24h} onChange={(e) => setF({ ...f, attends_24h: e.target.checked })} disabled={salvando} style={{ width: 22, height: 22, accentColor: C.acc }} />
              </label>
              {f.attends_24h && <div style={{ marginTop: 10 }}><Badge24h /></div>}
            </div>

            <div style={sectionStyle}>
              <label style={labelStyle}>Nome</label>
              <input style={inputStyle} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} disabled={salvando} />

              <label style={labelStyle}>WhatsApp</label>
              <input style={inputStyle} value={f.whatsapp} onChange={(e) => setF({ ...f, whatsapp: e.target.value })} placeholder="Ex: 5511999998888" disabled={salvando} />

              <label style={labelStyle}>Cidade</label>
              <input style={inputStyle} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} disabled={salvando} />

              <label style={labelStyle}>Bio</label>
              <textarea style={{ ...inputStyle, resize: "vertical" }} rows="4" value={f.bio} onChange={(e) => setF({ ...f, bio: e.target.value })} disabled={salvando} />
            </div>

            <button onClick={salvar} disabled={salvando || !!uploading} style={{ width: "100%", padding: 14, background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: salvando || uploading ? "wait" : "pointer", fontFamily: font.d, opacity: salvando || uploading ? 0.6 : 1, marginTop: 4 }}>
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
  const [authChecking, setAuthChecking] = useState(true);
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
    let mounted = true;
    let authSubscription = null;

    const buildLoggedUser = async (authUser) => {
      if (!authUser) return;

      const { data: professional } = await window.SupabaseAPI.getProfileById(authUser.id);
      if (!mounted) return;

      const displayName = professional?.name || authUser.user_metadata?.name || authUser.email || "Profissional";

      setUser({
        ...(professional || {}),
        id: authUser.id,
        name: displayName,
        email: professional?.email || authUser.email,
        avatar_initials: professional?.avatar_initials || displayName.substring(0, 2).toUpperCase(),
      });
      setMode("logged");
      setScreen((current) => current || "home");
    };

    const startAuth = async () => {
      // Detecta o retorno do link de "recuperar senha" enviado por email
      if ((window.location.hash || "").includes("type=recovery")) {
        setRecoveryMode(true);
      }

      const sb = window.SupabaseAPI?.initSupabase?.();
      if (!sb) {
        if (mounted) setAuthChecking(false);
        return;
      }

      try {
        // Mantém o profissional logado mesmo após atualizar a página.
        // O Supabase salva a sessão no localStorage e aqui nós a restauramos no React.
        const { data: sessionData } = await sb.auth.getSession();
        if (sessionData?.session?.user) {
          await buildLoggedUser(sessionData.session.user);
        }

        const { data: sub } = sb.auth.onAuthStateChange(async (event, session) => {
          if (event === "PASSWORD_RECOVERY") {
            setRecoveryMode(true);
            return;
          }

          if (session?.user && ["SIGNED_IN", "TOKEN_REFRESHED", "INITIAL_SESSION"].includes(event)) {
            await buildLoggedUser(session.user);
            return;
          }

          if (event === "SIGNED_OUT") {
            setUser(null);
            setMode("visitor");
            setScreen("home");
          }
        });

        authSubscription = sub?.subscription;
      } catch (err) {
        console.error("Erro ao restaurar sessão:", err);
      } finally {
        if (mounted) setAuthChecking(false);
      }
    };

    startAuth();

    return () => {
      mounted = false;
      authSubscription?.unsubscribe?.();
    };
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
        case "home": return <MarketplaceHome nav={nav} mode={mode} user={user} onLogin={() => setMode("login")} onRegister={() => setMode("register")} setSearchFilter={setSearchFilter} />;
        case "search": return <VisitorSearch nav={nav} searchFilter={searchFilter} setSearchFilter={setSearchFilter} />;
        case "categories": return <CategoriesScreen nav={nav} setSearchFilter={setSearchFilter} />;
        case "favorites": return <FavoritesScreen nav={nav} mode={mode} onLogin={() => setMode("login")} />;
        case "chat": return <LoginNeededScreen nav={nav} title="Chat" message="Entre para acompanhar conversas e contatos da plataforma." onLogin={() => setMode("login")} />;
        case "profile": return <VisitorProfile nav={nav} data={screenData} onNeedLogin={() => setMode("login")} />;
        default: return <MarketplaceHome nav={nav} mode={mode} user={user} onLogin={() => setMode("login")} onRegister={() => setMode("register")} setSearchFilter={setSearchFilter} />;
      }
    }

    if (mode === "logged") {
      switch (screen) {
        case "home": return <MarketplaceHome nav={nav} mode={mode} user={user} onLogin={() => setMode("login")} onRegister={() => setMode("register")} setSearchFilter={setSearchFilter} />;
        case "search": return <VisitorSearch nav={nav} searchFilter={searchFilter} setSearchFilter={setSearchFilter} />;
        case "categories": return <CategoriesScreen nav={nav} setSearchFilter={setSearchFilter} />;
        case "favorites": return <FavoritesScreen nav={nav} mode={mode} onLogin={() => setMode("login")} />;
        case "profile": return <LoggedProfile nav={nav} data={screenData} user={user} />;
        case "chat": return <ChatScreen nav={nav} />;
        case "settings": return <Settings nav={nav} user={user} onLogout={() => { window.SupabaseAPI?.signOutUser?.(); setMode("visitor"); setUser(null); setScreen("home"); }} />;
        case "planos": return <PlanosScreen nav={nav} user={user} />;
        case "editar": return <EditProfile nav={nav} user={user} onUpdated={(u) => setUser((prev) => ({ ...prev, ...u }))} />;
        default: return <MarketplaceHome nav={nav} mode={mode} user={user} onLogin={() => setMode("login")} onRegister={() => setMode("register")} setSearchFilter={setSearchFilter} />;
      }
    }
  };

  const navItems = mode === "logged" 
    ? [
        { id: "home", icon: "🏠", label: "Home", onClick: () => { setScreen("home"); } },
        { id: "categories", icon: "▦", label: "Categorias", onClick: () => { setScreen("categories"); } },
        { id: "favorites", icon: "💛", label: "Favoritos", onClick: () => { setScreen("favorites"); } },
        { id: "chat", icon: "💬", label: "Chat", onClick: () => { setScreen("chat"); } },
        { id: "settings", icon: "👤", label: "Perfil", onClick: () => { setScreen("settings"); } },
      ]
    : [
        { id: "home", icon: "🏠", label: "Home", onClick: () => { setScreen("home"); } },
        { id: "categories", icon: "▦", label: "Categorias", onClick: () => { setScreen("categories"); } },
        { id: "favorites", icon: "💛", label: "Favoritos", onClick: () => { setScreen("favorites"); } },
        { id: "chat", icon: "💬", label: "Chat", onClick: () => { setScreen("chat"); } },
        { id: "settings", icon: "👤", label: "Perfil", onClick: () => { setMode("login"); } },
      ];

  if (recoveryMode) {
    return <NovaSenhaScreen onConcluido={() => { setRecoveryMode(false); window.history.replaceState({}, "", window.location.pathname); setMode("login"); }} />;
  }

  if (authChecking) {
    return (
      <div style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.w, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: font.d, color: C.pri, fontWeight: 800 }}>
        Carregando...
      </div>
    );
  }

  // Em telas de decisão importante, como planos e edição de perfil,
  // escondemos o menu inferior. Isso evita que ele cubra botões e deixa
  // o usuário focado na ação principal da tela.
  const mostrarRodape = !["planos", "editar"].includes(screen);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{width:0;height:0;}
        body{font-family:'DM Sans',sans-serif;background:#000;}
        .app-shell{max-width:480px;margin:0 auto;height:100vh;height:100dvh;background:${C.w};position:relative;overflow:hidden;box-shadow:0 0 80px rgba(0,0,0,.12);}
        .app-scroll{height:100%;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;}
        .screen-content{padding-bottom:calc(96px + env(safe-area-inset-bottom));min-height:100%;}
        .navbar{position:fixed;bottom:0;left:0;right:0;background:rgba(255,255,255,.95);backdrop-filter:blur(16px);border-top:1px solid ${C.gB};display:flex;max-width:480px;margin:0 auto;width:100%;z-index:100;}
        .nav-tab{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:10px 0 calc(10px + env(safe-area-inset-bottom));background:none;border:none;cursor:pointer;font-family:${font.b};font-size:10px;font-weight:700;color:${C.gL};gap:4px;min-width:0;}
        .nav-tab>div:first-child{font-size:18px;line-height:1;}
        .nav-tab>div:last-child{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:76px;}
        .nav-tab.active{color:${C.pri};font-weight:900;}
      `}</style>
      <div className="app-shell">
        <div ref={scrollRef} className="app-scroll">
          {renderScreen()}
        </div>
        {mostrarRodape && (
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
        )}
      </div>

      {paymentStatus && (
        <PaymentStatusOverlay status={paymentStatus} onClose={() => setPaymentStatus(null)} />
      )}
    </>
  );
}
