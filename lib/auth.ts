'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabaseClient.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      (event: string, session: any) => {
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (event === 'SIGNED_IN') {
          router.push('/dashboard');
        }
        if (event === 'SIGNED_OUT') {
          router.push('/');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [router]);

  const signOut = async () => {
    await supabaseClient.auth.signOut();
  };

  return {
    user,
    loading,
    signOut,
  };
}
