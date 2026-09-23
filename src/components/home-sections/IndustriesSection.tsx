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
    <section className="py-24 bg-white relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-light-gray -skew-x-12 transform origin-top hidden lg:block opacity-50"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center mb-16">
          <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">Our Reach</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">Industries We Serve</h2>
          <p className="text-lg text-body-text max-w-3xl mx-auto leading-relaxed text-justify">
            Zexora provides premium raw materials, specialized equipment, and comprehensive supply chain solutions
            to the most dynamic, high-growth industries in Bangladesh.
          </p>
        </FadeIn>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 xl:gap-8 max-w-5xl mx-auto">
          {industries.map((ind, idx) => {
            const Icon = ind.icon;
            return (
              <FadeIn key={idx} delay={idx * 0.05} className="group cursor-pointer">
                <div className="border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-100 shadow-sm hover:shadow-md rounded-2xl p-6 text-center transition-all duration-300 h-full flex flex-col items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-50/50 group-hover:bg-primary-blue/10 flex items-center justify-center transition-colors">
                    <Icon className="w-7 h-7 text-gray-400 group-hover:text-primary-blue transition-colors" />
                  </div>
                  <span className="font-semibold text-primary-dark text-sm lg:text-base">{ind.name}</span>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
