import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Award, Layers } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useSiteSettings } from '../../lib/useSiteSettings';

const DEFAULT_STATS = [
  { value: '2024', label: 'Established' },
  { value: '15+', label: 'Years of Experience' },
  { value: '6', label: 'Business Divisions' },
];

const STAT_ICONS = [Calendar, Award, Layers];

export default function AboutSnapshotSection() {
  const { settings } = useSiteSettings();
  const statBoxes = settings?.['home.stats']?.items || DEFAULT_STATS;

  return (
    <section className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative background accents - purely visual, sit behind the content */}
      <div className="absolute -top-24 -right-24 w-105 h-105 rounded-full bg-primary-blue/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-90 h-90 rounded-full bg-primary-blue/5 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <FadeIn direction="right">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-primary-blue shrink-0" />
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px]">Who We Are</h3>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">Built on Experience.</h2>
          <p className="text-body-text mb-8 text-lg leading-relaxed">
            Zexora Corporation is a diversified multi-sector business group established in 2024 — built on over 15
            years of industry expertise across industrial chemicals, printing and packaging, global sourcing,
            logistics, garments, power solutions, and more. We operate through 6 specialized business divisions,
            each structured for operational excellence, quality assurance, and long-term value delivery.
          </p>
          <Link
            to="/about"
            className="group inline-flex items-center gap-2 font-semibold text-primary-blue border-2 border-primary-blue/20 hover:border-primary-blue hover:bg-primary-blue hover:text-white transition-all px-6 py-3 rounded-full"
          >
            Learn More About Us
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </FadeIn>

        <FadeIn
          direction="left"
          className="relative h-full min-h-[400px] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5 flex flex-col justify-end p-6 sm:p-8"
        >
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
            alt="Corporate Excellence"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent"></div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-auto">
            {statBoxes.map((stat, idx) => {
              const Icon = STAT_ICONS[idx % STAT_ICONS.length];
              return (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md text-white p-4 sm:p-6 rounded-xl text-center border border-white/20 transition-all hover:-translate-y-1 hover:bg-white/15"
                >
                  <Icon className="w-5 h-5 mx-auto mb-2 text-blue-200" />
                  <div className="text-3xl sm:text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-medium text-blue-100 uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
