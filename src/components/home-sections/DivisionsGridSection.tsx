import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useDivisionsList } from '../../lib/useDivisions';
import { getIcon } from '../../lib/icons';

function CardsVariant() {
  const { divisions } = useDivisionsList();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {divisions.map((div, idx) => {
        const Icon = getIcon(div.icon);
        const bgImage =
          div.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80';
        return (
          <FadeIn key={div.id} delay={idx * 0.1}>
            <Link
              to={`/divisions/${div.slug}`}
              className="group block h-[420px] rounded-2xl overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url("${bgImage}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/60 to-transparent flex flex-col justify-end p-8">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-blue group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-bold mb-3 text-white tracking-tight">{div.name}</h4>
                <p className="text-blue-100/90 mb-6 text-sm leading-relaxed max-w-xs">{div.tagline}</p>
                <div className="flex items-center text-primary-light font-bold tracking-wide text-sm uppercase">
                  Explore Division <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-3 transition-transform" />
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
