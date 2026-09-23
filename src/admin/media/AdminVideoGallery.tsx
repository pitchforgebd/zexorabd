import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ImagePlus, X } from 'lucide-react';
import { apiFetch, ApiError } from '../../lib/api';
import type { VideoGalleryItem } from '../../lib/types';

type Draft = { title: string; videoUrl: string; isPublished: boolean };

export default function AdminVideoGallery() {
  const [videos, setVideos] = useState<VideoGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [newDraft, setNewDraft] = useState<Draft>({ title: '', videoUrl: '', isPublished: true });
  const [createError, setCreateError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>({ title: '', videoUrl: '', isPublished: true });
  const [formError, setFormError] = useState<string | null>(null);
  const [uploadingThumbFor, setUploadingThumbFor] = useState<number | null>(null);

  function load() {
    setLoading(true);
    apiFetch<VideoGalleryItem[]>('/api/admin/video-gallery')
      .then(setVideos)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load videos'))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError(null);
    try {
      await apiFetch('/api/admin/video-gallery', { method: 'POST', body: JSON.stringify(newDraft) });
      setCreating(false);
      setNewDraft({ title: '', videoUrl: '', isPublished: true });
      load();
    } catch (err) {
      setCreateError(err instanceof ApiError ? err.message : 'Failed to add video');
    }
  }

  function startEdit(video: VideoGalleryItem) {
    setEditingId(video.id);
    setEditDraft({ title: video.title, videoUrl: video.videoUrl, isPublished: video.isPublished });
    setFormError(null);
  }

  async function handleSaveEdit(id: number) {
    setFormError(null);
    try {
      await apiFetch(`/api/admin/video-gallery/${id}`, { method: 'PUT', body: JSON.stringify(editDraft) });
      setEditingId(null);
      load();
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : 'Failed to save video');
    }
  }

  async function handleDelete(id: number, title: string) {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await apiFetch(`/api/admin/video-gallery/${id}`, { method: 'DELETE' });
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete video');
    }
  }

  async function handleThumbnailUpload(id: number, file: File) {
    setUploadingThumbFor(id);
    try {
      const fd = new FormData();
      fd.append('image', file);
      await apiFetch(`/api/admin/video-gallery/${id}/thumbnail`, { method: 'POST', body: fd });
      load();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Thumbnail upload failed');
    } finally {
      setUploadingThumbFor(null);
    }
  }

  return (
    <div>
      <Link to="/admin/media" className="text-sm text-body-text hover:text-primary-blue mb-2 inline-block">← Media Centre</Link>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary-dark">Video Gallery</h1>
          <p className="text-body-text text-sm">Featured video links shown on the public Video Gallery page.</p>
        </div>
        <button onClick={() => setCreating((v) => !v)} className="flex items-center gap-2 bg-primary-blue text-white px-4 py-2.5 rounded-xl font-medium hover:bg-accent-hover transition-colors text-sm">
          <Plus className="w-4 h-4" /> New Video
        </button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 space-y-4">
          {createError && <div className="text-sm text-red-600">{createError}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input value={newDraft.title} onChange={(e) => setNewDraft((d) => ({ ...d, title: e.target.value }))} required className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Video URL (YouTube/Vimeo)</label>
            <input value={newDraft.videoUrl} onChange={(e) => setNewDraft((d) => ({ ...d, videoUrl: e.target.value }))} required placeholder="https://www.youtube.com/watch?v=..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={newDraft.isPublished} onChange={(e) => setNewDraft((d) => ({ ...d, isPublished: e.target.checked }))} className="w-4 h-4" />
            Published
          </label>
          <div className="flex gap-3">
            <button type="submit" className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium">Add Video</button>
            <button type="button" onClick={() => setCreating(false)} className="px-4 py-2 text-sm text-gray-500">Cancel</button>
          </div>
        </form>
      )}

      {loading && <p className="text-body-text">Loading…</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="space-y-3">
          {videos.map((video) => (
            <div key={video.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              {editingId === video.id ? (
                <div className="space-y-3">
                  {formError && <div className="text-sm text-red-600">{formError}</div>}
                  <input value={editDraft.title} onChange={(e) => setEditDraft((d) => ({ ...d, title: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Title" />
                  <input value={editDraft.videoUrl} onChange={(e) => setEditDraft((d) => ({ ...d, videoUrl: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm" placeholder="Video URL" />
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={editDraft.isPublished} onChange={(e) => setEditDraft((d) => ({ ...d, isPublished: e.target.checked }))} className="w-4 h-4" />
                    Published
                  </label>
                  <div className="flex gap-3">
                    <button onClick={() => handleSaveEdit(video.id)} className="bg-primary-blue text-white px-4 py-2 rounded-lg text-sm font-medium">Save</button>
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-sm text-gray-500 flex items-center gap-1"><X className="w-3.5 h-3.5" /> Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="w-24 h-16 rounded-lg overflow-hidden bg-light-gray shrink-0 flex items-center justify-center">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-xs">No thumb</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary-dark truncate">{video.title}</p>
                    <p className="text-xs text-gray-400 truncate">{video.videoUrl}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${video.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {video.isPublished ? 'Published' : 'Hidden'}
                  </span>
                  <label className="cursor-pointer p-2 text-gray-400 hover:text-primary-blue shrink-0" title="Upload thumbnail">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleThumbnailUpload(video.id, e.target.files[0])}
                    />
                    <ImagePlus className="w-4 h-4" />
                  </label>
                  {uploadingThumbFor === video.id && <span className="text-xs text-gray-400">Uploading…</span>}
                  <button onClick={() => startEdit(video)} className="p-2 text-gray-400 hover:text-primary-blue shrink-0" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(video.id, video.title)} className="p-2 text-gray-400 hover:text-red-600 shrink-0" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {videos.length === 0 && <div className="flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-xl bg-white text-gray-400">No videos yet.</div>}
        </div>
      )}
    </div>
  );
}
