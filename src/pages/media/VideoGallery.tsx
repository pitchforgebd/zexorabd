import { Play } from 'lucide-react';
import { useVideoGallery } from '../../lib/useMedia';

function youTubeThumbnail(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
}

export default function VideoGallery() {
  const { videos, loading, error } = useVideoGallery();

  return (
    <>
      <div className="pt-32 pb-24 bg-gray-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Media Centre</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Video Gallery</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">Video presentations and overviews of our divisions.</p>
          </div>

          {loading && <p className="text-center text-body-text">Loading…</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!loading && !error && videos.length === 0 && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-gray-500 font-medium">No videos available yet.</p>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {videos.map((video) => {
                const thumb = video.thumbnail || youTubeThumbnail(video.videoUrl);
                return (
                  <a
                    key={video.id}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="aspect-video bg-gray-900 rounded-xl overflow-hidden relative group cursor-pointer shadow-md block"
                  >
                    {thumb && (
                      <img src={thumb} alt={video.title} className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary-blue/90 rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-white font-medium text-lg drop-shadow">{video.title}</h3>
                    </div>
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
