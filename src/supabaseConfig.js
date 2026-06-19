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

// Expõe API globalmente
window.SupabaseAPI = {
  initSupabase,
  createUser,
  getUserByEmail,
  getUser,
  updateUser,
  getAllProfessionals,
  createSubscription,
  waitForSupabase
};
