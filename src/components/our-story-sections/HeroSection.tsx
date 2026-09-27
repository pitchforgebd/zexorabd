import FadeIn from '../FadeIn';
import { useOurStoryContent } from './useOurStoryContent';

export default function HeroSection() {
  const c = useOurStoryContent();
  return (
    <section className="relative pt-40 pb-24 bg-primary-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03]"></div>
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-blue/20 to-transparent mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn>
          <h1 className="text-sm font-bold text-accent-hover tracking-[3px] uppercase mb-4">{c.hero.eyebrow}</h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">{c.hero.title}</h2>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed">{c.hero.subtitle}</p>
        </FadeIn>
      </div>
    </section>
  );
}
