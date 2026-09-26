import { Link } from 'react-router-dom';
import { ArrowRight, Globe } from 'lucide-react';
import FadeIn from '../FadeIn';
import WorldMap from '../WorldMap';

const countries = ['🇨🇳 China', '🇮🇳 India', '🇩🇪 Germany', '🇰🇷 South Korea', '🇸🇬 Singapore', '🇲🇾 Malaysia', '🇯🇵 Japan', '🇹🇷 Turkey', '🇹🇼 Taiwan'];

export default function GlobalSourcingSection() {
  return (
    <section className="py-24 bg-[#0A0D14] overflow-hidden relative">
      <div className="absolute top-0 right-0 w-200 h-200 bg-primary-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <span className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full border border-white/15 bg-white/5 text-[11px] sm:text-xs font-semibold uppercase tracking-[2.5px] text-primary-light">
              <Globe className="w-3.5 h-3.5" /> Global Presence
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Our Global Sourcing Network</h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              We source premium industrial products, chemicals, and materials from internationally recognized
              manufacturers across 9+ countries — ensuring world-class quality at competitive prices for
              Bangladesh's growing industries.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {countries.map((country) => (
                <span
                  key={country}
                  className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-sm font-medium shadow-sm flex items-center gap-2 text-gray-300 hover:bg-white/10 hover:text-white transition-colors cursor-default"
                >
                  {country}
                </span>
              ))}
            </div>
            <Link
              to="/global-sourcing"
              className="inline-flex items-center font-bold text-primary-light hover:text-white transition-colors bg-white/5 border border-white/10 px-6 py-3 rounded-full hover:bg-primary-blue hover:border-primary-blue"
            >
              View Our Sourcing Network <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </FadeIn>
          <FadeIn direction="left" className="relative rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                </span>
                Live Sourcing Network
              </span>
              <span className="text-xs text-gray-500 font-medium">9 Countries</span>
            </div>
            <div className="relative h-96 md:h-125 w-full flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,43,155,0.15),transparent_70%)]"></div>
              <WorldMap />
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
