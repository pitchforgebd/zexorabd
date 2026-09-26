import { Globe } from 'lucide-react';
import FadeIn from '../FadeIn';
import WorldMap from '../WorldMap';
import { useGlobalSourcingContent } from './useGlobalSourcingContent';

export default function IntroMapSection() {
  const c = useGlobalSourcingContent();
  return (
    <section className="py-32 px-4 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <FadeIn direction="right">
          <span className="text-primary-blue font-bold tracking-wider uppercase text-sm mb-4 block">{c.intro.eyebrow}</span>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-6 tracking-tight leading-tight">{c.intro.heading}</h2>
          <div className="w-20 h-1.5 bg-primary-blue mb-8 rounded-full"></div>
          <p className="text-lg md:text-xl text-body-text leading-relaxed text-justify mb-10">{c.intro.description}</p>
          <div className="grid grid-cols-2 gap-8">
            <div className="border-l-4 border-primary-blue pl-5">
              <h4 className="text-4xl font-bold text-primary-dark tracking-tighter">{c.intro.stat1Value}</h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">{c.intro.stat1Label}</p>
            </div>
            <div className="border-l-4 border-primary-blue pl-5">
              <h4 className="text-4xl font-bold text-primary-dark tracking-tighter">{c.intro.stat2Value}</h4>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">{c.intro.stat2Label}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn direction="left" className="relative h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden shadow-2xl bg-white border border-gray-100 flex items-center justify-center">
          <WorldMap />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 ring-1 ring-inset ring-gray-100 rounded-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 p-10 md:p-12 w-full pointer-events-none">
            <div className="flex items-center gap-5 mb-6">
              <div className="bg-primary-blue/10 backdrop-blur-md p-3 rounded-2xl border border-primary-blue/20">
                <Globe className="w-8 h-8 text-primary-blue" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-dark tracking-tight">{c.intro.mapCalloutHeading}</h3>
            </div>
            <p className="text-body-text text-lg leading-relaxed max-w-md">{c.intro.mapCalloutText}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
