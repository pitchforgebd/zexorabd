import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import FadeIn from '../FadeIn';
import { useDivisionsList } from '../../lib/useDivisions';
import { getIcon } from '../../lib/icons';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

// An interactive showcase instead of a static grid: pick a division from the
// list and its full-bleed preview crossfades in on the right (below the list
// on mobile). Scales to however many divisions the admin has configured -
// no layout assumes a fixed count.
function ShowcaseVariant() {
  const { divisions } = useDivisionsList();
  const [active, setActive] = useState(0);

  if (divisions.length === 0) return null;
  const current = divisions[Math.min(active, divisions.length - 1)];
  const CurrentIcon = getIcon(current.icon);
  const bgImage = current.coverImage || FALLBACK_IMAGE;

  return (
    <FadeIn className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100 grid lg:grid-cols-5 bg-white">
      <div className="lg:col-span-2 flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory scroll-smooth divide-x lg:divide-x-0 lg:divide-y divide-gray-100">
        {divisions.map((div, idx) => {
          const ItemIcon = getIcon(div.icon);
          const isActive = idx === active;
          return (
            <button
              key={div.id}
              type="button"
              onMouseEnter={() => setActive(idx)}
              onClick={() => setActive(idx)}
              className={`group shrink-0 w-48 lg:w-auto snap-start text-left flex items-center gap-3 lg:gap-4 px-5 lg:px-6 py-5 transition-colors duration-300 ${
                isActive ? 'bg-primary-blue text-white' : 'hover:bg-light-gray text-primary-dark'
              }`}
            >
              <span className={`text-xs font-bold tabular-nums shrink-0 ${isActive ? 'text-blue-200' : 'text-gray-300'}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              <ItemIcon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-primary-blue'}`} />
              <span className="font-semibold flex-1 leading-snug line-clamp-2">{div.name}</span>
              <ArrowRight
                className={`hidden lg:block w-4 h-4 shrink-0 transition-all duration-300 ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0'
                }`}
              />
            </button>
          );
        })}
      </div>

      <div className="lg:col-span-3 relative h-80 sm:h-100 lg:h-auto min-h-105 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${bgImage}")` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/55 to-primary-dark/10" />
            <div className="relative z-10 h-full flex flex-col justify-end p-8 lg:p-10">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center mb-6">
                <CurrentIcon className="w-7 h-7" />
              </div>
              <h4 className="text-2xl lg:text-3xl font-bold mb-3 text-white tracking-tight">{current.name}</h4>
              <p className="text-blue-100/90 mb-7 text-sm lg:text-base leading-relaxed max-w-md">{current.tagline}</p>
              <Link
                to={`/divisions/${current.slug}`}
                className="group/cta inline-flex items-center gap-2 self-start bg-white text-primary-dark px-6 py-3 rounded-full font-bold hover:bg-primary-blue hover:text-white transition-colors duration-300"
              >
                Explore Division
                <ArrowRight className="w-4 h-4 transition-transform group-hover/cta:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </FadeIn>
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
        {variant === 'compact' ? <CompactVariant /> : <ShowcaseVariant />}
      </div>
    </section>
  );
}
