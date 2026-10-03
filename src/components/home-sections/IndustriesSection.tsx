import { Package, Printer, Shirt, Pill, Layers, PaintRoller, Droplet, Factory, ShoppingBag } from 'lucide-react';
import FadeIn from '../FadeIn';

const industries = [
  { name: 'Printing Industry', icon: Printer },
  { name: 'Packaging Industry', icon: Package },
  { name: 'Textile & Garments', icon: Shirt },
  { name: 'Pharmaceutical Industry', icon: Pill },
  { name: 'Plastic & Polymer', icon: Layers },
  { name: 'Paint & Coating', icon: PaintRoller },
  { name: 'Adhesive Manufacturing', icon: Droplet },
  { name: 'Industrial Manufacturing', icon: Factory },
  { name: 'Fashion Industry', icon: ShoppingBag },
];

export default function IndustriesSection() {
  return (
    <section className="relative py-20 sm:py-24 lg:py-28 bg-white overflow-hidden">
      {/* Decorative depth - subtle glows + dot grid, matching the rest of the homepage's visual language */}
      <div className="absolute -top-32 -right-32 w-105 h-105 rounded-full bg-primary-blue/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-90 h-90 rounded-full bg-primary-blue/5 blur-3xl pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #2B2B9B 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-14 lg:mb-16">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="w-8 h-0.5 bg-primary-blue" />
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px]">Our Reach</h3>
            <span className="w-8 h-0.5 bg-primary-blue" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Industries We Serve</h2>
          <p className="text-lg text-body-text max-w-3xl mx-auto leading-relaxed text-center">
            Zexora provides premium raw materials, specialized equipment, and comprehensive supply chain solutions
            to the most dynamic, high-growth industries in Bangladesh.
          </p>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-5xl mx-auto">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.05} className="group cursor-pointer">
                <div className="border border-gray-100 bg-white hover:border-primary-blue/20 shadow-sm hover:shadow-xl hover:shadow-primary-blue/5 rounded-2xl p-6 text-left transition-all duration-300 h-full flex items-center gap-4 hover:-translate-y-1">
                  <div className="w-14 h-14 shrink-0 rounded-xl bg-light-gray group-hover:bg-primary-blue flex items-center justify-center transition-colors duration-300">
                    <Icon className="w-7 h-7 text-primary-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <span className="font-semibold text-primary-dark text-sm lg:text-base leading-snug">{ind.name}</span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
