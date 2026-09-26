import FadeIn from '../FadeIn';
import WhyChooseGrid from '../WhyChooseGrid';
import { useSiteSettings } from '../../lib/useSiteSettings';

const DEFAULT_REASONS = [
  { title: 'Reliable Global Sourcing Network', desc: 'Verified suppliers from 9+ countries worldwide' },
  { title: 'Consistent Industrial Quality', desc: 'Strict quality standards maintained at every supply stage' },
  { title: 'Competitive Commercial Support', desc: 'Transparent pricing and sustainable long-term value' },
  { title: 'Deep Technical Product Knowledge', desc: '15+ years of hands-on industry expertise' },
  { title: 'Fast & Efficient Supply Chain', desc: 'End-to-end logistics coordination and on-time delivery' },
  { title: 'Long-Term Partnership Approach', desc: 'We build relationships, not just transactions' },
  { title: 'Import & Indenting Support', desc: 'Full commercial and documentation support for imports' },
  { title: 'Multi-Sector Capability', desc: '9 divisions under one trusted corporate platform' },
];

export default function WhyChooseUsSection({ variant }: { variant?: string }) {
  const { settings } = useSiteSettings();
  const whyChooseUs = settings?.['home.whyChooseUs'];
  const reasons = whyChooseUs?.reasons || DEFAULT_REASONS;

  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-primary-dark text-white overflow-hidden">
      {/* Decorative depth - a soft glow and a faint dot grid, kept subtle so
          it reads as texture rather than competing with the cards. */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue via-primary-blue to-[#1d1d7a]" />
      <div className="absolute -top-32 -left-20 w-105 h-105 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-105 h-105 rounded-full bg-white/5 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14 lg:mb-16">
          <span className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Why Zexora
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white tracking-tight">
            {whyChooseUs?.heading || 'Why Choose Zexora Corporation?'}
          </h2>
          <p className="text-lg sm:text-xl text-blue-100/80 max-w-3xl mx-auto">
            {whyChooseUs?.subheading || 'Built on experience. Driven by performance. Trusted by industry.'}
          </p>
        </FadeIn>
        <WhyChooseGrid reasons={reasons} variant={variant === 'list' ? 'list' : 'grid'} />
      </div>
    </section>
  );
}
