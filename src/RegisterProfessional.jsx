import { useState, useRef } from "react";

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

function trackEvent(e, d) { try { if (window.fbq) window.fbq("track", e, d); } catch (x) {} }

export default function RegisterProfessional({ onBack, onSuccess, nav }) {
  const [step, setStep] = useState(1);
  const [plan, setPlan] = useState("Premium");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  const [f, setF] = useState({ name: "", email: "", pass: "", pass2: "", wa: "", city: "", cats: [], bio: "" });

  const v = () => {
    const e = {};
    if (!f.name.trim()) e.name = "Obrigatório";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Email inválido";
    if (f.pass.length < 8) e.pass = "Min. 8 chars";
    if (f.pass !== f.pass2) e.pass2 = "Não combinam";
    if (f.wa.replace(/\D/g, "").length < 10) e.wa = "Inválido";
    if (!f.city.trim()) e.city = "Obrigatório";
    if (f.cats.length === 0) e.cats = "Min. 1";
    if (f.bio.length < 20) e.bio = "Min. 20 chars";
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
    try {
      if (!window.SupabaseAPI) {
        throw new Error("Supabase não carregou. Recarregue a página.");
      }

      window.SupabaseAPI.initSupabase();

      const userData = {
        name: f.name,
        email: f.email,
        password: f.pass,
        whatsapp: f.wa,
        city: f.city,
        categories: f.cats,
        bio: f.bio,
        avatar_initials: f.name.substring(0, 2).toUpperCase(),
        badge: plan === "VIP" ? "premium" : plan === "Premium" ? "pro" : null,
        trial_active: true,
        trial_days_left: 7,
      };

      const { data: profesional, error: userError } = await window.SupabaseAPI.createUser(userData);

      if (userError) {
        throw new Error(userError.message || "Erro ao criar usuário");
      }

      const planPrices = { "Profissional": 99, "Premium": 199, "VIP": 399 };
      const { data: subscription, error: subError } = await window.SupabaseAPI.createSubscription({
        professional_id: profesional.id,
        plan_name: plan,
        plan_price: planPrices[plan],
        status: "active",
        trial_active: true,
        payment_method: "trial",
      });

      if (subError) {
        throw new Error(subError.message || "Erro ao criar plano");
      }

      trackEvent("Subscribe", { value: planPrices[plan], currency: "BRL" });
      
      if (onSuccess) {
        onSuccess({ 
          ...f, 
          plan, 
          id: profesional.id,
          subscriptionId: subscription.id 
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
        {step > 1 && <button onClick={() => { setStep(1); setErrors({}); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: C.gBg, color: C.dk, marginBottom: "12px" }}>← Voltar</button>}
        
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
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Preencha seus dados para começar a receber clientes</p>

            <div style={{ marginBottom: 16, marginTop: 20 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Nome completo *</label>
              <input type="text" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.name ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b, boxShadow: errors.name ? "" : "none" }} value={f.name} onChange={e => { setF({...f, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}); }} placeholder="João Silva"/>
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

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Cidade *</label>
              <input type="text" style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.city ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b }} value={f.city} onChange={e => { setF({...f, city: e.target.value}); if(errors.city) setErrors({...errors, city: null}); }} placeholder="São Paulo, SP"/>
              {errors.city && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.city}</div>}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Categorias de serviço *</label>
              {errors.cats && <div style={{ color: C.cor, fontSize: 12, marginBottom: 8 }}>{errors.cats}</div>}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 10 }}>
                {CATS.map(cat => <button key={cat} type="button" onClick={() => { setF({...f, cats: f.cats.includes(cat) ? f.cats.filter(c => c !== cat) : [...f.cats, cat]}); if(errors.cats) setErrors({...errors, cats: null}); }} style={{ padding: 12, border: `2px solid ${f.cats.includes(cat) ? C.pri : C.gB}`, borderRadius: 10, background: f.cats.includes(cat) ? C.priLt : "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.15s", fontFamily: font.b, color: f.cats.includes(cat) ? C.pri : C.dk }}>{cat}</button>)}
              </div>
              <div style={{ fontSize: 11, color: C.gL, marginTop: 4 }}>{f.cats.length}/5 selecionadas</div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontWeight: 600, fontSize: 14, color: C.dk, marginBottom: 8 }}>Bio (apresentação) * <span style={{ opacity: 0.8 }}>({f.bio.length}/100)</span></label>
              <textarea style={{ width: "100%", padding: "13px 14px", border: `2px solid ${errors.bio ? C.cor : C.gB}`, borderRadius: 12, fontSize: 14, outline: "none", fontFamily: font.b, resize: "vertical" }} value={f.bio} onChange={e => { setF({...f, bio: e.target.value}); if(errors.bio) setErrors({...errors, bio: null}); }} placeholder="Fale sobre sua experiência, especializações..." rows="4" maxLength="100"/>
              {errors.bio && <div style={{ color: C.cor, fontSize: 12, marginTop: 4 }}>{errors.bio}</div>}
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Escolher Plano</button>
          </>
        )}

        {step === 2 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Escolha seu plano</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Comece com 7 dias grátis, sem cartão de crédito</p>

            <div style={{ margin: "24px 0 16px" }}>
              {PLANS.map(p => (
                <div key={p.name} onClick={() => setPlan(p.name)} style={{ background: "#fff", borderRadius: 14, border: `2px solid ${plan === p.name ? C.pri : C.gB}`, borderWidth: plan === p.name ? 2.5 : 2, background: plan === p.name ? C.priLt : "#fff", padding: 18, marginBottom: 12, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 20 }}>{p.icon}</span>
                        <div style={{ fontFamily: font.d, fontSize: 16, fontWeight: 800 }}>{p.name}</div>
                      </div>
                      <div style={{ fontSize: 14, color: C.gL, marginTop: 2 }}>R$ {p.price}<span style={{ fontSize: 11, color: C.gL }}>/mês</span></div>
                      {p.popular && <div style={{ display: "inline-block", background: C.accLt, color: C.acc, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 5, marginBottom: 8, marginTop: 8 }}>Mais Popular</div>}
                    </div>
                    <div style={{ fontSize: 24 }}>{plan === p.name ? '✓' : ''}</div>
                  </div>
                  {p.feats.map((feat, i) => <div key={i} style={{ fontSize: 13, color: C.dk, padding: "8px 0", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${C.gB}` }}><span style={{ color: C.pri }}>✓</span> {feat}</div>)}
                </div>
              ))}
            </div>

            <div style={{ padding: 12, background: C.gBg, borderRadius: 10, fontSize: 12, color: C.g, marginBottom: 16 }}>
              ✅ Primeiros 7 dias grátis · ✅ Sem cartão · ✅ Cancele quando quiser
            </div>

            <button type="button" onClick={next} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", marginBottom: 20 }}>Continuar → Confirmar</button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 style={{ fontFamily: font.d, fontSize: 22, fontWeight: 800, color: C.dk }}>Confirme seu cadastro</h1>
            <p style={{ fontSize: 13, color: C.gL, marginTop: 4 }}>Verifique os dados antes de concluir</p>

            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16, marginTop: 20 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seus Dados</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Nome</span><span style={{ fontWeight: 600, color: C.dk }}>{f.name}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Email</span><span style={{ fontWeight: 600, color: C.dk }}>{f.email}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>WhatsApp</span><span style={{ fontWeight: 600, color: C.dk }}>{f.wa}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13, borderBottom: `1px solid ${C.gB}` }}><span>Cidade</span><span style={{ fontWeight: 600, color: C.dk }}>{f.city}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}><span>Categorias</span><span style={{ fontWeight: 600, color: C.dk }}>{f.cats.join(", ")}</span></div>
            </div>

            <div style={{ background: C.priLt, borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.pri, marginBottom: 12, fontSize: 14 }}>Seu Plano</div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", fontSize: 13 }}><span style={{ fontSize: 15, fontWeight: 700 }}>{plan}</span><span style={{ fontWeight: 600, color: C.dk }}>R$ {PLANS.find(p => p.name === plan).price}/mês</span></div>
              <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>7 dias grátis - Após este período, será cobrado automaticamente</div>
            </div>

            <button type="button" onClick={submit} disabled={loading} style={{ padding: "15px", border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 700, cursor: loading ? "wait" : "pointer", fontFamily: font.d, width: "100%", background: `linear-gradient(135deg, ${C.pri}, ${C.acc})`, color: "#fff", opacity: loading ? 0.6 : 1, marginBottom: 20 }}>
              {loading ? "Criando conta..." : "🎉 Finalizar Cadastro"}
            </button>
            {errors.sub && <div style={{ color: C.cor, fontSize: 13, marginTop: 12, textAlign: "center" }}>{errors.sub}</div>}
          </>
        )}
      </div>
    </div>
  );
}
