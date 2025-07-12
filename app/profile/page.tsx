import React from 'react';
import { User, Trophy, Clock, Target, BarChart, LogOut } from 'lucide-react';
import { Card } from '@/components/UI/Card';
import { Button } from '@/components/UI/Button';
import { Badge } from '@/components/UI/Badge';
import { logout } from '@/app/login/actions';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProfileClient } from './ProfileClient';

export default async function Profile() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/login');
  }

  // Fetch profile data from the profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('name, email')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('Error fetching profile:', profileError);
  }

  // Use profile data or fallback to user data
  const userData = {
    name: profile?.name || user.user_metadata?.name || 'User',
    email: profile?.email || user.email || 'No email',
    joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    }),
    totalScore: 1850, // Keep placeholder for now
    completedSimulations: 5, // Keep placeholder for now
    totalTimeSpent: 245, // Keep placeholder for now
    averageScore: 85, // Keep placeholder for now
    recentActivity: [
      { simulation: 'Data Analyst', score: 92, date: '2024-03-15' },
      { simulation: 'Frontend Engineer', score: 88, date: '2024-03-12' },
      { simulation: 'Product Manager', score: 85, date: '2024-03-10' },
    ],
    skills: ['SQL', 'Data Analysis', 'React', 'Problem Solving'],
  };

  return <ProfileClient userData={userData} />;
}