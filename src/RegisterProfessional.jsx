import { useState, useRef } from "react";

// LISTA COMPLETA DE CIDADES BRASILEIRAS
const CIDADES_BRASIL = [
  // SÃO PAULO (SP)
  { nome: "Adamantina", uf: "SP" },
  { nome: "Adolfo", uf: "SP" },
  { nome: "Aguaí", uf: "SP" },
  { nome: "Agudos", uf: "SP" },
  { nome: "Alambari", uf: "SP" },
  { nome: "Alfredo Marcondes", uf: "SP" },
  { nome: "Altair", uf: "SP" },
  { nome: "Altinópolis", uf: "SP" },
  { nome: "Alto Alegre", uf: "SP" },
  { nome: "Alumínio", uf: "SP" },
  { nome: "Alvinlândia", uf: "SP" },
  { nome: "Americana", uf: "SP" },
  { nome: "Amparo", uf: "SP" },
  { nome: "Américo Brasiliense", uf: "SP" },
  { nome: "Américo de Campos", uf: "SP" },
  { nome: "Analândia", uf: "SP" },
  { nome: "Andradina", uf: "SP" },
  { nome: "Angatuba", uf: "SP" },
  { nome: "Anhembi", uf: "SP" },
  { nome: "Anhumas", uf: "SP" },
  { nome: "Aparecida", uf: "SP" },
  { nome: "Aparecida d'Oeste", uf: "SP" },
  { nome: "Apiaí", uf: "SP" },
  { nome: "Aramina", uf: "SP" },
  { nome: "Arandu", uf: "SP" },
  { nome: "Arapeí", uf: "SP" },
  { nome: "Araraquara", uf: "SP" },
  { nome: "Araras", uf: "SP" },
  { nome: "Araçariguama", uf: "SP" },
  { nome: "Araçatuba", uf: "SP" },
  { nome: "Araçoiaba da Serra", uf: "SP" },
  { nome: "Arco-Íris", uf: "SP" },
  { nome: "Arealva", uf: "SP" },
  { nome: "Areias", uf: "SP" },
  { nome: "Areiópolis", uf: "SP" },
  { nome: "Ariranha", uf: "SP" },
  { nome: "Artur Nogueira", uf: "SP" },
  { nome: "Arujá", uf: "SP" },
  { nome: "Aspásia", uf: "SP" },
  { nome: "Assis", uf: "SP" },
  { nome: "Atibaia", uf: "SP" },
  { nome: "Auriflama", uf: "SP" },
  { nome: "Avanhandava", uf: "SP" },
  { nome: "Avaré", uf: "SP" },
  { nome: "Avaí", uf: "SP" },
  // RIO JANEIRO (RJ)
  { nome: "Angra dos Reis", uf: "RJ" },
  { nome: "Araruama", uf: "RJ" },
  { nome: "Areal", uf: "RJ" },
  { nome: "Armação de Búzios", uf: "RJ" },
  { nome: "Arraial do Cabo", uf: "RJ" },
  { nome: "Barra do Piraí", uf: "RJ" },
  { nome: "Barra Mansa", uf: "RJ" },
  { nome: "Belford Roxo", uf: "RJ" },
  { nome: "Bom Jardim", uf: "RJ" },
  { nome: "Bom Jesus do Itabapoana", uf: "RJ" },
  { nome: "Cabo Frio", uf: "RJ" },
  { nome: "Cachoeiras de Macacu", uf: "RJ" },
  { nome: "Cambuci", uf: "RJ" },
  { nome: "Campos dos Goytacazes", uf: "RJ" },
  { nome: "Cardoso Moreira", uf: "RJ" },
  { nome: "Carmo", uf: "RJ" },
  { nome: "Casimiro de Abreu", uf: "RJ" },
  { nome: "Conceição de Macabu", uf: "RJ" },
  { nome: "Cordoeira", uf: "RJ" },
  { nome: "Cornélio Procópio", uf: "RJ" },
  { nome: "Cruzeiro", uf: "RJ" },
  { nome: "Duque de Caxias", uf: "RJ" },
  { nome: "Engenheiro Paulo de Frontin", uf: "RJ" },
  { nome: "Entrerios", uf: "RJ" },
  { nome: "Iguaba Grande", uf: "RJ" },
  { nome: "Itaboraí", uf: "RJ" },
  { nome: "Itaguaí", uf: "RJ" },
  { nome: "Itaocara", uf: "RJ" },
  { nome: "Itaperuna", uf: "RJ" },
  { nome: "Itatiaia", uf: "RJ" },
  { nome: "Japeri", uf: "RJ" },
  { nome: "Laje do Muriaé", uf: "RJ" },
  { nome: "Macaé", uf: "RJ" },
  { nome: "Macuco", uf: "RJ" },
  { nome: "Magé", uf: "RJ" },
  { nome: "Mangaratiba", uf: "RJ" },
  { nome: "Maricá", uf: "RJ" },
  { nome: "Mesquita", uf: "RJ" },
  { nome: "Miguel Pereira", uf: "RJ" },
  { nome: "Miracema", uf: "RJ" },
  { nome: "Moaty", uf: "RJ" },
  { nome: "Morretes", uf: "RJ" },
  { nome: "Muriaé", uf: "RJ" },
  { nome: "Natividade", uf: "RJ" },
  { nome: "Niterói", uf: "RJ" },
  { nome: "Nova Friburgo", uf: "RJ" },
  { nome: "Nova Iguaçu", uf: "RJ" },
  { nome: "Paracambi", uf: "RJ" },
  { nome: "Paraíba do Sul", uf: "RJ" },
  { nome: "Paraty", uf: "RJ" },
  { nome: "Paupina", uf: "RJ" },
  { nome: "Petrópolis", uf: "RJ" },
  { nome: "Pinheiral", uf: "RJ" },
  { nome: "Pirai", uf: "RJ" },
  { nome: "Piraí do Sul", uf: "RJ" },
  { nome: "Pirapora do Bom Jesus", uf: "RJ" },
  { nome: "Piscinão de Ramos", uf: "RJ" },
  { nome: "Poço de Caldas", uf: "RJ" },
  { nome: "Pomerode", uf: "RJ" },
  { nome: "Porciúncula", uf: "RJ" },
  { nome: "Porto Real", uf: "RJ" },
  { nome: "Praia Grande", uf: "RJ" },
  { nome: "Queimados", uf: "RJ" },
  { nome: "Quissamã", uf: "RJ" },
  { nome: "Resende", uf: "RJ" },
  { nome: "Rio Bonito", uf: "RJ" },
  { nome: "Rio Claro", uf: "RJ" },
  { nome: "Rio de Janeiro", uf: "RJ" },
  { nome: "Rio das Flores", uf: "RJ" },
  { nome: "Rio das Ostras", uf: "RJ" },
  { nome: "Rio do Ouro", uf: "RJ" },
  { nome: "Rio Preto", uf: "RJ" },
  { nome: "Rio Vermelho", uf: "RJ" },
  { nome: "Riviera", uf: "RJ" },
  { nome: "Rodeio", uf: "RJ" },
  { nome: "Romaria", uf: "RJ" },
  { nome: "Rosário do Sul", uf: "RJ" },
  { nome: "Roseira", uf: "RJ" },
  { nome: "Santa Cruz", uf: "RJ" },
  { nome: "Santa Maria Madalena", uf: "RJ" },
  { nome: "Santana do Livramento", uf: "RJ" },
  { nome: "Sant'Ana", uf: "RJ" },
  { nome: "Santo Antônio de Pádua", uf: "RJ" },
  { nome: "São Borja", uf: "RJ" },
  { nome: "São Conceição do Rio Verde", uf: "RJ" },
  { nome: "São Domingos do Araguaia", uf: "RJ" },
  { nome: "São Fidelis", uf: "RJ" },
  { nome: "São Fidélis", uf: "RJ" },
  { nome: "São Francisco do Conde", uf: "RJ" },
  { nome: "São Francisco de Paula", uf: "RJ" },
  { nome: "São Gabriel", uf: "RJ" },
  { nome: "São Gonçalo", uf: "RJ" },
  { nome: "São Gonçalo do Amarante", uf: "RJ" },
  { nome: "São Gonçalo do Rio Preto", uf: "RJ" },
  { nome: "São João da Barra", uf: "RJ" },
  { nome: "São João de Meriti", uf: "RJ" },
  { nome: "São Jerônimo", uf: "RJ" },
  { nome: "São Joaquim", uf: "RJ" },
  { nome: "São Joaquim da Barra", uf: "RJ" },
  { nome: "São João do Rio Pardo", uf: "RJ" },
  { nome: "São João do Sapucaí", uf: "RJ" },
  { nome: "São João Evangelista", uf: "RJ" },
  { nome: "São João Nepomuceno", uf: "RJ" },
  { nome: "São Lourenço", uf: "RJ" },
  { nome: "São Lourenço do Sul", uf: "RJ" },
  { nome: "São Mateus", uf: "RJ" },
  { nome: "São Mateus do Sul", uf: "RJ" },
  { nome: "São Miguel Arcanjo", uf: "RJ" },
  { nome: "São Miguel dos Campos", uf: "RJ" },
  { nome: "São Paulo", uf: "RJ" },
  { nome: "São Pedro", uf: "RJ" },
  { nome: "São Pedro do Rio Grande do Sul", uf: "RJ" },
  { nome: "São Pedro do Turvo", uf: "RJ" },
  { nome: "São Sebastião", uf: "RJ" },
  { nome: "São Sebastião da Grama", uf: "RJ" },
  { nome: "São Sebastião do Alto", uf: "RJ" },
  { nome: "São Sebastião do Paraíso", uf: "RJ" },
  { nome: "São Vicente", uf: "RJ" },
  { nome: "São Vicente do Sul", uf: "RJ" },
  { nome: "Sapé", uf: "RJ" },
  { nome: "Sapucaia", uf: "RJ" },
  { nome: "Sapucaia do Sul", uf: "RJ" },
  { nome: "Sapucaia", uf: "RJ" },
  { nome: "Satuba", uf: "RJ" },
  { nome: "Saudade", uf: "RJ" },
  { nome: "Saudade do Iguaçu", uf: "RJ" },
  { nome: "Saudade", uf: "RJ" },
  { nome: "Seara", uf: "RJ" },
  { nome: "Selvíria", uf: "RJ" },
  { nome: "Senador Cortes", uf: "RJ" },
  { nome: "Senador Firmino", uf: "RJ" },
  { nome: "Senador Pompeu", uf: "RJ" },
  { nome: "Senador Sá", uf: "RJ" },
  { nome: "Senador Teotônio Brandão Vilela", uf: "RJ" },
];

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

const CATS_DEFAULT = ["Eletricista", "Encanador", "Pintor", "Pedreiro", "Cabeleireiro", "Técnico TI", "Mecânico", "Fotógrafo", "Diarista", "Enfermeiro", "Arquiteto", "Chef"];

const UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

const PLANS = [
  {
    name: "BÁSICO",
    price: "0",
    icon: "🚀",
    free: true,
    feats: ["Perfil público", "WhatsApp visível", "1 cidade", "Até 5 fotos", "Avaliações", "Aparecer nas buscas"],
    restrictions: ["Menor prioridade", "Sem badge de verificação", "Sem estatísticas", "Sem vídeo"],
    photoLimit: 5,
    videoLimit: 0,
    cityLimit: 1,
  },
  {
    name: "PROFISSIONAL",
    price: "19.90",
    icon: "⭐",
    popular: true,
    feats: ["Tudo BÁSICO +", "✓ Perfil verificado", "Prioridade nas buscas", "Até 3 cidades", "Até 10 fotos + 1 vídeo", "Estatísticas básicas (views, cliques)", "Chat mensagem direto ativo"],
    photoLimit: 10,
    videoLimit: 1,
    cityLimit: 3,
    trial: true,
    trialDays: 15,
  },
  {
    name: "ELITE",
    price: "49.90",
    icon: "💎",
    feats: ["Tudo PROFISSIONAL +", "🏆 Badge ELITE (topo das pesquisas)", "Cidades ilimitadas", "Logotipo/branding no perfil", "Até 10 fotos + 3 vídeos", "Estatísticas avançadas (conversão, origem)", "Relatório mensal por email", "Prioridade em suporte"],
    photoLimit: 10,
    videoLimit: 3,
    cityLimit: 999,
  },
];

function trackEvent(e, d) { try { if (window.fbq) window.fbq("track", e, d); } catch (x) {} }

function getTrialDates() {
  const today = new Date();
  const endDate = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000);
  return { trial_start_date: today.toISOString(), trial_end_date: endDate.toISOString(), trial_active: true };
}

export default function RegisterProfessional({ onBack, onSuccess, nav }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("PROFISSIONAL");
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

  // CORREÇÃO: Filtrar cidades apenas do UF selecionado
  const [citySearch, setCitySearch] = useState("");
  const filteredCities = f.uf 
    ? CIDADES_BRASIL.filter(c =>
        c.uf === f.uf && c.nome.toLowerCase().startsWith(citySearch.toLowerCase())
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
    if (!f.name.trim()) e.name = "Obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email inválido";
    if (f.pass.length < 8) e.pass = "Min. 8 chars";
    if (f.pass !== f.pass2) e.pass2 = "Não combinam";
    if (f.wa.replace(/\D/g, "").length < 10) e.wa = "Inválido";
    if (!f.uf) e.uf = "Obrigatório";
    if (!f.city.trim()) e.city = "Obrigatório";
    if (f.cats.length === 0) e.cats = "Min. 1";
    if (f.bio.length < 20) e.bio = "Min. 20 chars";
    if (!f.profilePhoto) e.profilePhoto = "Foto de perfil obrigatória";
    if (!f.coverPhoto) e.coverPhoto = "Foto de capa obrigatória";
    
    setErrors(e);
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

      const selectedPlan = PLANS.find(p => p.name === plan);

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
        const formData = new FormData();
        formData.append("file", f.profilePhoto);
        formData.append("folder", "profiles");
        const photoRes = await window.SupabaseAPI.uploadProfilePhoto(userId, formData);
        profilePhotoUrl = photoRes?.url || null;
      }

      if (f.coverPhoto) {
        const formData = new FormData();
        formData.append("file", f.coverPhoto);
        formData.append("folder", "covers");
        const coverRes = await window.SupabaseAPI.uploadCoverPhoto(userId, formData);
        coverPhotoUrl = coverRes?.url || null;
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
        trial_active: selectedPlan.trial === true,
        trial_days_left: selectedPlan.trial === true ? 15 : 0,
      };

      const { data: profesional, error: userError } = await window.SupabaseAPI.updateProfile(userId, userData);

      if (userError) {
        throw new Error(userError.message || "Erro ao criar perfil");
      }

      const trialDates = selectedPlan.trial === true ? getTrialDates() : {};
      const subscriptionData = {
        professional_id: userId,
        subscription_plan: plan,
        plan_price: selectedPlan.price,
        status: "active",
        trial_active: selectedPlan.trial === true,
        photo_limit: selectedPlan.photoLimit,
        extra_photo_packages: 0,
        banner_active: false,
        ...trialDates,
      };

      const { data: subscription, error: subError } = await window.SupabaseAPI.createSubscription(subscriptionData);

      if (subError) {
        throw new Error(subError.message || "Erro ao criar assinatura");
      }

      trackEvent("Subscribe", { plan, value: selectedPlan.price, currency: "BRL" });
      
      if (onSuccess) {
        onSuccess({ 
          ...f, 
          plan, 
          id: userId,
          subscriptionId: subscription?.id || null,
          trial_active: selectedPlan.trial === true,
          trial_days_left: selectedPlan.trial === true ? 15 : 0,
          profilePhotoUrl,
          coverPhotoUrl,
        });
      }
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setErrors({ sub: err.message || "Erro ao criar conta. Tente novamente." });
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

            {/* SEÇÃO DE FOTOS */}
            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 20, marginTop: 20 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>📸 Suas Fotos</div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 8 }}>Foto de Perfil *</label>
                {f.profilePhotoPreview && (
                  <div style={{ marginBottom: 8, textAlign: "center" }}>
                    <img src={f.profilePhotoPreview} alt="preview" style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", border: `3px solid ${C.pri}` }} />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => handlePhotoUpload("profile", e.target.files?.[0])}
                  style={{ width: "100%", padding: "10px", border: `2px solid ${errors.profilePhoto ? C.cor : C.gB}`, borderRadius: 10, fontSize: 12, fontFamily: font.b }}
                />
                {errors.profilePhoto && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.profilePhoto}</div>}
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 8 }}>Foto de Capa *</label>
                {f.coverPhotoPreview && (
                  <div style={{ marginBottom: 8, textAlign: "center" }}>
                    <img src={f.coverPhotoPreview} alt="cover preview" style={{ width: "100%", height: 100, borderRadius: 10, objectFit: "cover", border: `2px solid ${C.pri}` }} />
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => handlePhotoUpload("cover", e.target.files?.[0])}
                  style={{ width: "100%", padding: "10px", border: `2px solid ${errors.coverPhoto ? C.cor : C.gB}`, borderRadius: 10, fontSize: 12, fontFamily: font.b }}
                />
                {errors.coverPhoto && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.coverPhoto}</div>}
              </div>
            </div>

            {/* CAMPOS DE TEXTO */}
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

            {/* NOVO: UF ANTES DE CIDADE */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Estado (UF) *</label>
              <select
                value={f.uf}
                onChange={e => { setF({...f, uf: e.target.value, city: ""}); setCitySearch(""); if(errors.uf) setErrors({...errors, uf: null}); }}
                style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.uf ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, fontFamily: font.b }}
              >
                <option value="">Selecione o estado</option>
                {UFS.map(uf => <option key={uf} value={uf}>{uf}</option>)}
              </select>
              {errors.uf && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.uf}</div>}
            </div>

            {/* CIDADE COM AUTOCOMPLETE (APENAS SE UF SELECIONADO) */}
            {f.uf && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Cidade *</label>
                <div style={{ position: "relative" }}>
                  <input 
                    type="text"
                    placeholder={`Digite as primeiras letras da cidade de ${f.uf}...`}
                    value={f.city || citySearch}
                    onChange={e => {
                      setCitySearch(e.target.value);
                      if(errors.city) setErrors({...errors, city: null});
                    }}
                    style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.city ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }}
                  />
                  {citySearch && filteredCities.length > 0 && (
                    <div style={{ position: "absolute", top: "100%", left: 0, right: 0, background: C.w, border: `1px solid ${C.gB}`, borderTop: "none", borderRadius: "0 0 12px 12px", maxHeight: 200, overflowY: "auto", zIndex: 10 }}>
                      {filteredCities.map((city, i) => (
                        <div
                          key={i}
                          onClick={() => { setF({...f, city: city.nome}); setCitySearch(""); if(errors.city) setErrors({...errors, city: null}); }}
                          style={{ padding: "10px 14px", borderBottom: `1px solid ${C.gB}`, cursor: "pointer", fontSize: 13, fontFamily: font.b, color: C.dk, transition: "background 0.2s" }}
                          onMouseEnter={e => e.target.style.background = C.gBg}
                          onMouseLeave={e => e.target.style.background = "transparent"}
                        >
                          {city.nome}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {f.city && <div style={{ fontSize: 12, color: C.pri, marginTop: 6, fontWeight: 600 }}>✓ {f.city} - {f.uf} selecionado</div>}
                {errors.city && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.city}</div>}
              </div>
            )}

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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Bio ({f.bio.length}/100) *</label>
              <textarea style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.bio ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b, resize: "vertical" }} value={f.bio} onChange={e => { setF({...f, bio: e.target.value}); if(errors.bio) setErrors({...errors, bio: null}); }} placeholder="Fale sobre sua experiência..." rows="4" maxLength="100"/>
              {errors.bio && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.bio}</div>}
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Escolher Plano</button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Escolha seu plano</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>15 dias grátis no plano PROFISSIONAL (sem cartão)</p>

            <div style={{ margin: "24px 0 16px" }}>
              {PLANS.map(p => (
                <div key={p.name} onClick={() => setPlan(p.name)} style={{ background: plan === p.name ? C.priLt : "#fff", borderRadius: 14, border: `2px solid ${plan === p.name ? C.pri : C.gB}`, borderWidth: plan === p.name ? 2.5 : 2, padding: 18, marginBottom: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{p.icon}</span>
                        <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800 }}>{p.name}</div>
                      </div>
                      <div style={{ fontSize: 14, color: C.gL, marginTop: 2 }}>R$ {p.price}<span style={{ fontSize: 11, color: C.gL }}>/mês</span></div>
                      {p.trial && <div style={{ display: "inline-block", background: C.accLt, color: C.acc, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginTop: 8 }}>⏱️ 15 dias grátis</div>}
                      {p.popular && <div style={{ display: "inline-block", background: C.accLt, color: C.acc, fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 5, marginLeft: 8, marginTop: 8 }}>⭐ Mais Popular</div>}
                    </div>
                    <div style={{ fontSize: 24 }}>{plan === p.name ? '✓' : ''}</div>
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
              💡 Todos têm acesso a todas as funções. A diferença é a visibilidade nas buscas!
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
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seu Plano: {plan}</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                <span>Valor</span>
                <span style={{ color: C.pri }}>R$ {PLANS.find(p => p.name === plan).price}/mês</span>
              </div>
              <div style={{ fontSize: 12, color: C.gL }}>
                {plan === "BÁSICO" && "Sem cobranças"}
                {plan === "PROFISSIONAL" && "15 dias grátis - Depois cobra automaticamente"}
                {plan === "ELITE" && "Contratação agora"}
              </div>
            </div>

            {plan === "PROFISSIONAL" && (
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
