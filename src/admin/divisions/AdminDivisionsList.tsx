import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { DivisionSummary } from '../../lib/types';

export default function AdminDivisionsList() {
  const navigate = useNavigate();
  const [divisions, setDivisions] = useState<DivisionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);

  function load() {
    setLoading(true);
    apiFetch<DivisionSummary[]>('/api/admin/divisions')
      .then(setDivisions)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load divisions'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    try {
      const division = await apiFetch<DivisionSummary>('/api/admin/divisions', {
        method: 'POST',
        body: JSON.stringify({ name: newName, slug: newSlug || slugify(newName) }),
      });
      setCreating(false);
      setNewName('');
      setNewSlug('');
      navigate(`/admin/divisions/${division.id}`);
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : 'Failed to create division');
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete "${name}"? This removes its products, gallery, and cannot be undone.`)) return;
    try {
      await apiFetch(`/api/admin/divisions/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete division');
    }
  }

  async function moveDivision(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= divisions.length) return;
    const reordered = [...divisions];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setDivisions(reordered);
    try {
      await apiFetch('/api/admin/divisions/reorder', {
        method: 'PATCH',
        body: JSON.stringify({ order: reordered.map((d, i) => ({ id: d.id, sortOrder: i })) }),
      });
    } catch {
      load(); // revert to server state on failure
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Divisions & Products</h1>
          <p className="text-body-text text-sm">Manage business divisions and their product catalogs.</p>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className="flex items-center gap-2 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm"
        >
          <Plus className="w-4 h-4" /> New Division
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 flex flex-wrap items-end gap-4">
          {createError && <div className="w-full text-sm text-red-600">{createError}</div>}
          <div className="flex-1 min-w-50">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (!newSlug) setNewSlug(slugify(e.target.value));
              }}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              placeholder="Zexora New Division"
            />
          </div>
          <div className="flex-1 min-w-40">
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
            <input
              value={newSlug}
              onChange={(e) => setNewSlug(slugify(e.target.value))}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
              placeholder="new-division"
            />
          </div>
          <button type="submit" className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium">
            Create
          </button>
          <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-gray-500">
            Cancel
          </button>
        </form>
      )}

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-light-gray text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 w-10"></th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {divisions.map((div, idx) => (
                <tr key={div.id} className="hover:bg-light-gray/50">
                  <td className="px-4 py-3 text-gray-300">
                    <div className="flex flex-col">
                      <button disabled={idx === 0} onClick={() => moveDivision(idx, -1)} className="disabled:opacity-20 hover:text-primary-blue">▲</button>
                      <button disabled={idx === divisions.length - 1} onClick={() => moveDivision(idx, 1)} className="disabled:opacity-20 hover:text-primary-blue">▼</button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-primary-dark">{div.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{div.slug}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${div.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {div.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/divisions/${div.id}`} className="p-2 text-gray-400 hover:text-primary-blue" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(div.id, div.name)} className="p-2 text-gray-400 hover:text-red-600" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {divisions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-gray-400">No divisions yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4 flex items-center gap-1">
        <GripVertical className="w-3 h-3" /> Use the arrows to reorder how divisions appear on the site.
      </p>
    </div>
  );
}
