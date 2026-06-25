import { useState, useRef } from "react";
import CIDADES_BRASIL from "./CIDADES_SP.js";
import { PLANOS_CADASTRO, formatarPrecoPlano, getPlanoById } from "./config/plans.js";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

const CATS_DEFAULT = ["Eletricista", "Encanador", "Pintor", "Pedreiro", "Cabeleireiro", "Técnico TI", "Mecânico", "Fotógrafo", "Diarista", "Enfermeiro", "Arquiteto", "Chef"];

const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const PLANS = PLANOS_CADASTRO;

function trackEvent(e, d) { try { if (window.fbq) window.fbq("track", e, d); } catch (x) {} }

function getTrialDates() {
  const today = new Date();
  const endDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
  return { trial_start_date: today.toISOString(), trial_end_date: endDate.toISOString(), trial_active: true };
}

export default function RegisterProfessional({ onBack, onSuccess, nav }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("gratis");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const [f, setF] = useState({ 
    name: "", email: "", pass: "", pass2: "", wa: "", city: "", uf: "", cats: [], novaCat: "", bio: "",
    coverPhoto: null,
    profilePhoto: null,
    coverPhotoPreview: null,
    profilePhotoPreview: null,
  });

  // Autocomplete de cidades (lista local)
  const [citySearch, setCitySearch] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  
  const filteredCities = f.uf && citySearch.trim() 
    ? CIDADES_BRASIL.filter(c =>
        c.uf === f.uf && c.nome.toLowerCase().includes(citySearch.toLowerCase())
      ).slice(0, 15)
    : [];

  const handlePhotoUpload = (type, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      if (type === "cover") {
        setF({...f, coverPhoto: file, coverPhotoPreview: e.target.result});
      } else if (type === "profile") {
        setF({...f, profilePhoto: file, profilePhotoPreview: e.target.result});
      }
    };
    reader.readAsDataURL(file);
  };

  const v = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Nome obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email inválido (ex: seu@email.com)";
    if (f.pass.length < 8) e.pass = "Mínimo 8 caracteres";
    if (f.pass !== f.pass2) e.pass2 = "Senhas não conferem";
    if (f.wa.replace(/\D/g, "").length < 10) e.wa = "WhatsApp inválido (ex: 11999990000)";
    if (!f.uf) e.uf = "Selecione um estado";
    if (!f.city.trim()) e.city = "Selecione uma cidade";
    if (f.cats.length === 0) e.cats = "Escolha pelo menos 1 categoria";
    if (f.bio.length < 20) e.bio = "Bio muito curta (mínimo 20 caracteres)";
    if (!f.profilePhoto) e.profilePhoto = "Foto de perfil obrigatória";
    if (!f.coverPhoto) e.coverPhoto = "Foto de capa obrigatória";
    
    setErrors(e);
    
    if (Object.keys(e).length > 0) {
      const primeiroErro = Object.values(e)[0];
      alert(`⚠️ ${primeiroErro}`);
    }
    
    return Object.keys(e).length === 0;
  };

  const addCategory = () => {
    if (f.novaCat.trim() && f.cats.length < 5) {
      setF({...f, cats: [...f.cats, f.novaCat.trim()], novaCat: ""});
    }
  };

  const next = () => {
    if (step === 1) { 
      if (v()) { 
        setStep(2); 
        trackEvent("CompleteRegistration"); 
        setTimeout(() => scrollRef.current?.scrollTo(0, 0), 100);
      } 
    }
    else if (step === 2) {
      setStep(3);
      trackEvent("Lead", { plan });
      setTimeout(() => scrollRef.current?.scrollTo(0, 0), 100);
    }
  };

  const submit = async () => {
    setLoading(true);
    try {
      if (!window.SupabaseAPI) {
        throw new Error("Supabase não carregou. Recarregue a página.");
      }

      window.SupabaseAPI.initSupabase();

      const selectedPlan = getPlanoById(plan);

      if (!v()) {
        throw new Error("Preencha todos os campos obrigatórios.");
      }

      const { data: authData, error: authError } = await window.SupabaseAPI.signUpUser(f.email, f.pass, { name: f.name });

      if (authError || !authData?.user) {
        const msg = (authError?.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
          throw new Error("Este email já está cadastrado. Tente fazer login.");
        }
        throw new Error(authError?.message || "Erro ao criar conta");
      }

      const userId = authData.user.id;

      let profilePhotoUrl = null;
      let coverPhotoUrl = null;

      if (f.profilePhoto) {
        const photoRes = await window.SupabaseAPI.uploadProfessionalMedia(userId, "profile", f.profilePhoto);
        if (photoRes?.error) throw new Error(photoRes.error.message || "Erro ao enviar foto de perfil");
        profilePhotoUrl = photoRes?.data?.publicUrl || null;
      }

      if (f.coverPhoto) {
        const coverRes = await window.SupabaseAPI.uploadProfessionalMedia(userId, "cover", f.coverPhoto);
        if (coverRes?.error) throw new Error(coverRes.error.message || "Erro ao enviar foto de capa");
        coverPhotoUrl = coverRes?.data?.publicUrl || null;
      }

      const userData = {
        name: f.name,
        email: f.email,
        whatsapp: f.wa,
        city: `${f.city}, ${f.uf}`,
        categories: f.cats,
        bio: f.bio,
        avatar_initials: f.name.substring(0, 2).toUpperCase(),
        avatar_url: profilePhotoUrl,
        cover_photo_url: coverPhotoUrl,
        trial_active: false,
        trial_days_left: 0,
        plan: selectedPlan.id,
        badge: selectedPlan.badge,
      };

      const { data: profesional, error: userError } = await window.SupabaseAPI.updateProfile(userId, userData);

      if (userError) {
        throw new Error(userError.message || "Erro ao criar perfil");
      }

      const trialDates = selectedPlan.trial === true ? getTrialDates() : {};
      const subscriptionData = {
        professional_id: userId,
        subscription_plan: selectedPlan.id,
        plan_price: selectedPlan.preco,
        status: selectedPlan.pago ? "pending_payment" : "active",
        trial_active: false,
        photo_limit: selectedPlan.photoLimit,
        extra_photo_packages: 0,
        banner_active: false,
        ...trialDates,
      };

      const { data: subscription, error: subError } = await window.SupabaseAPI.createSubscription(subscriptionData);

      if (subError) {
        throw new Error(subError.message || "Erro ao criar assinatura");
      }

      trackEvent("Subscribe", { plan: selectedPlan.id, value: selectedPlan.preco, currency: "BRL" });
      
      if (onSuccess) {
        onSuccess({ 
          ...f, 
          plan: selectedPlan.id, 
          id: userId,
          subscriptionId: subscription?.id || null,
          trial_active: false,
          trial_days_left: 0,
          profilePhotoUrl,
          coverPhotoUrl,
        });
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      let mensagemErro = err.message || "Erro ao criar conta. Tente novamente.";
      
      if (mensagemErro.includes("already")) {
        mensagemErro = "Este email já está cadastrado. Tente fazer login.";
      } else if (mensagemErro.includes("invalid")) {
        mensagemErro = "Dados inválidos. Verifique todos os campos.";
      } else if (mensagemErro.includes("network")) {
        mensagemErro = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (mensagemErro.includes("SupabaseAPI")) {
        mensagemErro = "Sistema de autenticação não carregou. Recarregue a página.";
      }
      
      setErrors({ sub: mensagemErro });
      alert(`⚠️ Erro: ${mensagemErro}`);
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div ref={scrollRef} style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", overflowY: "auto", background: C.w, paddingBottom: 80 }}>
      <div style={{ padding: "16px" }}>
        {step > 1 && <button onClick={() => { setStep(step - 1); setErrors({}); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: C.gBg, color: C.dk, marginBottom: "12px" }}>← Voltar</button>}
        
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div><div style={{ fontFamily: font.d, fontWeight: 800, fontSize: 24, color: C.pri }}>TáNaMão</div><div style={{ fontSize: 12, color: C.gL, letterSpacing: "0.1em", textTransform: "uppercase" }}>Cadastro Pro</div></div>
            <div style={{ fontSize: 24 }}>{'●'.repeat(step)}{'○'.repeat(3 - step)}</div>
          </div>
          <div style={{ display: "flex", gap: 6, margin: "12px 0 24px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 1 ? C.pri : C.gB, ...(step >= 1 && { width: 20, borderRadius: 4 }) }}></div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 2 ? C.pri : C.gB, ...(step >= 2 && { width: 20, borderRadius: 4 }) }}></div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 3 ? C.pri : C.gB, ...(step >= 3 && { width: 20, borderRadius: 4 }) }}></div>
          </div>
        </div>

        {step === 1 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Crie seu perfil</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Preencha seus dados e adicione fotos</p>

            {/* FOTOS */}
            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 20, marginTop: 20 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>📸 Suas Fotos</div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 8 }}>Foto de Perfil *</label>
                {f.profilePhotoPreview && <div style={{ marginBottom: 8, textAlign: "center" }}><img src={f.profilePhotoPreview} alt="preview" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.pri}` }} /></div>}
                <input type="file" accept="image/*" onChange={e => handlePhotoUpload("profile", e.target.files?.[0])} style={{ width: "100%", padding: "10px", border: `2px solid ${errors.profilePhoto ? C.cor : C.gB}`, borderRadius: 10, fontSize: 12, fontFamily: font.b }} />
                {errors.profilePhoto && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.profilePhoto}</div>}
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 8 }}>Foto de Capa *</label>
                {f.coverPhotoPreview && <div style={{ marginBottom: 8, textAlign: "center" }}><img src={f.coverPhotoPreview} alt="cover preview" style={{ width: "100%", height: 100, borderRadius: 10, objectFit: "cover", border: `2px solid ${C.pri}` }} /></div>}
                <input type="file" accept="image/*" onChange={e => handlePhotoUpload("cover", e.target.files?.[0])} style={{ width: "100%", padding: "10px", border: `2px solid ${errors.coverPhoto ? C.cor : C.gB}`, borderRadius: 10, fontSize: 12, fontFamily: font.b }} />
                {errors.coverPhoto && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.coverPhoto}</div>}
              </div>
            </div>

            {/* CAMPOS */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Nome completo *</label>
              <input type="text" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.name ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.name} onChange={e => { setF({...f, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}); }} placeholder="João Silva"/>
              {errors.name && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Email *</label>
              <input type="email" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.email ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.email} onChange={e => { setF({...f, email: e.target.value}); if(errors.email) setErrors({...errors, email: null}); }} placeholder="seu@email.com"/>
              {errors.email && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.email}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Senha *</label>
              <input type="password" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.pass ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.pass} onChange={e => { setF({...f, pass: e.target.value}); if(errors.pass) setErrors({...errors, pass: null}); }} placeholder="Min. 8 caracteres"/>
              {errors.pass && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.pass}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Confirmar senha *</label>
              <input type="password" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.pass2 ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.pass2} onChange={e => { setF({...f, pass2: e.target.value}); if(errors.pass2) setErrors({...errors, pass2: null}); }} placeholder="Repita a senha"/>
              {errors.pass2 && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.pass2}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>WhatsApp (com DDD) *</label>
              <input type="tel" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.wa ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.wa} onChange={e => { setF({...f, wa: e.target.value}); if(errors.wa) setErrors({...errors, wa: null}); }} placeholder="(11) 99999-0000"/>
              {errors.wa && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.wa}</div>}
            </div>

            {/* UF */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Estado (UF) *</label>
              <select value={f.uf} onChange={e => { setF({...f, uf: e.target.value, city: ""}); setCitySearch(""); if(errors.uf) setErrors({...errors, uf: null}); }} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.uf ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, fontFamily: font.b }}>
                <option value="">Selecione o estado</option>
                {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              {errors.uf && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.uf}</div>}
            </div>

            {/* CIDADE */}
            {f.uf && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Cidade *</label>
                <div style={{ position: "relative" }}>
                  <input type="text" placeholder={`Digite o nome da cidade de ${f.uf}...`} value={citySearch} onChange={e => { setCitySearch(e.target.value); setShowCityDropdown(true); if(errors.city) setErrors({...errors, city: null}); }} onFocus={() => setShowCityDropdown(true)} onBlur={() => setTimeout(() => setShowCityDropdown(false), 200)} style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.city ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} />
                  
                  {showCityDropdown && filteredCities.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.w, border: `2px solid ${C.gB}`, borderTop: "none", borderRadius: "0 0 12px 12px", maxHeight: 250, overflowY: "auto", zIndex: 100, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                      {filteredCities.map((city, i) => (
                        <div key={i} onClick={() => { setF({...f, city: city.nome}); setCitySearch(""); setShowCityDropdown(false); if(errors.city) setErrors({...errors, city: null}); }} style={{ padding: "12px 14px", borderBottom: `1px solid ${C.gB}`, cursor: "pointer", fontSize: 14, fontFamily: font.b, color: C.dk, background: "transparent", transition: "all 0.15s" }} onMouseEnter={e => { e.target.style.background = C.priLt; e.target.style.color = C.pri; }} onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = C.dk; }}>
                          {city.nome}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showCityDropdown && citySearch.trim() && filteredCities.length === 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.w, border: `2px solid ${C.cor}`, borderTop: "none", borderRadius: "0 0 12px 12px", padding: "12px 14px", zIndex: 100, fontSize: 13, color: C.cor, fontFamily: font.b, textAlign: "center" }}>
                      Nenhuma cidade encontrada
                    </div>
                  )}
                </div>
                {f.city && <div style={{ fontSize: 12, color: C.pri, marginTop: 6, fontWeight: 600 }}>✓ {f.city} - {f.uf} selecionado</div>}
                {errors.city && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.city}</div>}
              </div>
            )}

            {/* CATEGORIAS */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Categorias ({f.cats.length}/5) *</label>
              {errors.cats && <div style={{ color: C.cor, fontSize: 12, marginBottom: 8 }}>{errors.cats}</div>}
              
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 12 }}>
                {CATS_DEFAULT.map(cat => <button key={cat} type="button" onClick={() => { setF({...f, cats: f.cats.includes(cat) ? f.cats.filter(c => c !== cat) : f.cats.length < 5 ? [...f.cats, cat] : f.cats}); if(errors.cats) setErrors({...errors, cats: null}); }} style={{ padding: 12, border: `2px solid ${f.cats.includes(cat) ? C.pri : C.gB}`, borderRadius: 10, background: f.cats.includes(cat) ? C.priLt : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: font.b, color: f.cats.includes(cat) ? C.pri : C.dk }}>{cat}</button>)}
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input type="text" style={{ flex: 1, padding: "10px 12px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 12, outline: "none", fontFamily: font.b }} value={f.novaCat} onChange={e => setF({...f, novaCat: e.target.value})} placeholder="Adicione outra" onKeyPress={e => e.key === "Enter" && addCategory()} />
                <button type="button" onClick={addCategory} style={{ padding: "10px 16px", background: C.pri, color: "#fff", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: font.b }}>+</button>
              </div>

              {f.cats.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {f.cats.map((cat, i) => (
                    <div key={i} style={{ background: C.priLt, color: C.pri, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                      {cat}
                      <button type="button" onClick={() => setF({...f, cats: f.cats.filter((_, idx) => idx !== i)})} style={{ background: "none", border: "none", color: C.pri, cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* BIO */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Bio ({f.bio.length}/100) *</label>
              <textarea style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.bio ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b, resize: "vertical" }} value={f.bio} onChange={e => { setF({...f, bio: e.target.value}); if(errors.bio) setErrors({...errors, bio: null}); }} placeholder="Fale sobre sua experiência..." rows="4" maxLength="100"/>
              {errors.bio && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.bio}</div>}
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Plano</button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Escolha seu plano</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Comece grátis. Depois, assine um plano para aparecer mais.</p>

            <div style={{ margin: "24px 0 16px" }}>
              {PLANS.map(p => (
                <div key={p.id} onClick={() => setPlan(p.id)} style={{ background: plan === p.id ? C.priLt : "#fff", borderRadius: 14, border: `2px solid ${plan === p.id ? C.pri : C.gB}`, borderWidth: plan === p.id ? 2.5 : 2, padding: 18, marginBottom: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{p.destaque ? "💎" : p.pago ? "⭐" : "🚀"}</span>
                        <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800 }}>{p.nome}</div>
                      </div>
                      <div style={{ fontSize: 14, color: C.gL, marginTop: 2 }}>{formatarPrecoPlano(p.preco)}<span style={{ fontSize: 11, color: C.gL }}>{p.periodo}</span></div>
                      {!p.pago && <div style={{ display: "inline-block", background: C.priLt, color: C.pri, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginTop: 8 }}>Cadastro grátis</div>}
                      {p.recomendado && <div style={{ display: "inline-block", background: C.accLt, color: C.acc, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginLeft: 8, marginTop: 8 }}>⭐ Recomendado</div>}
                    </div>
                    <div style={{ fontSize: 24 }}>{plan === p.id ? '✓' : ''}</div>
                  </div>
                  <div style={{ fontSize: 12, color: C.dk, marginBottom: 8, fontWeight: 600 }}>Recursos:</div>
                  {p.feats.map((feat, i) => <div key={i} style={{ fontSize: 12, color: C.dk, padding: "6px 0", display: "flex", alignItems: "center", gap: 6 }}><span style={{ color: C.pri }}>✓</span> {feat}</div>)}
                  {p.restrictions && (
                    <>
                      <div style={{ fontSize: 12, color: C.gL, marginTop: 8, marginBottom: 4, fontWeight: 600 }}>Restrições:</div>
                      {p.restrictions.map((res, i) => <div key={i} style={{ fontSize: 12, color: C.gL, padding: "4px 0", display: "flex", alignItems: "center", gap: 6 }}><span>–</span> {res}</div>)}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div style={{ padding: 14, background: C.priLt, borderRadius: 10, fontSize: 12, color: C.pri, marginBottom: 16, fontWeight: 600 }}>
              💡 Para o lançamento, o mais importante é entrar na plataforma. Depois você pode assinar um plano para ganhar mais visibilidade.
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Confirmar Cadastro</button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Confirme seu cadastro</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Revise os dados antes de finalizar</p>

            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16, marginTop: 20 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seus Dados</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Nome</span><span style={{ fontWeight: 600, color: C.dk }}>{f.name}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Email</span><span style={{ fontWeight: 600, color: C.dk }}>{f.email}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>WhatsApp</span><span style={{ fontWeight: 600, color: C.dk }}>{f.wa}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Localização</span><span style={{ fontWeight: 600, color: C.dk }}>{f.city}, {f.uf}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}><span>Categorias</span><span style={{ fontWeight: 600, color: C.dk }}>{f.cats.slice(0, 2).join(", ")}{f.cats.length > 2 ? `+${f.cats.length - 2}` : ""}</span></div>
            </div>

            {(f.profilePhotoPreview || f.coverPhotoPreview) && (
              <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>📸 Suas Fotos</div>
                {f.profilePhotoPreview && <div style={{ marginBottom: 12, textAlign: "center" }}><img src={f.profilePhotoPreview} alt="profile" style={{ width: 60, height: 60, borderRadius: "50%", objectFit: "cover" }} /></div>}
                {f.coverPhotoPreview && <div><img src={f.coverPhotoPreview} alt="cover" style={{ width: "100%", height: 80, borderRadius: 10, objectFit: "cover" }} /></div>}
              </div>
            )}

            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seu Plano: {getPlanoById(plan)?.nome}</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                <span>Valor</span>
                <span style={{ color: C.pri }}>{formatarPrecoPlano(getPlanoById(plan)?.preco)}{getPlanoById(plan)?.periodo}</span>
              </div>
              <div style={{ fontSize: 12, color: C.gL }}>
                {plan === "gratis" && "Sem cobrança. Ideal para começar."}
                {plan === "pro" && "Você poderá assinar o Pro depois do cadastro."}
                {plan === "premium" && "Você poderá assinar o Premium depois do cadastro."}
              </div>
            </div>

            {false && (
              <div style={{ padding: 12, background: C.accLt, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: C.acc, fontWeight: 600 }}>
                  ⏱️ Você está experimentando gratuitamente os recursos premium do TáNaMão.
                </div>
                <div style={{ fontSize: 11, color: C.acc, marginTop: 4 }}>
                  Após 15 dias, retornará automaticamente para o plano BÁSICO (grátis).
                </div>
              </div>
            )}

            <button type="button" onClick={submit} disabled={loading} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", opacity: loading ? 0.6 : 1, marginBottom: 20 }}>
              {loading ? "Finalizando..." : "🎉 Finalizar Cadastro"}
            </button>
            {errors.sub && <div style={{ color: C.cor, fontSize: 13, marginTop: 12, textAlign: "center" }}>{errors.sub}</div>}
          </>
        )}
      </div>
    </div>
  );
}
