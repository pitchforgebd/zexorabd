import SisterConcernCard from '../components/SisterConcernCard';
import FadeIn from '../components/FadeIn';
import { useSiteSettings } from '../lib/useSiteSettings';
import type { SisterConcernsContent } from '../lib/types';

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

export default function Company() {
  const { settings } = useSiteSettings();
  const c = settings?.['home.sisterConcerns'] || DEFAULT_CONTENT;

  return (
    <div className="bg-light-gray">
      <section className="relative pt-40 pb-20 bg-primary-dark overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-blue/20 to-transparent mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn>
            <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              {c.subheading}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">Company</h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">
              Zexora Corporation operates as a diversified group, extending beyond its own divisions to a growing
              ecosystem of trusted sister concerns.
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {c.items.length === 0 ? (
            <p className="text-center text-body-text">No sister concerns to show yet.</p>
          ) : (
            <div className="flex flex-col gap-8 lg:gap-10">
              {c.items.map((concern, idx) => (
                <SisterConcernCard key={idx} concern={concern} idx={idx} delay={idx * 0.1} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
