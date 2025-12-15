import GuideEditForm from '@/components/admin/GuideEditForm';

export default async function NewGuidePage() {
  // Create empty guide object for the form
  const emptyGuide = {
    id: 0,
    slug: '',
    title: '',
    excerpt: null,
    content: null,
    featured_image: null,
    pinterest_image: null,
    status: 'draft',
    author_id: null,
    reading_time: 10,
    seo_title: null,
    seo_description: null,
    published_at: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    tags: null,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nouveau guide d&apos;achat</h1>
        <p className="text-gray-500 mt-1">Créer un nouveau guide d&apos;achat</p>
      </div>

      <GuideEditForm guide={emptyGuide} isNew />
    </div>
  );
}
