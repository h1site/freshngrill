import { redirect } from 'next/navigation';
import { getUser, isAdmin } from '@/lib/supabase-server';
import AdminSidebar from '@/components/admin/AdminSidebar';

export const metadata = {
  title: "Admin - Fresh N' Grill",
  description: "Fresh N' Grill Administration",
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
  const user = await getUser();
  if (!user) {
    redirect('/login');
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
