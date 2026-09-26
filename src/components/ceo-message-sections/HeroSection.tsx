import FadeIn from '../FadeIn';
import { useCeoMessageContent } from './useCeoMessageContent';

export default function HeroSection() {
  const c = useCeoMessageContent();
  return (
    <section className="relative pt-40 pb-24 bg-primary-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-blue/20 to-transparent mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <h1 className="text-sm font-bold text-accent-hover tracking-[3px] uppercase mb-4">{c.hero.eyebrow}</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-10 tracking-tight">{c.hero.title}</h2>
          <blockquote className="text-2xl md:text-3xl font-medium text-gray-200 italic max-w-4xl leading-relaxed border-l-4 border-primary-blue pl-6 md:pl-8 py-2 relative">
            <span className="absolute -top-4 left-4 text-7xl text-primary-blue/20 font-serif leading-none">"</span>
            {c.hero.quote}
          </blockquote>
        </FadeIn>
      </div>
    </section>
  );
}
