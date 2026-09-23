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
    <section className="py-24 bg-primary-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            {whyChooseUs?.heading || 'Why Choose Zexora Corporation?'}
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            {whyChooseUs?.subheading || 'Built on experience. Driven by performance. Trusted by industry.'}
          </p>
        </FadeIn>
        <WhyChooseGrid reasons={reasons} variant={variant === 'list' ? 'list' : 'grid'} />
      </div>
    </section>
  );
}
