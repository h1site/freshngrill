'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase-browser';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
    >
      <LogOut className="w-4 h-4" />
      Déconnexion
    </button>
  );
}
