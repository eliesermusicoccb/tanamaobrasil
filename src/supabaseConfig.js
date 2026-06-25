// Aguarda Supabase CDN carregar
function waitForSupabase() {
  return new Promise((resolve) => {
    if (window.supabase) {
      resolve();
      return;
    }
    const checkInterval = setInterval(() => {
      if (window.supabase) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 5000);
  });
}

const SUPABASE_URL = 'https://awkabegjsamyeqdwcngt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3a2FiZWdqc2FteWVxZHdjbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2MDAsImV4cCI6MjA5NzIyNjYwMH0.TKZjFZ6lmpDbOwD_wEdo5jJdqVWywLRoR3gkaSvtO7o';

let supabase = null;

function initSupabase() {
  if (!supabase && window.supabase) {
    const { createClient } = window.supabase;
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}

async function createUser(userData) {
  await waitForSupabase();
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
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').select('*').eq('email', email).single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function getUser(id) {
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').select('*').eq('id', id).single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function updateUser(id, updates) {
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').update(updates).eq('id', id).select().single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function getAllProfessionals() {
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('professionals').select('*').order('created_at', { ascending: false });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

async function createSubscription(subData) {
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  try {
    const { data, error } = await sb.from('subscriptions').insert([subData]).select();
    return { data: data?.[0], error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ============================================
// NOVOS MÉTODOS: UPLOAD DE FOTOS
// ============================================

async function uploadProfilePhoto(userId, formData) {
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return null;
  
  try {
    const file = formData.get("file");
    if (!file) throw new Error("Arquivo não fornecido");

    const fileName = `${userId}/${Date.now()}-profile.jpg`;
    
    const { data, error } = await sb.storage
      .from("profiles")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Erro upload perfil:", error);
      return null;
    }

    const { data: publicUrlData } = sb.storage
      .from("profiles")
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err) {
    console.error("Erro ao fazer upload da foto de perfil:", err);
    return null;
  }
}

async function uploadCoverPhoto(userId, formData) {
  await waitForSupabase();
  const sb = supabase || initSupabase();
  if (!sb) return null;
  
  try {
    const file = formData.get("file");
    if (!file) throw new Error("Arquivo não fornecido");

    const fileName = `${userId}/${Date.now()}-cover.jpg`;
    
    const { data, error } = await sb.storage
      .from("covers")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.error("Erro upload capa:", error);
      return null;
    }

    const { data: publicUrlData } = sb.storage
      .from("covers")
      .getPublicUrl(data.path);

    return { url: publicUrlData.publicUrl };
  } catch (err) {
    console.error("Erro ao fazer upload da foto de capa:", err);
    return null;
  }
}

// ============================================
// Expõe API globalmente
// ============================================
window.SupabaseAPI = {
  initSupabase,
  createUser,
  getUserByEmail,
  getUser,
  updateUser,
  getAllProfessionals,
  createSubscription,
  waitForSupabase,
  uploadProfilePhoto,
  uploadCoverPhoto,
  client: supabase,
  signUpUser: async (email, password, userData) => {
    await waitForSupabase();
    const sb = supabase || initSupabase();
    if (!sb) return { data: null, error: 'Supabase not loaded' };
    try {
      const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      });
      return { data, error };
    } catch (err) {
      return { data: null, error: err };
    }
  },
  updateProfile: updateUser,
};
