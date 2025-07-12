'use server';

import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateProfile(name: string, email: string) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Update the profile in the profiles table
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: user.id,
      name,
      email,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    throw new Error('Failed to update profile');
  }

  // Revalidate the profile page to show updated data
  revalidatePath('/profile');
}