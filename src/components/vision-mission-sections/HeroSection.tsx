import FadeIn from '../FadeIn';
import { useVisionMissionContent } from './useVisionMissionContent';

export default function HeroSection() {
  const c = useVisionMissionContent();
  return (
    <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 text-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">{c.hero.title}</h1>
          <p className="text-xl md:text-3xl text-blue-100 font-medium tracking-wide">{c.hero.subtitle}</p>
        </FadeIn>
      </div>
    </section>
  );
}
