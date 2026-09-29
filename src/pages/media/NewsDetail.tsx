import { useParams, Link } from 'react-router-dom';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import Breadcrumbs from '../../components/Breadcrumbs';
import { useNewsPost } from '../../lib/useMedia';

export default function NewsDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { post, loading, error } = useNewsPost(slug);

  if (loading) {
    return <div className="pt-32 pb-24 min-h-[70vh] text-center text-body-text">Loading…</div>;
  }
  if (error || !post) {
    return (
      <div className="pt-32 pb-24 min-h-[70vh] text-center">
        <p className="text-body-text mb-4">{error || 'This news post could not be found.'}</p>
        <Link to="/media-centre/news" className="text-primary-blue font-medium">← Back to News</Link>
      </div>
    );
  }

  return (
    <>
      <div className="pt-32 pb-24 bg-white min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs />
          <Link to="/media-centre/news" className="inline-flex items-center text-sm text-primary-blue font-medium mb-8 hover:text-accent-hover">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to News
          </Link>

          {post.publishedAt && (
            <div className="flex items-center text-sm text-gray-400 mb-3">
              <CalendarDays className="w-4 h-4 mr-1.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 tracking-tight">{post.title}</h1>

          {post.coverImage && (
            <div className="aspect-video rounded-2xl overflow-hidden mb-10 bg-gray-100">
              <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="prose max-w-none text-body-text leading-relaxed whitespace-pre-line">
            {post.body}
          </div>
        </div>
      </div>
    </>
  );
}
