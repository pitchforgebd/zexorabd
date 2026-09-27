import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';
import SisterConcernCard from '../SisterConcernCard';
import { useSiteSettings } from '../../lib/useSiteSettings';
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
          {c.items.map((concern, idx) => (
            <SisterConcernCard key={idx} concern={concern} idx={idx} delay={idx * 0.1} />
          ))}
        </div>

        {c.items.length > 0 && (
          <FadeIn delay={0.2} className="text-center mt-12 lg:mt-14">
            <Link
              to="/company"
              className="inline-flex items-center gap-2 text-primary-blue font-bold text-sm uppercase tracking-wide hover:text-accent-hover transition-colors"
            >
              View Full Company Page
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        )}
      </div>
    </section>
  );
}
