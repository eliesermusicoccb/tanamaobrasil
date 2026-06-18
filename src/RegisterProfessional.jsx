import { useState, useRef } from "react";
import { signUp, createProfessionalProfile, createSubscription } from "./supabaseClient";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

const CATS = ["Eletricista", "Encanador", "Pintor", "Pedreiro", "Cabeleireiro", "Técnico TI", "Mecânico", "Fotógrafo", "Diarista", "Enfermeiro", "Arquiteto", "Chef"];

const PLANS = [
  { name: "Profissional", price: "99", icon: "⭐", feats: ["Perfil com foto", "Chat ilimitado", "5 categorias", "Aparecer nas buscas"] },
  { name: "Premium", price: "199", icon: "💎", popular: true, feats: ["Tudo Profissional +", "Destaque em buscas", "Portfólio 20 fotos", "Badge Premium", "Dashboard"] },
  { name: "VIP", price: "399", icon: "👑", feats: ["Tudo Premium +", "1º lugar buscas", "Portfólio ilimitado", "Suporte 24/7"] },
];

function trackEvent(e, d) { 
  try { 
    if (window.fbq) window.fbq("track", e, d); 
  } catch (x) {} 
}

export default function RegisterProfessional({ onBack, onSuccess, nav }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("Premium");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const scrollRef = useRef(null);

  const [f, setF] = useState({ 
    name: "", 
    email: "", 
    pass: "", 
    pass2: "", 
    wa: "", 
    city: "", 
    cats: [], 
    bio: "" 
  });

  const v = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email inválido";
    if (f.pass.length < 8) e.pass = "Min. 8 caracteres";
    if (f.pass !== f.pass2) e.pass2 = "Não combinam";
    if (f.wa.replace(/\D/g, "").length < 10) e.wa = "Inválido";
    if (!f.city.trim()) e.city = "Obrigatório";
    if (f.cats.length === 0) e.cats = "Min. 1";
    if (f.bio.length < 20) e.bio = "Min. 20 caracteres";
    setErrors(e);
    return Object.keys(e).length === 0;
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
    setSuccessMsg("");
    try {
      // ✅ PASSO 1: Criar conta com autenticação do Supabase (senhas criptografadas)
      const { data: authData, error: signUpError } = await signUp(f.email, f.pass);

      if (signUpError) {
        throw new Error(signUpError.message || "Erro ao criar conta");
      }

      if (!authData?.user?.id) {
        throw new Error("Erro ao gerar ID do usuário");
      }

      const userId = authData.user.id;

      // ✅ PASSO 2: Criar perfil profissional (SEM armazenar a senha!)
      const profileData = {
        name: f.name,
        email: f.email,
        whatsapp: f.wa,
        city: f.city,
        categories: f.cats,
        bio: f.bio,
        avatar_initials: f.name.substring(0, 2).toUpperCase(),
        badge: plan === "VIP" ? "premium" : plan === "Premium" ? "pro" : null,
        trial_active: true,
        trial_days_left: 7,
      };

      const { data: professional, error: profileError } = await createProfessionalProfile(userId, profileData);

      if (profileError) {
        throw new Error(profileError.message || "Erro ao criar perfil");
      }

      // ✅ PASSO 3: Criar subscription/plano
      const planPrices = { "Profissional": 99, "Premium": 199, "VIP": 399 };
      const { data: subscription, error: subError } = await createSubscription({
        professional_id: userId,
        plan_name: plan,
        plan_price: planPrices[plan],
        status: "active",
        trial_active: true,
        payment_method: "trial",
        created_at: new Date().toISOString()
      });

      if (subError) {
        throw new Error(subError.message || "Erro ao criar plano");
      }

      trackEvent("Purchase", { value: planPrices[plan], currency: "BRL", plan });

      setSuccessMsg("✅ Conta criada com sucesso! Redirecionando...");
      
      setTimeout(() => {
        if (onSuccess) {
          onSuccess({
            id: userId,
            name: f.name,
            email: f.email,
            badge: professional.badge,
            avatar_initials: professional.avatar_initials,
            authUser: authData.user
          });
        }
      }, 2000);

    } catch (err) {
      console.error("Erro no registro:", err);
      setErrors({ submit: err.message || "Erro ao registrar" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={scrollRef} style={{ maxWidth: 600, margin: "0 auto", minHeight: "100vh", background: C.w, display: "flex", flexDirection: "column", padding: "20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font.b}'; background: ${C.w}; }
        input, textarea, select { font-family: '${font.b}'; }
        input:disabled, textarea:disabled, select:disabled { opacity: 0.5; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <div>
          <div style={{ fontFamily: font.d, fontSize: 28, fontWeight: 900, color: C.pri }}>TáNaMão</div>
          <div style={{ fontSize: 12, color: C.gL }}>Cadastro de Profissional</div>
        </div>
        <button 
          onClick={onBack}
          disabled={loading}
          style={{ 
            background: "none", 
            border: "none", 
            fontSize: 24, 
            cursor: "pointer",
            opacity: loading ? 0.5 : 1
          }}
        >
          ✕
        </button>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 8, marginBottom: 30 }}>
        {[1, 2, 3].map((s) => (
          <div key={s} style={{ 
            flex: 1, 
            height: 4, 
            background: s <= step ? C.pri : C.gB, 
            borderRadius: 2,
            transition: "all 0.3s"
          }}></div>
        ))}
      </div>

      {/* Success Message */}
      {successMsg && (
        <div style={{ 
          background: "#D1FAE5", 
          border: `1px solid ${C.pri}`, 
          borderRadius: 10, 
          padding: 12, 
          marginBottom: 20, 
          color: C.pri, 
          fontSize: 13, 
          fontWeight: 600 
        }}>
          {successMsg}
        </div>
      )}

      {/* Erro Geral */}
      {errors.submit && (
        <div style={{ 
          background: C.corLt, 
          border: `1px solid ${C.cor}`, 
          borderRadius: 10, 
          padding: 12, 
          marginBottom: 20, 
          color: C.cor, 
          fontSize: 13, 
          fontWeight: 600 
        }}>
          {errors.submit}
        </div>
      )}

      {/* STEP 1: Dados Básicos */}
      {step === 1 && (
        <div>
          <h2 style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: C.dk, marginBottom: 20 }}>
            Seus Dados
          </h2>

          {/* Nome */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              Nome Completo *
            </label>
            <input
              type="text"
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
              placeholder="João Silva"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: `2px solid ${errors.name ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b 
              }}
              disabled={loading}
            />
            {errors.name && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.name}</span>}
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              Email *
            </label>
            <input
              type="email"
              value={f.email}
              onChange={(e) => setF({ ...f, email: e.target.value })}
              placeholder="joao@email.com"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: `2px solid ${errors.email ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b 
              }}
              disabled={loading}
            />
            {errors.email && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.email}</span>}
          </div>

          {/* Senha */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              Senha (min. 8 caracteres) *
            </label>
            <input
              type="password"
              value={f.pass}
              onChange={(e) => setF({ ...f, pass: e.target.value })}
              placeholder="••••••••"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: `2px solid ${errors.pass ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b 
              }}
              disabled={loading}
            />
            {errors.pass && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.pass}</span>}
          </div>

          {/* Confirmar Senha */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              Confirmar Senha *
            </label>
            <input
              type="password"
              value={f.pass2}
              onChange={(e) => setF({ ...f, pass2: e.target.value })}
              placeholder="••••••••"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: `2px solid ${errors.pass2 ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b 
              }}
              disabled={loading}
            />
            {errors.pass2 && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.pass2}</span>}
          </div>

          {/* WhatsApp */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              WhatsApp *
            </label>
            <input
              type="tel"
              value={f.wa}
              onChange={(e) => setF({ ...f, wa: e.target.value })}
              placeholder="(11) 99999-9999"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: `2px solid ${errors.wa ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b 
              }}
              disabled={loading}
            />
            {errors.wa && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.wa}</span>}
          </div>

          {/* Cidade */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              Cidade *
            </label>
            <input
              type="text"
              value={f.city}
              onChange={(e) => setF({ ...f, city: e.target.value })}
              placeholder="São Paulo"
              style={{ 
                width: "100%", 
                padding: "12px 14px", 
                border: `2px solid ${errors.city ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b 
              }}
              disabled={loading}
            />
            {errors.city && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.city}</span>}
          </div>

          {/* Botão Próximo */}
          <button
            onClick={next}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`,
              color: "#fff",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "wait" : "pointer",
              fontFamily: font.d,
              opacity: loading ? 0.6 : 1,
            }}
          >
            Próximo →
          </button>
        </div>
      )}

      {/* STEP 2: Categorias & Bio */}
      {step === 2 && (
        <div>
          <h2 style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: C.dk, marginBottom: 20 }}>
            Sobre Você
          </h2>

          {/* Categorias */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 12 }}>
              Especialidades * (selecione ao menos 1)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {CATS.map((cat) => (
                <label key={cat} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={f.cats.includes(cat)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setF({ ...f, cats: [...f.cats, cat] });
                      } else {
                        setF({ ...f, cats: f.cats.filter((c) => c !== cat) });
                      }
                    }}
                    style={{ width: 18, height: 18, cursor: "pointer" }}
                    disabled={loading}
                  />
                  <span style={{ fontSize: 13, color: C.dk }}>{cat}</span>
                </label>
              ))}
            </div>
            {errors.cats && <span style={{ fontSize: 12, color: C.cor, marginTop: 8 }}>{errors.cats}</span>}
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>
              Descrição (min. 20 caracteres) *
            </label>
            <textarea
              value={f.bio}
              onChange={(e) => setF({ ...f, bio: e.target.value })}
              placeholder="Descreva sua experiência e serviços..."
              style={{ 
                width: "100%", 
                minHeight: 100,
                padding: "12px 14px", 
                border: `2px solid ${errors.bio ? C.cor : C.gB}`, 
                borderRadius: 10, 
                fontSize: 14, 
                outline: "none",
                fontFamily: font.b,
                resize: "vertical"
              }}
              disabled={loading}
            />
            {errors.bio && <span style={{ fontSize: 12, color: C.cor, marginTop: 4 }}>{errors.bio}</span>}
          </div>

          {/* Botões */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setStep(1)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "14px",
                background: C.gBg,
                color: C.dk,
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: font.d,
                opacity: loading ? 0.6 : 1,
              }}
            >
              ← Voltar
            </button>
            <button
              onClick={next}
              disabled={loading}
              style={{
                flex: 1,
                padding: "14px",
                background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: font.d,
                opacity: loading ? 0.6 : 1,
              }}
            >
              Próximo →
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Planos */}
      {step === 3 && (
        <div>
          <h2 style={{ fontFamily: font.d, fontSize: 20, fontWeight: 800, color: C.dk, marginBottom: 20 }}>
            Escolha seu Plano
          </h2>

          {/* Cards de Planos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16, marginBottom: 24 }}>
            {PLANS.map((p) => (
              <div
                key={p.name}
                onClick={() => setPlan(p.name)}
                style={{
                  padding: 20,
                  border: `2px solid ${plan === p.name ? C.pri : C.gB}`,
                  borderRadius: 12,
                  background: plan === p.name ? C.priLt : "#fff",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  opacity: loading ? 0.5 : 1,
                  position: "relative"
                }}
              >
                {p.popular && (
                  <div style={{ 
                    position: "absolute", 
                    top: -12, 
                    left: 20, 
                    background: C.acc, 
                    color: "#fff", 
                    padding: "4px 12px", 
                    borderRadius: 20, 
                    fontSize: 11, 
                    fontWeight: 700 
                  }}>
                    MAIS POPULAR
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{p.icon}</div>
                    <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800, color: C.dk }}>
                      {p.name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: font.d, fontSize: 20, fontWeight: 900, color: C.pri }}>
                      R$ {p.price}
                    </div>
                    <div style={{ fontSize: 11, color: C.gL }}>/mês</div>
                  </div>
                </div>
                <ul style={{ fontSize: 13, color: C.g, lineHeight: 1.6 }}>
                  {p.feats.map((feat) => (
                    <li key={feat} style={{ marginBottom: 6 }}>✓ {feat}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Termos */}
          <div style={{ 
            background: C.gBg, 
            padding: 12, 
            borderRadius: 10, 
            fontSize: 12, 
            color: C.g, 
            marginBottom: 24, 
            lineHeight: 1.5 
          }}>
            ✓ 7 dias de trial grátis<br/>
            ✓ Sem cartão necessário no trial<br/>
            ✓ Cancele quando quiser
          </div>

          {/* Botões */}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={() => setStep(2)}
              disabled={loading}
              style={{
                flex: 1,
                padding: "14px",
                background: C.gBg,
                color: C.dk,
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: font.d,
                opacity: loading ? 0.6 : 1,
              }}
            >
              ← Voltar
            </button>
            <button
              onClick={submit}
              disabled={loading}
              style={{
                flex: 1,
                padding: "14px",
                background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`,
                color: "#fff",
                border: "none",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: font.d,
                opacity: loading ? 0.6 : 1,
              }}
            >
              {loading ? "Criando conta..." : "Criar Conta"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
