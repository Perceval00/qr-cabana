import { supabase } from './supabase';

export type Profile = {
  id: string;
  role: 'student' | 'teacher';
};

export async function getProfile(
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .maybeSingle();

  if (error) {
    console.error('GET PROFILE ERROR:', error);
    return null;
  }

  return data as Profile | null;
}