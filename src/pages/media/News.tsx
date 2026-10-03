import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useNewsList } from '../../lib/useMedia';

export default function News() {
  const [page, setPage] = useState(1);
  const { result, loading, error } = useNewsList(page);

  const totalPages = result ? Math.max(1, Math.ceil(result.total / result.limit)) : 1;

  return (
    <>
      <div className="pt-32 pb-24 bg-gray-50 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-sm font-semibold text-primary-blue tracking-wider uppercase mb-3">Media Centre</h1>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">News & Announcements</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto text-center">Latest updates from around the Zexora corporate group.</p>
          </div>

          {loading && <p className="text-center text-body-text">Loading…</p>}
          {error && <p className="text-center text-red-600">{error}</p>}

          {!loading && !error && result && result.items.length === 0 && (
            <div className="flex items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-xl bg-white">
              <p className="text-gray-500 font-medium">No recent news available.</p>
            </div>
          )}

          {!loading && result && result.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {result.items.map((post) => (
                  <Link
                    key={post.id}
                    to={`/media-centre/news/${post.slug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
                  >
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      {post.coverImage ? (
                        <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
                      )}
                    </div>
                    <div className="p-6">
                      {post.publishedAt && (
                        <div className="flex items-center text-xs text-gray-400 mb-2">
                          <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                          {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </div>
                      )}
                      <h3 className="text-lg font-bold text-primary-dark mb-2 group-hover:text-primary-blue transition-colors">{post.title}</h3>
                      {post.excerpt && <p className="text-sm text-body-text line-clamp-3">{post.excerpt}</p>}
                    </div>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-primary-blue"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-body-text">Page {page} of {totalPages}</span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-primary-blue"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
