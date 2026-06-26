import { useState, useRef } from "react";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

function trackEvent(e, d) { try { if (window.fbq) window.fbq("track", e, d); } catch (x) {} }

export default function Login({ onLoginSuccess, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const scrollRef = useRef(null);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p) => p.length >= 8;

  const handleLogin = async () => {
    setError("");
    setInfo("");
    if (!validateEmail(email)) { setError("Email inválido"); return; }
    if (!validatePassword(password)) { setError("Senha deve ter 8+ caracteres"); return; }

    setLoading(true);
    try {
      if (!window.SupabaseAPI) throw new Error("Supabase não carregou");

      window.SupabaseAPI.initSupabase();

      const { data: authData, error: signInError } = await window.SupabaseAPI.signInUser(email, password);

      if (signInError || !authData?.user) {
        throw new Error("Email ou senha incorretos");
      }

      const { data: professional } = await window.SupabaseAPI.getProfileById(authData.user.id);

      trackEvent("Login", { email });

      if (onLoginSuccess) {
        onLoginSuccess({
          ...(professional || {}),
          id: authData.user.id,
          name: professional?.name || authData.user.user_metadata?.name || authData.user.email,
          email: professional?.email || authData.user.email,
          badge: professional?.badge,
          avatar_initials: professional?.avatar_initials || (professional?.name || authData.user.email || "U").substring(0, 2).toUpperCase(),
        });
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    setError("");
    setInfo("");
    if (!validateEmail(email)) { setError("Digite seu email no campo acima para recuperar a senha."); return; }
    setLoading(true);
    try {
      if (!window.SupabaseAPI) throw new Error("Supabase não carregou");
      window.SupabaseAPI.initSupabase();
      const { error: resetError } = await window.SupabaseAPI.resetPassword(email);
      if (resetError) throw resetError;
      setInfo("Enviamos um link para o seu email. Abra-o para criar uma nova senha (verifique também a caixa de spam).");
    } catch (err) {
      console.error("Erro ao recuperar senha:", err);
      setError("Não foi possível enviar o email de recuperação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={scrollRef} style={{ maxWidth: 480, margin: "0 auto", minHeight: "100vh", background: C.w, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: '${font.b}'; background: ${C.w}; }
        input { font-family: '${font.b}'; }
      `}</style>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ fontFamily: font.d, fontSize: 40, fontWeight: 900, color: C.pri, marginBottom: 4 }}>TáNaMão</div>
        <div style={{ fontSize: 13, color: C.gL, letterSpacing: "0.1em", textTransform: "uppercase" }}>Brasil Profissional</div>
      </div>

      <div style={{ width: "100%", maxWidth: 360, background: "#fff", borderRadius: 16, border: `1.5px solid ${C.gB}`, padding: 24 }}>
        
        <h1 style={{ fontFamily: font.d, fontSize: 24, fontWeight: 800, color: C.dk, marginBottom: 8 }}>
          Bem-vindo de volta
        </h1>
        <p style={{ fontSize: 13, color: C.gL, marginBottom: 24 }}>
          Faça login para acessar sua conta
        </p>

        {error && (
          <div style={{ background: C.corLt, border: `1px solid ${C.cor}`, borderRadius: 10, padding: 12, marginBottom: 16, color: C.cor, fontSize: 12, fontWeight: 600 }}>
            {error}
          </div>
        )}

        {info && (
          <div style={{ background: C.priLt, border: `1px solid ${C.pri}`, borderRadius: 10, padding: 12, marginBottom: 16, color: C.priDk, fontSize: 12, fontWeight: 600 }}>
            {info}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{ width: "100%", padding: "12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", fontFamily: font.b }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: "block", fontWeight: 600, fontSize: 13, color: C.dk, marginBottom: 6 }}>Senha</label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 caracteres"
              style={{ width: "100%", padding: "12px 92px 12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", fontFamily: font.b }}
              disabled={loading}
              onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={loading}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: C.gBg,
                color: C.pri,
                borderRadius: 8,
                padding: "7px 10px",
                fontSize: 12,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: font.b,
              }}
            >
              {showPassword ? "Ocultar" : "Mostrar"}
            </button>
          </div>
        </div>

        <button
          onClick={handleLogin}
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
            marginBottom: 12
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          onClick={handleForgot}
          disabled={loading}
          style={{
            width: "100%",
            padding: "10px",
            background: "none",
            color: C.pri,
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            cursor: loading ? "wait" : "pointer",
            fontFamily: font.b,
            marginBottom: 12,
            textDecoration: "underline",
          }}
        >
          Esqueci minha senha
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: C.gB }}></div>
          <span style={{ fontSize: 12, color: C.gL }}>ou</span>
          <div style={{ flex: 1, height: 1, background: C.gB }}></div>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 12, color: C.gL, marginBottom: 10 }}>
            Ainda não tem cadastro?
          </p>
          <button
            type="button"
            onClick={onRegister}
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              background: C.priLt,
              color: C.priDk,
              border: `1.5px solid ${C.pri}`,
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 800,
              cursor: loading ? "wait" : "pointer",
              fontFamily: font.d,
            }}
          >
            Criar cadastro gratuito
          </button>
          <p style={{ fontSize: 11, color: C.gL, marginTop: 10, lineHeight: 1.4 }}>
            Para profissionais, empresas e lojas que querem aparecer no TáNaMão Brasil.
          </p>
        </div>
      </div>

      <div style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: C.gL }}>
        <p>🔒 Seus dados estão seguros com criptografia</p>
      </div>
    </div>
  );
}
