import { useState, useEffect } from "react";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF",
  acc: "#E8A817", accLt: "#FEF7E0",
  cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

/**
 * PaymentModal - Modal para processar pagamentos
 * Suporta: Checkout Stripe (cartão), PIX (Mercado Pago)
 */
export default function PaymentModal({
  planName,
  amount,
  description,
  professionalData,
  onSuccess,
  onCancel,
  onClose
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("card"); // card ou pix
  const [pixData, setPixData] = useState(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Inicializar Stripe na montagem
  useEffect(() => {
    if (window.PaymentManager) {
      window.PaymentManager.initializeStripe(
        process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_live_seu_public_key"
      );
    }
  }, []);

  /**
   * Processa pagamento com cartão via Stripe
   */
  const handleCardPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.PaymentManager) {
        throw new Error("Sistema de pagamento não inicializado");
      }

      // Criar sessão de checkout
      const sessionId = await window.PaymentManager.createCheckoutSession(
        planName,
        professionalData
      );

      // Redirecionar para Stripe Checkout
      await window.PaymentManager.redirectToCheckout(sessionId);
    } catch (err) {
      console.error("Erro ao processar pagamento:", err);
      setError(err.message || "Erro ao processar pagamento. Tente novamente.");
      setLoading(false);
    }
  };

  /**
   * Gera QR Code PIX
   */
  const handlePixPayment = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!window.PaymentManager) {
        throw new Error("Sistema de pagamento não inicializado");
      }

      const { qrCode, qrCodeUrl, orderId } = await window.PaymentManager.generatePixQrCode(
        amount,
        description,
        `${professionalData.id}-${Date.now()}`
      );

      setPixData({ qrCode, qrCodeUrl, orderId });
      setLoading(false);
    } catch (err) {
      console.error("Erro ao gerar PIX:", err);
      setError("Erro ao gerar QR Code PIX. Tente novamente.");
      setLoading(false);
    }
  };

  /**
   * Copia chave PIX para clipboard
   */
  const copyPixKey = () => {
    navigator.clipboard.writeText(pixData.qrCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  /**
   * Confirma pagamento PIX
   */
  const confirmPixPayment = async () => {
    setLoading(true);

    try {
      // Aguardar confirmação do pagamento (polling)
      const maxAttempts = 30; // 5 minutos
      let attempts = 0;

      const checkPayment = async () => {
        attempts++;
        const status = await window.PaymentManager.getPaymentStatus(pixData.orderId);

        if (status.status === "approved") {
          if (onSuccess) onSuccess({ orderId: pixData.orderId, method: "pix" });
          onClose();
          return true;
        }

        if (attempts >= maxAttempts) {
          throw new Error("Timeout ao aguardar confirmação do PIX");
        }

        // Tentar novamente após 10 segundos
        await new Promise(r => setTimeout(r, 10000));
        return checkPayment();
      };

      await checkPayment();
    } catch (err) {
      console.error("Erro ao confirmar PIX:", err);
      setError(err.message || "Erro ao confirmar pagamento");
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,.6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      padding: 16
    }}>
      <div style={{
        background: C.w,
        borderRadius: 16,
        padding: 20,
        maxWidth: 400,
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        {/* Cabeçalho */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: `1px solid ${C.gB}`
        }}>
          <h2 style={{ fontFamily: font.d, fontSize: 18, fontWeight: 800, color: C.dk }}>
            Finalizar Pagamento
          </h2>
          <button
            onClick={onCancel}
            style={{
              background: "none",
              border: "none",
              fontSize: 24,
              cursor: "pointer",
              color: C.gL
            }}
          >
            ×
          </button>
        </div>

        {/* Resumo */}
        <div style={{
          background: C.gBg,
          borderRadius: 12,
          padding: 12,
          marginBottom: 20
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 8,
            fontSize: 13
          }}>
            <span style={{ color: C.g }}>Plano:</span>
            <span style={{ fontWeight: 700, color: C.dk }}>{planName}</span>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 14,
            fontWeight: 700
          }}>
            <span style={{ color: C.g }}>Valor:</span>
            <span style={{ color: C.pri }}>
              {window.PaymentManager?.formatPrice(amount) || `R$ ${amount.toFixed(2)}`}
            </span>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div style={{
            background: C.corLt,
            border: `2px solid ${C.cor}`,
            borderRadius: 10,
            padding: 12,
            marginBottom: 16,
            color: C.cor,
            fontSize: 12,
            fontWeight: 600
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* PIX QR Code */}
        {pixData && (
          <div style={{
            background: C.priLt,
            borderRadius: 12,
            padding: 20,
            marginBottom: 16,
            textAlign: "center"
          }}>
            <div style={{
              fontSize: 12,
              color: C.pri,
              marginBottom: 12,
              fontWeight: 600
            }}>
              Escaneie o QR Code ou copie a chave PIX
            </div>

            {/* QR Code */}
            <div style={{
              background: C.w,
              borderRadius: 10,
              padding: 12,
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200
            }}>
              {pixData.qrCodeUrl ? (
                <img
                  src={pixData.qrCodeUrl}
                  alt="PIX QR Code"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <div style={{ color: C.gL, fontSize: 12 }}>Gerando QR Code...</div>
              )}
            </div>

            {/* Chave PIX */}
            <div style={{
              background: C.w,
              border: `2px solid ${C.pri}`,
              borderRadius: 8,
              padding: 10,
              marginBottom: 12,
              wordBreak: "break-all",
              fontSize: 11,
              color: C.dk,
              fontFamily: "monospace",
              fontWeight: 600,
              cursor: "pointer",
              position: "relative"
            }} onClick={copyPixKey}>
              {pixData.qrCode}
              {copiedPix && (
                <div style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: C.pri,
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 10,
                  fontWeight: 700,
                  fontFamily: font.b
                }}>
                  ✓ Copiado!
                </div>
              )}
            </div>

            <div style={{
              fontSize: 11,
              color: C.pri,
              marginBottom: 12
            }}>
              Clique para copiar a chave
            </div>

            <button
              onClick={confirmPixPayment}
              disabled={loading}
              style={{
                width: "100%",
                padding: 12,
                background: C.pri,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 700,
                cursor: loading ? "wait" : "pointer",
                fontFamily: font.d,
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? "Aguardando confirmação..." : "Confirmar Pagamento PIX"}
            </button>
          </div>
        )}

        {/* Seleção de método (se não tem PIX data) */}
        {!pixData && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 12,
                border: `2px solid ${paymentMethod === "card" ? C.pri : C.gB}`,
                borderRadius: 10,
                cursor: "pointer",
                background: paymentMethod === "card" ? C.priLt : "#fff",
                marginBottom: 10
              }} onClick={() => setPaymentMethod("card")}>
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  style={{ cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.dk }}>💳 Cartão de Crédito</div>
                  <div style={{ fontSize: 11, color: C.gL }}>Visa, Mastercard, Elo</div>
                </div>
              </label>

              <label style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: 12,
                border: `2px solid ${paymentMethod === "pix" ? C.pri : C.gB}`,
                borderRadius: 10,
                cursor: "pointer",
                background: paymentMethod === "pix" ? C.priLt : "#fff"
              }} onClick={() => setPaymentMethod("pix")}>
                <input
                  type="radio"
                  name="payment"
                  value="pix"
                  checked={paymentMethod === "pix"}
                  onChange={() => setPaymentMethod("pix")}
                  style={{ cursor: "pointer" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: C.dk }}>🔐 PIX</div>
                  <div style={{ fontSize: 11, color: C.gL }}>Instantâneo e seguro</div>
                </div>
              </label>
            </div>

            {/* Botões */}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={onCancel}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 12,
                  background: C.gBg,
                  color: C.dk,
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: font.d
                }}
              >
                Cancelar
              </button>

              <button
                onClick={paymentMethod === "card" ? handleCardPayment : handlePixPayment}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: 12,
                  background: paymentMethod === "card" ? C.pri : C.acc,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: loading ? "wait" : "pointer",
                  fontFamily: font.d,
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? "Processando..." : "Continuar"}
              </button>
            </div>
          </>
        )}

        {/* Info Segurança */}
        <div style={{
          marginTop: 16,
          padding: 10,
          background: C.gBg,
          borderRadius: 8,
          fontSize: 10,
          color: C.gL,
          textAlign: "center"
        }}>
          🔒 Sua transação é protegida e criptografada
        </div>
      </div>
    </div>
  );
}
