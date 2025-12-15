import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import GuideEditForm from '@/components/admin/GuideEditForm';

interface Props {
  params: Promise<{ id: string }>;
}

async function getGuide(id: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as any;
}

export default async function GuideEditPage({ params }: Props) {
  const { id } = await params;
  const guideId = parseInt(id, 10);

  if (isNaN(guideId)) {
    notFound();
  }

  const guide = await getGuide(guideId);

  if (!guide) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Éditer le guide</h1>
        <p className="text-gray-500 mt-1">{guide.title}</p>
      </div>

      <GuideEditForm guide={guide} />
    </div>
  );
}
