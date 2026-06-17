// ══════════════════════════════════════════════════════════════
// SUPABASE CONFIG - CDN (SEM NPM)
// ══════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://awkabegjsamyeqdwcngt.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3a2FiZWdqc2FteWVxZHdjbmd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NTA2MDAsImV4cCI6MjA5NzIyNjYwMH0.TKZjFZ6lmpDbOwD_wEdo5jJdqVWywLRoR3gkaSvtO7o';

// Aguarda o Supabase estar disponível no window
let supabase = null;
function initSupabase() {
  if (window.supabase) {
    const { createClient } = window.supabase;
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return supabase;
  }
  return null;
}

// ══════════════════════════════════════════════════════════════
// PROFESSIONALS (Profissionais)
// ══════════════════════════════════════════════════════════════
async function createUser(userData) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('professionals')
    .insert([userData])
    .select();
  return { data: data?.[0], error };
}

async function getUser(id) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('professionals')
    .select('*')
    .eq('id', id)
    .single();
  return { data, error };
}

async function updateUser(id, updates) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('professionals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

async function getAllProfessionals() {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('professionals')
    .select('*')
    .order('created_at', { ascending: false });
  return { data, error };
}

// ══════════════════════════════════════════════════════════════
// MESSAGES (Chat)
// ══════════════════════════════════════════════════════════════
async function sendMessage(messageData) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('messages')
    .insert([messageData])
    .select();
  return { data: data?.[0], error };
}

async function getMessages(chatId) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('created_at', { ascending: true });
  return { data, error };
}

// ══════════════════════════════════════════════════════════════
// REVIEWS (Avaliações)
// ══════════════════════════════════════════════════════════════
async function createReview(reviewData) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('reviews')
    .insert([reviewData])
    .select();
  return { data: data?.[0], error };
}

async function getReviews(professionalId) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('reviews')
    .select('*')
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false });
  return { data, error };
}

// ══════════════════════════════════════════════════════════════
// SUBSCRIPTIONS (Planos)
// ══════════════════════════════════════════════════════════════
async function createSubscription(subData) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('subscriptions')
    .insert([subData])
    .select();
  return { data: data?.[0], error };
}

async function getUserSubscription(professionalId) {
  const sb = supabase || initSupabase();
  if (!sb) return { data: null, error: 'Supabase not loaded' };
  const { data, error } = await sb
    .from('subscriptions')
    .select('*')
    .eq('professional_id', professionalId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return { data, error };
}

// ══════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ══════════════════════════════════════════════════════════════
window.SupabaseAPI = {
  initSupabase,
  createUser,
  getUser,
  updateUser,
  getAllProfessionals,
  sendMessage,
  getMessages,
  createReview,
  getReviews,
  createSubscription,
  getUserSubscription
};
