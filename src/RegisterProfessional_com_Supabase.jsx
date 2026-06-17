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
  const [toast, setToast] = useState("");
  const scrollRef = useRef(null);

  const [f, setF] = useState({ name: "", email: "", pass: "", pass2: "", wa: "", city: "", cats: [], bio: "" });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

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
    if (step === 1) { if (v()) { setStep(2); trackEvent("CompleteRegistration"); scrollRef.current?.scrollTo(0, 0); } }
    else if (step === 2) { setStep(3); trackEvent("Lead", { plan }); scrollRef.current?.scrollTo(0, 0); }
  };

  const submit = async () => {
    setLoading(true);
    try {
      // Inicializa Supabase
      window.SupabaseAPI.initSupabase();
      
      // Cria o profissional no banco
      const { data, error } = await window.SupabaseAPI.createUser({
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
        trial_days_left: 7
      });

      if (error) {
        console.error("Erro ao criar profissional:", error);
        setErrors({ sub: "Erro ao cadastrar. Tente novamente." });
        setLoading(false);
        return;
      }

      // Cria a assinatura do plano
      if (data && data.id) {
        const planPrice = plan === "Profissional" ? 99 : plan === "Premium" ? 199 : 399;
        await window.SupabaseAPI.createSubscription({
          professional_id: data.id,
          plan_name: plan,
          plan_price: planPrice,
          status: "active",
          trial_active: true,
          payment_method: "trial"
        });
      }

      trackEvent("Subscribe", { value: parseInt(PLANS.find(p => p.name === plan).price), currency: "BRL" });
      showToast("✅ Conta criada com sucesso!");
      
      if (onSuccess) {
        onSuccess({ ...f, plan, id: data?.id });
      }
    } catch (err) {
      console.error("Erro:", err);
      setErrors({ sub: "Erro ao cadastrar. Tente novamente." });
    } finally { 
      setLoading(false); 
    }
  };

  const styles = `
    * { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    body { font-family: '${font.b}'; }
    input, textarea, select { font-family: '${font.b}'; }
    .sc { max-width: 480px; margin: 0 auto; min-height: 100vh; overflow-y: auto; }
    .c { padding: 16px; }
    .h { padding: 16px 0 12px; display: flex; align-items: center; gap: 12px; }
    .t { font-family: '${font.d}'; font-size: 22px; font-weight: 800; color: ${C.dk}; }
    .st { font-size: 13px; color: ${C.gL}; margin-top: 4px; }
    .pg { display: flex; gap: 6px; margin: 12px 0 24px; }
    .pd { width: 8px; height: 8px; border-radius: 50%; background: ${C.gB}; }
    .pd.a { background: ${C.pri}; width: 20px; border-radius: 4px; }
    .fg { margin-bottom: 16px; }
    .l { display: block; font-weight: 600; font-size: 14px; color: ${C.dk}; margin-bottom: 8px; }
    .i { width: 100%; padding: 13px 14px; border: 2px solid ${C.gB}; border-radius: 12px; font-size: 14px; outline: none; }
    .i:focus { border-color: ${C.pri}; box-shadow: 0 0 0 4px ${C.priGlow}; }
    .i.e { border-color: ${C.cor}; }
    .et { color: ${C.cor}; font-size: 12px; margin-top: 4px; }
    .cg { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px; }
    .cb { padding: 12px; border: 2px solid ${C.gB}; border-radius: 10px; background: #fff; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.15s; }
    .cb:active { transform: scale(0.95); }
    .cb.s { background: ${C.priLt}; border-color: ${C.pri}; color: ${C.pri}; }
    .cc { font-size: 11px; color: ${C.gL}; margin-top: 4px; }
    .btn { padding: 15px; border: none; border-radius: 12px; font-size: 15px; font-weight: 700; cursor: pointer; font-family: '${font.d}'; width: 100%; transition: transform 0.1s; }
    .btn:active { transform: scale(0.97); }
    .btn-p { background: linear-gradient(135deg, ${C.pri}, ${C.acc}); color: #fff; }
    .btn-b { background: ${C.gBg}; color: ${C.dk}; margin-bottom: 12px; }
    .pc { background: #fff; border-radius: 14px; border: 2px solid ${C.gB}; padding: 18px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s; }
    .pc:active { transform: scale(0.98); }
    .pc.p { border-color: ${C.pri}; border-width: 2.5px; background: ${C.priLt}; }
    .pch { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .pcn { font-family: '${font.d}'; font-size: 16px; font-weight: 800; }
    .pcp { font-size: 14px; color: ${C.gL}; margin-top: 2px; }
    .pcf { font-size: 13px; color: ${C.dk}; padding: 8px 0; display: flex; align-items: center; gap: 8px; }
    .pcf:not(:last-child) { border-bottom: 1px solid ${C.gB}; }
    .ck { color: ${C.pri}; }
    .conf { background: ${C.priLt}; border-radius: 14px; padding: 16px; margin-bottom: 16px; }
    .ch { font-weight: 700; color: ${C.pri}; margin-bottom: 12px; font-size: 14px; }
    .cr { display: flex; justify-content: space-between; padding: 8px 0; font-size: 13px; border-bottom: 1px solid ${C.gB}; }
    .cr:last-child { border: none; }
    .cv { font-weight: 600; color: ${C.dk}; }
    .logo { font-family: '${font.d}'; font-weight: 800; font-size: 24px; color: ${C.pri}; }
    .logo2 { font-size: 12px; color: ${C.gL}; letter-spacing: 0.1em; text-transform: uppercase; }
    .badge { display: inline-block; background: ${C.accLt}; color: ${C.acc}; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 5px; margin-bottom: 8px; }
    .span80 { opacity: 0.8; }
    .toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); background: ${C.dk}; color: #fff; padding: 12px 24px; border-radius: 12px; font-size: 13px; font-weight: 600; z-index: 300; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }
  `;

  return (
    <div style={{ background: C.w }}>
      <style>{styles}</style>
      <div className="sc" ref={scrollRef}>
        <div className="c">
          {step > 1 && <button onClick={() => { setStep(1); setErrors({}); }} className="btn btn-b" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>← Voltar</button>}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div><div className="logo">TáNaMão</div><div className="logo2">Cadastro Pro</div></div>
              <div style={{ fontSize: 24 }}>{'●'.repeat(step)}{'○'.repeat(3 - step)}</div>
            </div>
            <div className="pg">
              <div className={`pd ${step >= 1 ? 'a' : ''}`}></div>
              <div className={`pd ${step >= 2 ? 'a' : ''}`}></div>
              <div className={`pd ${step >= 3 ? 'a' : ''}`}></div>
            </div>
          </div>

          {step === 1 && (
            <>
              <h1 className="t">Crie seu perfil</h1>
              <p className="st">Preencha seus dados para começar a receber clientes</p>

              <div className="fg">
                <label className="l">Nome completo *</label>
                <input type="text" className={`i ${errors.name ? 'e' : ''}`} value={f.name} onChange={e => { setF({...f, name: e.target.value}); if(errors.name) setErrors({...errors, name: null}); }} placeholder="João Silva"/>
                {errors.name && <div className="et">{errors.name}</div>}
              </div>

              <div className="fg">
                <label className="l">Email *</label>
                <input type="email" className={`i ${errors.email ? 'e' : ''}`} value={f.email} onChange={e => { setF({...f, email: e.target.value}); if(errors.email) setErrors({...errors, email: null}); }} placeholder="seu@email.com"/>
                {errors.email && <div className="et">{errors.email}</div>}
              </div>

              <div className="fg">
                <label className="l">Senha *</label>
                <input type="password" className={`i ${errors.pass ? 'e' : ''}`} value={f.pass} onChange={e => { setF({...f, pass: e.target.value}); if(errors.pass) setErrors({...errors, pass: null}); }} placeholder="Min. 8 caracteres"/>
                {errors.pass && <div className="et">{errors.pass}</div>}
              </div>

              <div className="fg">
                <label className="l">Confirmar senha *</label>
                <input type="password" className={`i ${errors.pass2 ? 'e' : ''}`} value={f.pass2} onChange={e => { setF({...f, pass2: e.target.value}); if(errors.pass2) setErrors({...errors, pass2: null}); }} placeholder="Repita a senha"/>
                {errors.pass2 && <div className="et">{errors.pass2}</div>}
              </div>

              <div className="fg">
                <label className="l">WhatsApp (com DDD) *</label>
                <input type="tel" className={`i ${errors.wa ? 'e' : ''}`} value={f.wa} onChange={e => { setF({...f, wa: e.target.value}); if(errors.wa) setErrors({...errors, wa: null}); }} placeholder="(11) 99999-0000"/>
                {errors.wa && <div className="et">{errors.wa}</div>}
              </div>

              <div className="fg">
                <label className="l">Cidade *</label>
                <input type="text" className={`i ${errors.city ? 'e' : ''}`} value={f.city} onChange={e => { setF({...f, city: e.target.value}); if(errors.city) setErrors({...errors, city: null}); }} placeholder="São Paulo, SP"/>
                {errors.city && <div className="et">{errors.city}</div>}
              </div>

              <div className="fg">
                <label className="l">Categorias de serviço *</label>
                {errors.cats && <div className="et">{errors.cats}</div>}
                <div className="cg">
                  {CATS.map(cat => <button key={cat} type="button" onClick={() => { setF({...f, cats: f.cats.includes(cat) ? f.cats.filter(c => c !== cat) : [...f.cats, cat]}); if(errors.cats) setErrors({...errors, cats: null}); }} className={`cb ${f.cats.includes(cat) ? 's' : ''}`}>{cat}</button>)}
                </div>
                <div className="cc">{f.cats.length}/5 selecionadas</div>
              </div>

              <div className="fg">
                <label className="l">Bio (apresentação) * <span className="span80">({f.bio.length}/100)</span></label>
                <textarea className={`i ${errors.bio ? 'e' : ''}`} value={f.bio} onChange={e => { setF({...f, bio: e.target.value}); if(errors.bio) setErrors({...errors, bio: null}); }} placeholder="Fale sobre sua experiência, especializações..." rows="4" maxLength="100"/>
                {errors.bio && <div className="et">{errors.bio}</div>}
              </div>

              <button type="button" onClick={next} className="btn btn-p">Continuar → Escolher Plano</button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="t">Escolha seu plano</h1>
              <p className="st">Comece com 7 dias grátis, sem cartão de crédito</p>

              <div style={{ margin: "24px 0 16px" }}>
                {PLANS.map(p => (
                  <div key={p.name} onClick={() => setPlan(p.name)} className={`pc ${plan === p.name ? 'p' : ''}`}>
                    <div className="pch">
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 20 }}>{p.icon}</span>
                          <div className="pcn">{p.name}</div>
                        </div>
                        <div className="pcp">R$ {p.price}<span style={{ fontSize: 11, color: C.gL }}>/mês</span></div>
                        {p.popular && <div className="badge">Mais Popular</div>}
                      </div>
                      <div style={{ fontSize: 24 }}>{plan === p.name ? '✓' : ''}</div>
                    </div>
                    {p.feats.map((feat, i) => <div key={i} className="pcf"><span className="ck">✓</span> {feat}</div>)}
                  </div>
                ))}
              </div>

              <div style={{ padding: 12, background: C.gBg, borderRadius: 10, fontSize: 12, color: C.g, marginBottom: 16 }}>
                ✅ Primeiros 7 dias grátis · ✅ Sem cartão · ✅ Cancele quando quiser
              </div>

              <button type="button" onClick={next} className="btn btn-p">Continuar → Confirmar</button>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="t">Confirme seu cadastro</h1>
              <p className="st">Verifique os dados antes de concluir</p>

              <div className="conf">
                <div className="ch">Seus Dados</div>
                <div className="cr"><span>Nome</span><span className="cv">{f.name}</span></div>
                <div className="cr"><span>Email</span><span className="cv">{f.email}</span></div>
                <div className="cr"><span>WhatsApp</span><span className="cv">{f.wa}</span></div>
                <div className="cr"><span>Cidade</span><span className="cv">{f.city}</span></div>
                <div className="cr"><span>Categorias</span><span className="cv">{f.cats.join(", ")}</span></div>
              </div>

              <div className="conf">
                <div className="ch">Seu Plano</div>
                <div className="cr"><span style={{ fontSize: 15, fontWeight: 700 }}>{plan}</span><span className="cv">R$ {PLANS.find(p => p.name === plan).price}/mês</span></div>
                <div style={{ fontSize: 12, color: C.gL, marginTop: 8 }}>7 dias grátis - Após este período, será cobrado automaticamente</div>
              </div>

              <button type="button" onClick={submit} disabled={loading} className="btn btn-p" style={{ opacity: loading ? 0.6 : 1, cursor: loading ? "wait" : "pointer" }}>
                {loading ? "Criando conta..." : "🎉 Finalizar Cadastro"}
              </button>
              {errors.sub && <div style={{ color: C.cor, fontSize: 13, marginTop: 12, textAlign: "center" }}>{errors.sub}</div>}
            </>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
