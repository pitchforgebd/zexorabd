import { Link } from 'react-router-dom';
import { ArrowRight, Beaker, Printer, Globe, Truck, Shirt, Cog, Zap, ShoppingBag, Plane } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const nineDivisions = [
  { name: 'Industrial Chemicals & Ink Solutions', icon: Beaker },
  { name: 'Print & Pack Solutions', icon: Printer },
  { name: 'Global Procurement & Strategic Sourcing', icon: Globe },
  { name: 'Logistics & Air Shipping Solutions', icon: Truck },
  { name: 'Apparel & Garments', icon: Shirt },
  { name: 'Industrial Equipment & Machinery Solutions', icon: Cog },
  { name: 'Power Backup & Electrical Infrastructure Solutions', icon: Zap },
  { name: 'Fashion & Lifestyle', icon: ShoppingBag },
  { name: 'Travel & Corporate Travel Management', icon: Plane }
];

export default function About() {
  return (
    <div className="bg-white pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight">About Zexora Corporation</h1>
            <p className="text-xl md:text-3xl text-blue-100 font-medium tracking-wide">Uniting Dreams for a Brighter Tomorrow</p>
          </FadeIn>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 text-center tracking-tight">Who We Are</h2>
          <div className="prose prose-lg mx-auto text-body-text space-y-6 text-xl leading-relaxed text-justify">
            <p>
              Zexora Corporation is a diversified multi-sector business group established in 2024 with a strategic mandate to build an integrated and professionally managed corporate platform.
            </p>
            <p>
              The foundation of the Group is rooted in over 15 years of industry experience spanning industrial manufacturing, printing and packaging, chemical technologies, global sourcing, supply chain coordination, and commercial operations. This practical expertise allows us to operate with market intelligence, technical depth, and disciplined execution.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Divisions */}
      <section className="py-24 px-4 bg-light-gray">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6 tracking-tight">Our Business Divisions</h2>
            <p className="text-xl text-body-text leading-relaxed text-justify">
              Zexora Corporation operates across multiple specialized business divisions — each structured around operational efficiency, quality assurance, robust governance frameworks, and long-term scalability:
            </p>
          </FadeIn>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nineDivisions.map((div, idx) => {
              const Icon = div.icon;
              return (
              <FadeIn key={idx} delay={idx * 0.1}>
                <div className="block p-8 rounded-2xl border border-gray-100 shadow-sm bg-white h-full flex items-center gap-4">
                  <div className="bg-blue-50 text-primary-blue p-3 rounded-lg flex-shrink-0">
                     <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-primary-dark">{div.name}</h3>
                </div>
              </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Competitive Advantage */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <FadeIn>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 text-center tracking-tight">Our Competitive Advantage</h2>
          <div className="prose prose-lg mx-auto text-body-text space-y-6 text-xl leading-relaxed text-justify">
            <p>
              Our differentiation lies in our integrated model — combining deep industry experience, structured commercial capability, verified global supplier networks, and performance-based management systems.
            </p>
            <p>
              Unlike conventional trading or agency models, Zexora is designed as a full-service corporate platform — capable of managing procurement, logistics, quality assurance, and client delivery within a single structured ecosystem.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Our Vision */}
      <section className="py-24 px-4 bg-light-gray">
        <FadeIn className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 text-center tracking-tight">Our Vision</h2>
          <div className="prose prose-lg mx-auto text-body-text space-y-6 text-xl leading-relaxed text-justify">
            <p>
              Zexora Corporation is being developed as a long-term institutional platform — designed to grow responsibly, expand strategically, and deliver measurable value across sectors and stakeholders.
            </p>
            <p>
              We do not pursue volume for its own sake. We pursue excellence, reliability, and the kind of long-term trust that only consistent performance can build.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-dark text-white text-center px-4">
        <FadeIn className="max-w-3xl mx-auto">
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center bg-primary-blue text-white hover:bg-white hover:text-primary-dark px-10 py-4 rounded-full font-bold transition-all text-lg shadow-[0_0_20px_rgba(43,43,155,0.3)] hover:shadow-lg hover:-translate-y-1"
          >
            Get in Touch <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </FadeIn>
      </section>
    </div>
  );
}
