import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useSiteSettings } from '../../lib/useSiteSettings';
import { slugify } from '../../lib/slugify';
import type { SisterConcernsContent } from '../../lib/types';

const DEFAULT_CONTENT: SisterConcernsContent = {
  heading: 'Our Sister Concerns',
  subheading: 'Subsidiaries & Ecosystem',
  items: [
    {
      logo: 'https://i.ibb.co.com/7dbkZsNS/Proactive-Trade-International-Logo.png',
      coverImage: '',
      name: 'Proactive Trade International',
      tagline: 'One-Stop Printing & Packaging Solutions',
      description:
        'Founded in 2024, Proactive Trade International is a trusted printing and packaging solutions provider in Bangladesh. Stands at the forefront of technical excellence in the printing and packaging industry.\n\nWe specialize in high-performance advanced printing & packaging industries machineries & consumables. Headquartered in Dhaka, Bangladesh, We proudly serve over 100+ top-tier printing and packaging companies.',
      story: '',
      websiteUrl: 'https://proactive.com.bd/',
    },
  ],
};

export default function SisterConcernsSection() {
  const { settings } = useSiteSettings();
  const c = settings?.['home.sisterConcerns'] || DEFAULT_CONTENT;

  if (c.items.length === 0) return null;

  return (
    <section className="relative py-20 sm:py-24 bg-primary-dark overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-150 bg-primary-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14 lg:mb-16">
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            {c.subheading}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">{c.heading}</h2>
        </FadeIn>

        <div
          className={`grid gap-6 lg:gap-8 ${c.items.length === 1 ? 'max-w-sm mx-auto' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
        >
          {c.items.map((concern, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <Link
                to={`/subsidiaries/${slugify(concern.name)}`}
                className="group relative block h-96 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 hover:ring-primary-blue/50 transition-all duration-500"
              >
                {concern.coverImage ? (
                  <img
                    src={concern.coverImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-primary-blue/70 to-primary-dark" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/70 to-primary-dark/30" />

                <span className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/20 bg-white/5 text-white/60 flex items-center justify-center group-hover:bg-primary-blue group-hover:text-white group-hover:border-primary-blue group-hover:rotate-45 transition-all duration-500">
                  <ArrowUpRight className="w-5 h-5" />
                </span>

                <div className="relative h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 rounded-2xl bg-white shadow-xl flex items-center justify-center p-4 mb-6 group-hover:-translate-y-1 transition-transform duration-500">
                    <img src={concern.logo} alt={concern.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <span className="text-primary-light text-xs font-bold uppercase tracking-[2px] mb-2">
                    {concern.tagline}
                  </span>
                  <h3 className="text-2xl font-bold text-white mb-5 tracking-tight">{concern.name}</h3>
                  <span className="inline-flex items-center gap-1.5 text-white/70 group-hover:text-white text-sm font-bold uppercase tracking-wide transition-colors">
                    Explore Company
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
