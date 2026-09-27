import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Building2, BookOpen } from 'lucide-react';
import { useSiteSettings } from '../lib/useSiteSettings';
import { slugify } from '../lib/slugify';

export default function SubsidiaryDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { settings, loading } = useSiteSettings();
  const items = settings?.['home.sisterConcerns']?.items || [];
  const concern = items.find((item) => slugify(item.name) === slug);

  if (loading) {
    return <div className="pt-32 pb-24 text-center text-body-text">Loading…</div>;
  }

  if (!concern) {
    return (
      <div className="pt-32 pb-24 text-center">
        <h1 className="text-2xl font-bold text-primary-dark mb-4">Company Not Found</h1>
        <p className="text-body-text mb-6">This subsidiary page doesn't exist or may have moved.</p>
        <Link to="/" className="inline-flex items-center gap-2 text-primary-blue font-semibold">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    );
  }

  const descriptionParagraphs = concern.description ? concern.description.split('\n\n') : [];
  const storyParagraphs = concern.story ? concern.story.split('\n\n') : [];

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-24 bg-primary-dark overflow-hidden">
        {concern.coverImage ? (
          <img src={concern.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark/60 via-primary-dark/85 to-primary-dark" />
        <div
          className="absolute inset-0 opacity-[0.05] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm font-medium mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Zexora Corporation
          </Link>

          <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-white shadow-2xl flex items-center justify-center p-6 mb-8">
            <img src={concern.logo} alt={concern.name} className="max-w-full max-h-full object-contain" />
          </div>

          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-blue/20 border border-primary-blue/30 text-primary-light text-xs font-bold uppercase tracking-[2px] mb-4">
            A Zexora Corporation Sister Concern
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">{concern.name}</h1>
          <p className="text-lg text-blue-100/90 max-w-2xl mx-auto">{concern.tagline}</p>
        </div>
      </section>

      {/* About the Company */}
      {descriptionParagraphs.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-primary-blue" />
              </span>
              <h2 className="text-2xl font-bold text-primary-dark tracking-tight">About the Company</h2>
            </div>
            <div className="text-body-text space-y-4 text-base leading-relaxed">
              {descriptionParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Our Story */}
      {storyParagraphs.length > 0 && (
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-light-gray">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-xl bg-primary-blue/10 flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary-blue" />
              </span>
              <h2 className="text-2xl font-bold text-primary-dark tracking-tight">Our Story</h2>
            </div>
            <div className="text-body-text space-y-4 text-base leading-relaxed">
              {storyParagraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer CTA */}
      <section className="py-16 sm:py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Part of the Zexora Corporation Ecosystem</h2>
          <p className="text-body-text mb-8">
            {concern.name} operates as a trusted sister concern within Zexora Corporation's diversified business
            group.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {concern.websiteUrl && (
              <a
                href={concern.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-blue text-white hover:bg-accent-hover px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg"
              >
                Visit Official Website
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            )}
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-primary-blue/20 hover:border-primary-blue text-primary-blue px-8 py-3.5 rounded-full font-semibold transition-all"
            >
              Explore Zexora Corporation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
