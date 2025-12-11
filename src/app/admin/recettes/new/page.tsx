import { redirect } from 'next/navigation';

export default function NewRecipePage() {
  // Rediriger vers la page d'import qui sert de formulaire
  redirect('/admin/import');
}
