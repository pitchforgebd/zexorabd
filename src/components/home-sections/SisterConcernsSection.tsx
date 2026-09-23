import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';

export default function SisterConcernsSection() {
  return (
    <section className="py-24 bg-white border-t border-b border-gray-100 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <FadeIn className="text-center mb-16">
          <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">Subsidiaries & Ecosystem</h3>
          <h2 className="text-3xl md:text-5xl font-bold text-primary-dark tracking-tight">Our Sister Concerns</h2>
        </FadeIn>

        <div className="max-w-5xl mx-auto">
          <FadeIn delay={0.1}>
            <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                <div className="w-full md:w-1/3 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-10">
                  <img
                    src="https://i.ibb.co.com/7dbkZsNS/Proactive-Trade-International-Logo.png"
                    alt="Proactive Trade International"
                    className="max-w-full h-auto w-48 md:w-full object-contain filter grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500 mb-8"
                  />
                  <a
                    href="https://proactive.com.bd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white rounded-full font-semibold transition-all duration-300 w-full"
                  >
                    Visit Website <ArrowRight className="ml-2 w-4 h-4" />
                  </a>
                </div>

                <div className="w-full md:w-2/3">
                  <h4 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-3">One-Stop Printing & Packaging Solutions</h4>
                  <h3 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4 transition-colors duration-300">Proactive Trade International</h3>
                  <div className="text-body-text space-y-4 text-[15px] md:text-base leading-relaxed text-justify">
                    <p>
                      Founded in 2024, Proactive Trade International is a trusted printing and packaging solutions
                      provider in Bangladesh. Stands at the forefront of technical excellence in the printing and
                      packaging industry.
                    </p>
                    <p>
                      We specialize in high-performance advanced printing & packaging industries machineries &
                      consumables. Headquartered in Dhaka, Bangladesh, We proudly serve over 100+ top-tier printing
                      and packaging companies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
