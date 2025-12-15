import { redirect } from 'next/navigation';
import { getUser, isAdmin } from '@/lib/supabase-server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin - Menucochon',
  description: 'Administration de Menucochon',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Double vérification de sécurité (en plus du middleware)
  const user = await getUser();

  if (!user) {
    redirect('/login?redirectTo=/admin');
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect('/');
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
