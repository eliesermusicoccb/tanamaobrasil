import { useState, useEffect } from "react";

const C = {
  pri: "#0C8C5E", priDk: "#07634A", priLt: "#E6F5EF",
  cor: "#E8573A", corLt: "#FEF0ED",
  dk: "#111827", dkSoft: "#1F2937", g: "#6B7280", gL: "#9CA3AF", gB: "#E5E7EB", gBg: "#F3F4F6", w: "#FFFFFF",
};
const font = { d: "'Outfit', sans-serif", b: "'DM Sans', sans-serif" };

/**
 * Admin Panel para gerenciar banners de publicidade
 * Features:
 * - Listar banners
 * - Criar novo banner
 * - Editar banner
 * - Ativar/desativar
 * - Ver estatísticas de cliques
 */
export default function AdminBanners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [stats, setStats] = useState({});

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    cta_text: "Saiba mais",
    cta_link: "",
    cta_color: "#0C8C5E",
    background_color: "#E6F5EF",
    border_color: "#0C8C5E",
    text_color: "#111827",
    icon: "📢",
    date_start: "",
    date_end: "",
    active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      if (!window.SupabaseAPI) {
        console.error("SupabaseAPI não disponível");
        setLoading(false);
        return;
      }

      window.SupabaseAPI.initSupabase();

      const { data, error } = await window.SupabaseAPI.client
        .from("banners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBanners(data || []);

      // Busca cliques para cada banner
      if (data) {
        for (const banner of data) {
          fetchBannerStats(banner.id);
        }
      }
    } catch (err) {
      console.error("Erro ao buscar banners:", err);
      alert("Erro ao carregar banners");
    } finally {
      setLoading(false);
    }
  };

  const fetchBannerStats = async (bannerId) => {
    try {
      const { data, error } = await window.SupabaseAPI.client
        .from("banner_clicks")
        .select("id")
        .eq("banner_id", bannerId);

      if (!error && data) {
        setStats((prev) => ({ ...prev, [bannerId]: data.length }));
      }
    } catch (err) {
      console.error("Erro ao buscar stats:", err);
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.cta_link || !formData.date_start || !formData.date_end) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      window.SupabaseAPI.initSupabase();

      if (editingId) {
        // Atualizar
        const { error } = await window.SupabaseAPI.client
          .from("banners")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        alert("Banner atualizado com sucesso!");
      } else {
        // Inserir novo
        const { error } = await window.SupabaseAPI.client
          .from("banners")
          .insert([{ ...formData, created_at: new Date().toISOString() }]);

        if (error) throw error;
        alert("Banner criado com sucesso!");
      }

      resetForm();
      fetchBanners();
    } catch (err) {
      console.error("Erro ao salvar banner:", err);
      alert("Erro ao salvar banner");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Deseja remover este banner?")) return;

    try {
      window.SupabaseAPI.initSupabase();

      const { error } = await window.SupabaseAPI.client
        .from("banners")
        .delete()
        .eq("id", id);

      if (error) throw error;
      alert("Banner removido!");
      fetchBanners();
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao remover banner");
    }
  };

  const handleToggleActive = async (id, currentActive) => {
    try {
      window.SupabaseAPI.initSupabase();

      const { error } = await window.SupabaseAPI.client
        .from("banners")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      fetchBanners();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      cta_text: "Saiba mais",
      cta_link: "",
      cta_color: "#0C8C5E",
      background_color: "#E6F5EF",
      border_color: "#0C8C5E",
      text_color: "#111827",
      icon: "📢",
      date_start: "",
      date_end: "",
      active: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (banner) => {
    setFormData(banner);
    setEditingId(banner.id);
    setShowForm(true);
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20, fontFamily: font.b }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontFamily: font.d, fontSize: 28, fontWeight: 800, color: C.dk }}>
          🎪 Gerenciar Banners
        </h1>
        <button
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          style={{
            padding: "12px 24px",
            background: C.pri,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: font.d,
          }}
        >
          {showForm ? "Cancelar" : "+ Novo Banner"}
        </button>
      </div>

      {/* FORMULÁRIO */}
      {showForm && (
        <div style={{ background: C.gBg, borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontFamily: font.d, fontSize: 20, fontWeight: 700, color: C.dk, marginBottom: 16 }}>
            {editingId ? "Editar Banner" : "Novo Banner"}
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
            {/* Título */}
            <input
              type="text"
              placeholder="Título do banner *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              style={{ padding: 12, border: `2px solid ${C.gB}`, borderRadius: 8, fontSize: 14, fontFamily: font.b }}
            />

            {/* CTA Link */}
            <input
              type="url"
              placeholder="Link do CTA (URL) *"
              value={formData.cta_link}
              onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
              style={{ padding: 12, border: `2px solid ${C.gB}`, borderRadius: 8, fontSize: 14, fontFamily: font.b }}
            />

            {/* Data Início */}
            <input
              type="date"
              value={formData.date_start}
              onChange={(e) => setFormData({ ...formData, date_start: e.target.value })}
              style={{ padding: 12, border: `2px solid ${C.gB}`, borderRadius: 8, fontSize: 14, fontFamily: font.b }}
            />

            {/* Data Fim */}
            <input
              type="date"
              value={formData.date_end}
              onChange={(e) => setFormData({ ...formData, date_end: e.target.value })}
              style={{ padding: 12, border: `2px solid ${C.gB}`, borderRadius: 8, fontSize: 14, fontFamily: font.b }}
            />

            {/* CTA Text */}
            <input
              type="text"
              placeholder="Texto do botão"
              value={formData.cta_text}
              onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
              style={{ padding: 12, border: `2px solid ${C.gB}`, borderRadius: 8, fontSize: 14, fontFamily: font.b }}
            />

            {/* Ícone */}
            <input
              type="text"
              placeholder="Emoji/Ícone"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              maxLength="2"
              style={{ padding: 12, border: `2px solid ${C.gB}`, borderRadius: 8, fontSize: 14, fontFamily: font.b }}
            />

            {/* Cor CTA */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>Cor CTA:</label>
              <input
                type="color"
                value={formData.cta_color}
                onChange={(e) => setFormData({ ...formData, cta_color: e.target.value })}
                style={{ width: 40, height: 40, border: "none", borderRadius: 4, cursor: "pointer" }}
              />
            </div>

            {/* Cor Background */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label style={{ fontSize: 12, fontWeight: 600 }}>BG Color:</label>
              <input
                type="color"
                value={formData.background_color}
                onChange={(e) => setFormData({ ...formData, background_color: e.target.value })}
                style={{ width: 40, height: 40, border: "none", borderRadius: 4, cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Descrição (full width) */}
          <textarea
            placeholder="Descrição do banner"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{
              width: "100%",
              padding: 12,
              border: `2px solid ${C.gB}`,
              borderRadius: 8,
              fontSize: 14,
              fontFamily: font.b,
              marginTop: 16,
              resize: "vertical",
              minHeight: 80,
            }}
          />

          {/* Image URL */}
          <input
            type="url"
            placeholder="URL da imagem"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            style={{
              width: "100%",
              padding: 12,
              border: `2px solid ${C.gB}`,
              borderRadius: 8,
              fontSize: 14,
              fontFamily: font.b,
              marginTop: 16,
            }}
          />

          <button
            onClick={handleSave}
            style={{
              width: "100%",
              padding: 14,
              background: C.pri,
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: font.d,
              marginTop: 16,
            }}
          >
            {editingId ? "Atualizar Banner" : "Criar Banner"}
          </button>
        </div>
      )}

      {/* LISTA DE BANNERS */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, fontSize: 14, color: C.gL }}>
          Carregando...
        </div>
      ) : banners.length === 0 ? (
        <div style={{ textAlign: "center", padding: 40, fontSize: 14, color: C.gL }}>
          Nenhum banner criado ainda
        </div>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              style={{
                background: C.w,
                border: `2px solid ${C.gB}`,
                borderRadius: 12,
                padding: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{banner.icon}</span>
                  <h3 style={{ fontFamily: font.d, fontSize: 16, fontWeight: 700, color: C.dk, margin: 0 }}>
                    {banner.title}
                  </h3>
                  {banner.active ? (
                    <span style={{ background: "#dcfce7", color: "#166534", padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      ✓ Ativo
                    </span>
                  ) : (
                    <span style={{ background: C.corLt, color: C.cor, padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>
                      ✗ Inativo
                    </span>
                  )}
                </div>

                <div style={{ fontSize: 13, color: C.g, marginBottom: 8 }}>
                  {banner.description}
                </div>

                <div style={{ display: "flex", gap: 20, fontSize: 12, color: C.gL }}>
                  <span>📅 {banner.date_start} até {banner.date_end}</span>
                  <span>🔗 {banner.cta_link}</span>
                  <span style={{ fontWeight: 700 }}>👆 {stats[banner.id] || 0} cliques</span>
                </div>
              </div>

              {/* BOTÕES */}
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                <button
                  onClick={() => handleToggleActive(banner.id, banner.active)}
                  style={{
                    padding: "8px 16px",
                    background: banner.active ? C.gBg : "#dcfce7",
                    color: banner.active ? C.dk : "#166534",
                    border: `2px solid ${banner.active ? C.gB : "#86efac"}`,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: font.b,
                  }}
                >
                  {banner.active ? "Desativar" : "Ativar"}
                </button>

                <button
                  onClick={() => handleEdit(banner)}
                  style={{
                    padding: "8px 16px",
                    background: C.priLt,
                    color: C.pri,
                    border: `2px solid ${C.pri}`,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: font.b,
                  }}
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(banner.id)}
                  style={{
                    padding: "8px 16px",
                    background: C.corLt,
                    color: C.cor,
                    border: `2px solid ${C.cor}`,
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: font.b,
                  }}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
