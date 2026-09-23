import { useEffect, useState } from 'react';
import { apiFetch, ApiError } from './api';
import type { NewsListResult, NewsPost, PhotoGalleryImage, VideoGalleryItem } from './types';

export function useNewsList(page = 1) {
  const [result, setResult] = useState<NewsListResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    apiFetch<NewsListResult>(`/api/news?page=${page}`)
      .then((data) => {
        if (!cancelled) setResult(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load news');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page]);

  return { result, loading, error };
}

export function useNewsPost(slug: string | undefined) {
  const [post, setPost] = useState<NewsPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setLoading(true);
    apiFetch<NewsPost>(`/api/news/${slug}`)
      .then((data) => {
        if (!cancelled) setPost(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof ApiError ? err.message : 'Failed to load post');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return { post, loading, error };
}

export function usePhotoGallery() {
  const [images, setImages] = useState<PhotoGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<PhotoGalleryImage[]>('/api/photo-gallery')
      .then(setImages)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load photos'))
      .finally(() => setLoading(false));
  }, []);

  return { images, loading, error };
}

export function useVideoGallery() {
  const [videos, setVideos] = useState<VideoGalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<VideoGalleryItem[]>('/api/video-gallery')
      .then(setVideos)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load videos'))
      .finally(() => setLoading(false));
  }, []);

  return { videos, loading, error };
}
