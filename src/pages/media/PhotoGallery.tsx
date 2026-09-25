import { usePhotoGallery } from '../../lib/useMedia';

export default function PhotoGallery() {
  const { images, loading, error } = usePhotoGallery();

  return (
    <>
      <div className="pt-32 pb-24 bg-gray-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Media Centre</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Photo Gallery</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">Visual highlights of our operations, facilities, and corporate events.</p>
          </div>

          {loading && <p className="text-center text-body-text">Loading…</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!loading && !error && images.length === 0 && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-gray-500 font-medium">No photos available yet.</p>
            </div>
          )}

          {!loading && images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((img) => (
                <div key={img.id} className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative group cursor-pointer shadow-sm hover:shadow-md transition-all">
                  <img src={img.url} alt={img.caption || 'Zexora Corporation'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-3 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
