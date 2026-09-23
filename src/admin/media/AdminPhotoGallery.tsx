import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ImagePlus, Trash2, EyeOff, Eye } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { PhotoGalleryImage } from '../../lib/types';

export default function AdminPhotoGallery() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<PhotoGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  function load() {
    setLoading(true);
    apiFetch<PhotoGalleryImage[]>('/api/admin/photo-gallery')
      .then(setImages)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load photos'))
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
      const updated = await apiFetch<PhotoGalleryImage[]>('/api/admin/photo-gallery/upload', { method: 'POST', body: fd });
      setImages(updated);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function togglePublished(img: PhotoGalleryImage) {
    try {
      const updated = await apiFetch<PhotoGalleryImage>(`/api/admin/photo-gallery/${img.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isPublished: !img.isPublished }),
      });
      setImages((imgs) => imgs.map((i) => (i.id === img.id ? updated : i)));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to update image');
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Delete this image?')) return;
    try {
      await apiFetch(`/api/admin/photo-gallery/${id}`, { method: 'DELETE' });
      setImages((imgs) => imgs.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete image');
    }
  }

  return (
    <div>
      <Link to="/admin/media" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Media Centre</Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Photo Gallery</h1>
          <p className="text-body-text text-sm">Images shown on the public Photo Gallery page.</p>
        </div>
        <div>
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" id="photo-upload" />
          <label htmlFor="photo-upload" className="cursor-pointer flex items-center gap-2 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm">
            <ImagePlus className="w-4 h-4" /> {uploading ? 'Uploading…' : 'Upload Images'}
          </label>
        </div>
      </div>

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && images.length === 0 && (
        <div className="flex items-center justify-center h-48 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">No images yet.</div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100 bg-white">
            <img src={img.url} alt={img.caption || ''} className={`w-full h-full object-cover ${img.isPublished ? '' : 'opacity-40'}`} />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button onClick={() => togglePublished(img)} className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-primary-blue" title={img.isPublished ? 'Hide' : 'Show'}>
                {img.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button onClick={() => handleDelete(img.id)} className="p-2 bg-white/90 rounded-full text-gray-700 hover:text-red-600" title="Delete">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            {!img.isPublished && (
              <span className="absolute top-2 left-2 bg-gray-900/80 text-white text-[10px] px-2 py-0.5 rounded-full">Hidden</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
