import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Award, Layers } from 'lucide-react';
import { animate, useInView } from 'motion/react';
import FadeIn from '../FadeIn';
import { useSiteSettings } from '../../lib/useSiteSettings';

const DEFAULT_STATS = [
  { value: '2024', label: 'Established' },
  { value: '15+', label: 'Years of Experience' },
  { value: '6', label: 'Business Divisions' },
];

const STAT_ICONS = [Calendar, Award, Layers];

// Animates a stat's leading digits counting up from 0 once it scrolls into
// view (e.g. "15+" counts 0 -> 15 then keeps the "+"; non-numeric values
// like a plain word just render as-is, no animation attempted).
function CountUpStat({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const match = value.match(/^(\d+)(.*)$/);
  const [display, setDisplay] = useState(match ? '0' + match[2] : value);

  useEffect(() => {
    if (!isInView || !match) return;
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const controls = animate(0, target, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v) + suffix),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView]);

  return <span ref={ref}>{display}</span>;
}

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

        <div>
          {/* Layered photo collage - two offset images instead of one flat panel */}
          <FadeIn direction="left" className="relative h-80 sm:h-96">
            <div className="absolute top-0 right-0 w-2/3 h-2/3 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white hidden sm:block">
              <img
                src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=800&q=80"
                alt="Zexora team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 left-0 w-full h-full sm:w-3/4 sm:h-4/5 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=80"
                alt="Corporate Excellence"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/50 to-transparent" />
            </div>
            <span className="absolute -bottom-4 left-4 sm:left-8 bg-white shadow-lg rounded-full px-4 py-2 text-xs font-bold text-primary-dark tracking-wide">
              Since 2024
            </span>
          </FadeIn>

          {/* Stats row - own card row beneath the collage, with count-up numbers */}
          <FadeIn direction="left" delay={0.15} className="grid grid-cols-3 gap-3 sm:gap-4 mt-10 sm:mt-8">
            {statBoxes.map((stat, idx) => {
              const Icon = STAT_ICONS[idx % STAT_ICONS.length];
              return (
                <div
                  key={idx}
                  className="bg-white p-4 sm:p-5 rounded-2xl text-center shadow-md ring-1 ring-black/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                >
                  <Icon className="w-5 h-5 mx-auto mb-2 text-primary-blue" />
                  <div className="text-2xl sm:text-3xl font-bold text-primary-dark mb-1">
                    <CountUpStat value={stat.value} />
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-body-text uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
