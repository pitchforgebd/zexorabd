import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { NewsPost } from '../../lib/types';

function slugify(text: string) {
  return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function AdminNewsList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    apiFetch<NewsPost[]>('/api/admin/news')
      .then(setPosts)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load news'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    try {
      const post = await apiFetch<NewsPost>('/api/admin/news', {
        method: 'POST',
        body: JSON.stringify({ title: newTitle, slug: newSlug || slugify(newTitle), isPublished: false }),
      });
      setCreating(false);
      setNewTitle('');
      setNewSlug('');
      navigate(`/admin/media/news/${post.id}`);
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : 'Failed to create post');
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await apiFetch(`/api/admin/news/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete post');
    }
  }

  return (
    <div>
      <Link to="/admin/media" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Media Centre</Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">News</h1>
          <p className="text-body-text text-sm">Publish announcements and articles.</p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="flex items-center gap-2 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap items-end gap-4">
          {createError && <div className="w-full text-sm text-red-600">{createError}</div>}
          <div className="flex-1 min-w-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              value={newTitle}
              onChange={(e) => {
                setNewTitle(e.target.value);
                if (!newSlug) setNewSlug(slugify(e.target.value));
              }}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
            />
          </div>
          <div className="flex-1 min-w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input value={newSlug} onChange={(e) => setNewSlug(slugify(e.target.value))} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <button type="submit" className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium">Create</button>
          <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
        </form>
      )}

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light-gray text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-light-gray/50">
                  <td className="px-4 py-3 font-medium text-primary-dark">{post.title}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {post.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/media/news/${post.id}`} className="p-2 text-gray-400 hover:text-primary-blue" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(post.id, post.title)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-gray-400">No posts yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
