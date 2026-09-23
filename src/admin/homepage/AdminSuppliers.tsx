import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Trash2, EyeOff, Eye } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { Supplier } from '../../lib/types';

export default function AdminSuppliers() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    apiFetch<Supplier[]>('/api/admin/suppliers')
      .then(setSuppliers)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load suppliers'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      const updated = await apiFetch<Supplier[]>('/api/admin/suppliers/upload', { method: 'POST', body: fd });
      setSuppliers(updated);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function toggleActive(supplier: Supplier) {
    try {
      const updated = await apiFetch<Supplier>(`/api/admin/suppliers/${supplier.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: !supplier.isActive }),
      });
      setSuppliers((list) => list.map((s) => (s.id === supplier.id ? updated : s)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to update supplier');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this supplier logo?')) return;
    try {
      await apiFetch(`/api/admin/suppliers/${id}`, { method: 'DELETE' });
      setSuppliers((list) => list.filter((s) => s.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete supplier');
    }
  }

  return (
    <div>
      <Link to="/admin/homepage" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Homepage & Suppliers</Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Supplier Logos</h1>
          <p className="text-body-text text-sm">Logos shown in the homepage supplier carousel.</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" id="supplier-upload" />
          <label htmlFor="supplier-upload" className="cursor-pointer flex items-center gap-2 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm">
            <ImagePlus className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload Logos'}
          </label>
        </div>
      </div>

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && suppliers.length === 0 && (
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">No supplier logos yet.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {suppliers.map((supplier) => (
          <div key={supplier.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-white p-3">
            <img src={supplier.url} alt={supplier.altText || ''} className={`w-full h-full object-contain ${supplier.isActive ? '' : 'opacity-40'}`} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => toggleActive(supplier)} className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-primary-blue" title={supplier.isActive ? 'Hide' : 'Show'}>
                {supplier.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => handleDelete(supplier.id)} className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-red-600" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {!supplier.isActive && (
              <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] px-2 py-0.5 rounded-full">Hidden</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
