import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from './FadeIn';
import { slugify } from '../lib/slugify';
import type { SisterConcern } from '../lib/types';

// The homepage "Sister Concerns" preview card - links to that company's own
// section on the single, full /company page (there's no separate per-company
// route/page anymore) via an anchor hash.
export default function SisterConcernCard({ concern, idx, delay = 0 }: { concern: SisterConcern; idx: number; delay?: number }) {
  const excerpt = concern.description || concern.tagline;
  const reverse = idx % 2 === 1;

  return (
    <FadeIn delay={delay}>
      <Link
        to={`/company#${slugify(concern.name)}`}
        className="group block bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 p-6 sm:p-8 lg:p-10"
      >
        <div
          className={`grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-14 items-center ${
            reverse ? 'lg:[&>*:first-child]:order-2' : ''
          }`}
        >
          <div className="relative rounded-[1.75rem] overflow-hidden bg-light-gray border border-gray-100 aspect-[4/3] lg:aspect-square shadow-sm">
            {concern.coverImage ? (
              <img
                src={concern.coverImage}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
              />
            ) : (
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle, var(--color-primary-blue) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }}
              />
            )}
            {concern.coverImage && (
              <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/10 to-transparent" />
            )}
            <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-14">
              <div className="w-full max-w-[240px] rounded-2xl bg-white border border-gray-100 shadow-xl flex items-center justify-center p-7 group-hover:-translate-y-1.5 transition-transform duration-500">
                <img src={concern.logo} alt={concern.name} className="max-w-full max-h-16 object-contain" />
              </div>
            </div>
          </div>

          <div>
            <span className="inline-flex items-baseline gap-2 text-xs font-bold uppercase tracking-[2px] text-primary-blue mb-4">
              <span className="text-primary-blue/40">{String(idx + 1).padStart(2, '0')}</span>
              Sister Concern
            </span>
            <h3 className="text-3xl md:text-4xl font-bold text-primary-dark tracking-tight mb-3">{concern.name}</h3>
            <p className="text-lg font-semibold text-primary-blue/90 mb-5">{concern.tagline}</p>
            <p className="text-body-text leading-relaxed mb-8 max-w-xl">{excerpt}</p>
            <span className="inline-flex items-center gap-4 text-primary-dark font-bold text-sm uppercase tracking-wide">
              Explore Company
              <span className="w-10 h-10 shrink-0 rounded-full border border-primary-blue/25 flex items-center justify-center group-hover:bg-primary-blue group-hover:border-primary-blue group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </span>
          </div>
        </div>
      </Link>
    </FadeIn>
  );
}
