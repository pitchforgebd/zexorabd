import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ImagePlus } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { NewsPost } from '../../lib/types';

export default function AdminNewsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    apiFetch<NewsPost>(`/api/admin/news/${id}`)
      .then((post) => {
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt || '');
        setBody(post.body || '');
        setIsPublished(post.isPublished);
        setCoverImage(post.coverImage);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load post'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveMessage(null);
    setError(null);
    try {
      await apiFetch(`/api/admin/news/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, slug, excerpt, body, isPublished }),
      });
      setSaveMessage('Saved.');
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save post');
    } finally {
      setSaving(false);
    }
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingCover(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const result = await apiFetch<{ coverImage: string }>(`/api/admin/news/${id}/cover-image`, { method: 'POST', body: fd });
      setCoverImage(result.coverImage);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Cover image upload failed');
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  if (loading) return <p className="text-body-text">Loading…</p>;
  if (error && !title) return <p className="text-red-600">{error}</p>;

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <button type="button" onClick={() => navigate('/admin/media/news')} className="text-sm text-body-text hover:text-primary-blue mb-1">
            ← Back to News
          </button>
          <h1 className="text-2xl font-bold text-primary-dark">{title || 'Edit Post'}</h1>
        </div>
        <div className="flex items-center gap-3">
          {saveMessage && <span className="text-sm text-green-600 font-medium">{saveMessage}</span>}
          <button type="submit" disabled={saving} className="bg-primary-blue text-white px-5 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm">{error}</div>}

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={slug} onChange={(e) => setSlug(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm font-mono" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
          <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" placeholder="Short summary shown in the news list" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
        </div>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4" />
          Published (visible on the live site)
        </label>
      </section>

      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-primary-dark mb-4">Cover Image</h2>
        <div className="flex items-center gap-4">
          {coverImage ? (
            <img src={coverImage} alt="Cover" className="w-32 h-32 object-cover rounded-xl border border-gray-100" />
          ) : (
            <div className="w-32 h-32 rounded-xl bg-light-gray border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">No image</div>
          )}
          <div>
            <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" id="news-cover-upload" />
            <label htmlFor="news-cover-upload" className="cursor-pointer inline-flex items-center gap-2 text-sm font-medium text-primary-blue hover:text-accent-hover border border-primary-blue/30 rounded-lg px-4 py-2">
              <ImagePlus className="w-4 h-4" /> {uploadingCover ? 'Uploading…' : 'Upload cover image'}
            </label>
          </div>
        </div>
      </section>
    </form>
  );
}
