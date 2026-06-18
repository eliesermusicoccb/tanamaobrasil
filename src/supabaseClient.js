import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ═════════════════════════════════════════════════════════════════
// AUTH FUNCTIONS
// ═════════════════════════════════════════════════════════════════

export async function signUp(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { user, error: null }
  } catch (error) {
    return { user: null, error }
  }
}

// ═════════════════════════════════════════════════════════════════
// PROFESSIONAL PROFILE FUNCTIONS (sem passwords!)
// ═════════════════════════════════════════════════════════════════

export async function createProfessionalProfile(userId, profileData) {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .insert([
        {
          id: userId, // use auth user id
          name: profileData.name,
          email: profileData.email,
          whatsapp: profileData.whatsapp,
          city: profileData.city,
          categories: profileData.categories,
          bio: profileData.bio,
          avatar_initials: profileData.avatar_initials,
          badge: profileData.badge,
          trial_active: profileData.trial_active,
          trial_days_left: profileData.trial_days_left,
          created_at: new Date().toISOString()
        }
      ])
      .select()
    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getProfessionalProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('id', userId)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getProfessionalByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .eq('email', email)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function updateProfessionalProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getAllProfessionals() {
  try {
    const { data, error } = await supabase
      .from('professionals')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ═════════════════════════════════════════════════════════════════
// SUBSCRIPTION FUNCTIONS
// ═════════════════════════════════════════════════════════════════

export async function createSubscription(subscriptionData) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select()
    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getUserSubscription(professionalId) {
  try {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ═════════════════════════════════════════════════════════════════
// MESSAGING FUNCTIONS
// ═════════════════════════════════════════════════════════════════

export async function sendMessage(messageData) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getMessages(chatId) {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

// ═════════════════════════════════════════════════════════════════
// REVIEW FUNCTIONS
// ═════════════════════════════════════════════════════════════════

export async function createReview(reviewData) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
    if (error) throw error
    return { data: data?.[0], error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export async function getReviews(professionalId) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('professional_id', professionalId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
