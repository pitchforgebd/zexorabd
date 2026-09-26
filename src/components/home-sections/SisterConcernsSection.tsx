import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useSiteSettings } from '../../lib/useSiteSettings';
import type { SisterConcernsContent } from '../../lib/types';

const DEFAULT_CONTENT: SisterConcernsContent = {
  heading: 'Our Sister Concerns',
  subheading: 'Subsidiaries & Ecosystem',
  items: [
    {
      logo: 'https://i.ibb.co.com/7dbkZsNS/Proactive-Trade-International-Logo.png',
      name: 'Proactive Trade International',
      tagline: 'One-Stop Printing & Packaging Solutions',
      description:
        'Founded in 2024, Proactive Trade International is a trusted printing and packaging solutions provider in Bangladesh. Stands at the forefront of technical excellence in the printing and packaging industry.\n\nWe specialize in high-performance advanced printing & packaging industries machineries & consumables. Headquartered in Dhaka, Bangladesh, We proudly serve over 100+ top-tier printing and packaging companies.',
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

        <div className="max-w-5xl mx-auto space-y-6">
          {c.items.map((concern, idx) => (
            <FadeIn key={idx} delay={idx * 0.1}>
              <div className="group relative bg-white/3 border border-white/10 hover:border-white/20 hover:bg-white/5 rounded-3xl p-8 md:p-12 transition-all duration-500 overflow-hidden">
                <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-primary-blue/10 group-hover:bg-primary-blue/20 blur-3xl transition-colors duration-500 pointer-events-none" />

                <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16">
                  <div className="w-full md:w-1/3 flex flex-col items-center text-center">
                    <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-3xl bg-white shadow-2xl flex items-center justify-center p-6 mb-6 group-hover:-translate-y-1 transition-transform duration-500">
                      <img src={concern.logo} alt={concern.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    {concern.websiteUrl && (
                      <a
                        href={concern.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-white border-2 border-white/20 hover:border-white hover:bg-white hover:text-primary-dark px-6 py-3 rounded-full font-semibold transition-all duration-300"
                      >
                        Visit Website <ArrowRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="w-full md:w-2/3 text-center md:text-left">
                    <span className="block text-primary-light text-sm font-bold uppercase tracking-[2px] mb-3">
                      {concern.tagline}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{concern.name}</h3>
                    <div className="text-blue-100/80 space-y-4 text-[15px] md:text-base leading-relaxed">
                      {concern.description.split('\n\n').map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
