import { supabase } from './supabase';

export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
  display_name?: string;
  username?: string;
  avatar_url?: string;
  bio?: string;
  preferred_pronouns?: string;
  is_anonymous?: boolean;
  updated_at?: string;
  // Add other profile fields as needed
}

export const profilesService = {
  getCurrentProfile: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)  // WHERE id = user.id と同等
      .single();          // 1件のみを取得（配列ではなくオブジェクトを返す）

    return { data, error };
  },

  // Additional profile methods can be added here
  updateProfile: async (updates: Partial<Profile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  },

  createProfile: async (profile: Omit<Profile, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('profiles')
      .insert([{ ...profile, id: user.id }])
      .select()
      .single();

    return { data, error };
  },


}; 