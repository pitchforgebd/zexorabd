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
    <section className="relative py-20 sm:py-28 bg-light-gray overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14 lg:mb-16">
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-primary-blue/15 bg-white text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-primary-blue">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
            {c.subheading}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-dark tracking-tight">{c.heading}</h2>
        </FadeIn>

        <div className="flex flex-col gap-8 lg:gap-10">
          {c.items.map((concern, idx) => {
            const excerpt = concern.description ? concern.description.split('\n\n')[0] : concern.tagline;
            const reverse = idx % 2 === 1;

            const visual = (
              <div className="relative rounded-[1.75rem] overflow-hidden bg-primary-dark aspect-[4/3] lg:aspect-square shadow-xl">
                {concern.coverImage ? (
                  <img
                    src={concern.coverImage}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div
                    className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{
                      backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                      backgroundSize: '24px 24px',
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center p-10 sm:p-14">
                  <div className="w-full max-w-[240px] rounded-2xl bg-white shadow-2xl flex items-center justify-center p-7 group-hover:-translate-y-1.5 transition-transform duration-500">
                    <img src={concern.logo} alt={concern.name} className="max-w-full max-h-16 object-contain" />
                  </div>
                </div>
              </div>
            );

            const content = (
              <div>
                <span className="inline-flex items-baseline gap-2 text-xs font-bold uppercase tracking-[2px] text-primary-blue mb-4">
                  <span className="text-primary-blue/40">{String(idx + 1).padStart(2, '0')}</span>
                  Sister Concern
                </span>
                <h3 className="text-3xl md:text-4xl font-bold text-primary-dark tracking-tight mb-3">
                  {concern.name}
                </h3>
                <p className="text-lg font-semibold text-primary-blue/90 mb-5">{concern.tagline}</p>
                <p className="text-body-text leading-relaxed mb-8 max-w-xl">{excerpt}</p>
                <span className="inline-flex items-center gap-4 text-primary-dark font-bold text-sm uppercase tracking-wide">
                  Explore Company
                  <span className="w-10 h-10 shrink-0 rounded-full border border-primary-blue/25 flex items-center justify-center group-hover:bg-primary-blue group-hover:border-primary-blue group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </span>
              </div>
            );

            return (
              <FadeIn key={idx} delay={idx * 0.1}>
                <Link
                  to={`/subsidiaries/${slugify(concern.name)}`}
                  className="group block bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 p-6 sm:p-8 lg:p-10"
                >
                  <div
                    className={`grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8 lg:gap-14 items-center ${
                      reverse ? 'lg:[&>*:first-child]:order-2' : ''
                    }`}
                  >
                    {visual}
                    {content}
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
