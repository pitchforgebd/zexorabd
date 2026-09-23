import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useSiteSettings } from '../../lib/useSiteSettings';

const DEFAULT_STATS = [
  { value: '2024', label: 'Established' },
  { value: '15+', label: 'Years of Experience' },
  { value: '6', label: 'Business Divisions' },
];

export default function AboutSnapshotSection() {
  const { settings } = useSiteSettings();
  const statBoxes = settings?.['home.stats']?.items || DEFAULT_STATS;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <FadeIn direction="right">
          <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">Who We Are</h3>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">Built on Experience.</h2>
          <p className="text-body-text mb-8 text-lg leading-relaxed text-justify">
            Zexora Corporation is a diversified multi-sector business group established in 2024 — built on over 15
            years of industry expertise across industrial chemicals, printing and packaging, global sourcing,
            logistics, garments, power solutions, and more. We operate through 6 specialized business divisions,
            each structured for operational excellence, quality assurance, and long-term value delivery.
          </p>
          <Link to="/about" className="inline-flex items-center font-bold text-primary-blue hover:text-accent-hover transition-colors">
            Learn More About Us <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </FadeIn>
        <FadeIn
          direction="left"
          className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end p-6 sm:p-8"
        >
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt="Corporate Excellence"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent"></div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-auto">
            {statBoxes.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white/10 backdrop-blur-md text-white p-4 sm:p-6 rounded-xl text-center border border-white/20 transform transition-transform hover:-translate-y-1"
              >
                <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm font-medium text-blue-100 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
