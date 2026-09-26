import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useDivisionsList } from '../../lib/useDivisions';
import { getIcon } from '../../lib/icons';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

function CardsVariant() {
  const { divisions } = useDivisionsList();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-x-8 lg:gap-y-14">
      {divisions.map((div, idx) => {
        const Icon = getIcon(div.icon);
        const bgImage = div.coverImage || FALLBACK_IMAGE;
        return (
          <FadeIn key={div.id} delay={idx * 0.1} className="h-full">
            <Link
              to={`/divisions/${div.slug}`}
              className="group block h-full bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary-blue/15 ring-1 ring-black/5 hover:ring-primary-blue/30 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image zone */}
              <div className="relative h-48 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                  style={{ backgroundImage: `url("${bgImage}")` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
                <span className="absolute top-4 right-5 text-5xl font-bold text-white/25 select-none">
                  {String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Floating icon badge straddling the image/content split */}
              <div className="relative px-7">
                <div className="absolute -top-8 left-7 w-16 h-16 rounded-2xl bg-white shadow-lg ring-1 ring-black/5 flex items-center justify-center text-primary-blue group-hover:bg-primary-blue group-hover:text-white group-hover:-translate-y-1 transition-all duration-300">
                  <Icon className="w-8 h-8" />
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col px-7 pt-12 pb-7">
                <h4 className="text-xl font-bold text-primary-dark mb-2 tracking-tight leading-snug">{div.name}</h4>
                <p className="text-body-text text-sm leading-relaxed mb-6">{div.tagline}</p>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                  <span className="text-primary-blue font-bold text-xs uppercase tracking-wider">Explore Division</span>
                  <span className="w-9 h-9 shrink-0 rounded-full bg-light-gray group-hover:bg-primary-blue flex items-center justify-center transition-colors duration-300">
                    <ArrowRight className="w-4 h-4 text-primary-blue group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                  </span>
                </div>
              </div>
            </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}

function CompactVariant() {
  const { divisions } = useDivisionsList();
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
      {divisions.map((div, idx) => {
        const Icon = getIcon(div.icon);
        return (
          <FadeIn key={div.id} delay={idx * 0.05}>
            <Link
              to={`/divisions/${div.slug}`}
              className="group flex flex-col items-center text-center gap-3 bg-white border border-gray-100 hover:border-primary-blue/30 hover:shadow-md rounded-2xl p-6 transition-all duration-300 h-full"
            >
              <div className="w-14 h-14 rounded-full bg-primary-blue/10 text-primary-blue flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-7 h-7" />
              </div>
              <span className="font-semibold text-primary-dark text-sm">{div.name}</span>
            </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}

export default function DivisionsGridSection({ variant }: { variant?: string }) {
  return (
    <section className="py-24 bg-light-gray relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-primary-blue" />
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px]">Our Business Divisions</h3>
            <span className="w-8 h-0.5 bg-primary-blue" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-dark tracking-tight">
            Six specialized divisions.
            <br />
            One integrated platform.
          </h2>
        </FadeIn>
        {variant === 'compact' ? <CompactVariant /> : <CardsVariant />}
      </div>
    </section>
  );
}
