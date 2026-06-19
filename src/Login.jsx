import { useState, useRef } from "react";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF", priGlow: "#0C8C5E22",
  acc: "#E8A817", accLt: "#FEF7E0", cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

function trackEvent(e, d) { try { if (window.fbq) window.fbq("track", e, d); } catch (x) {} }

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef(null);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const validatePassword = (p) => p.length >= 8;

  const handleLogin = async () => {
    setError("");
    if (!validateEmail(email)) { setError("Email inválido"); return; }
    if (!validatePassword(password)) { setError("Senha deve ter 8+ caracteres"); return; }

    setLoading(true);
    try {
      if (!window.SupabaseAPI) throw new Error("Supabase não carregou");

      window.SupabaseAPI.initSupabase();

      const { data: professional, error: searchError } = await window.SupabaseAPI.getUserByEmail(email);

      if (searchError || !professional) {
        throw new Error("Email ou senha incorretos");
      }

      if (professional.password !== password) {
        throw new Error("Email ou senha incorretos");
      }

      trackEvent("Login", { email });
      
      if (onLoginSuccess) {
        onLoginSuccess({
          id: professional.id,
          name: professional.name,
          email: professional.email,
          badge: professional.badge,
          avatar_initials: professional.avatar_initials
        });
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError(err.message || "Erro ao fazer login");
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 caracteres"
            style={{ width: "100%", padding: "12px 14px", border: `2px solid ${C.gB}`, borderRadius: 10, fontSize: 14, outline: "none", fontFamily: font.b }}
            disabled={loading}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          />
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

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: C.gB }}></div>
          <span style={{ fontSize: 12, color: C.gL }}>ou</span>
          <div style={{ flex: 1, height: 1, background: C.gB }}></div>
        </div>

        <div style={{ fontSize: 12, color: C.gL, textAlign: "center" }}>
          Não tem conta? Crie uma clicando no botão "Entrar" na tela inicial
        </div>
      </div>

      <div style={{ marginTop: 40, textAlign: "center", fontSize: 12, color: C.gL }}>
        <p>🔒 Seus dados estão seguros com criptografia</p>
      </div>
    </div>
  );
}
