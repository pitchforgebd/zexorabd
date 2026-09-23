import { Link } from 'react-router-dom';
import { ArrowRight, Globe, CheckCircle2, Box, Ship, Handshake } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import SEO from '../components/SEO';
import { seoData } from '../data/seoData';

import WorldMap from '../components/WorldMap';

const countries = [
  { flag: '🇨🇳', name: 'China', items: 'Industrial chemicals, printing inks, machinery, packaging materials, electronics' },
  { flag: '🇮🇳', name: 'India', items: 'Specialty chemicals, pharmaceutical raw materials, textile auxiliaries' },
  { flag: '🇩🇪', name: 'Germany', items: 'High-precision chemicals, industrial equipment, printing technologies' },
  { flag: '🇰🇷', name: 'South Korea', items: 'Advanced materials, electronics, industrial components' },
  { flag: '🇸🇬', name: 'Singapore', items: 'Specialty chemicals, trading hub, regional logistics support' },
  { flag: '🇲🇾', name: 'Malaysia', items: 'Palm-based chemicals, industrial polymers, raw materials' },
  { flag: '🇯🇵', name: 'Japan', items: 'High-performance industrial materials, precision equipment' },
  { flag: '🇹🇷', name: 'Turkey', items: 'Textile chemicals, dyes, industrial raw materials' },
  { flag: '🇹🇼', name: 'Taiwan', items: 'Electronics components, industrial machinery parts' },
];

const models = [
  { 
    icon: Ship, 
    title: 'Import & Trading', 
    desc: 'We directly import and supply industrial products to manufacturers, factories, and industrial buyers across Bangladesh. Our import operations are supported by structured logistics coordination, customs documentation, and end-to-end delivery management — ensuring our clients receive their products on time and in full compliance.' 
  },
  { 
    icon: Handshake, 
    title: 'Indenting & Sourcing', 
    desc: 'For clients requiring specific products from international suppliers, we provide professional indenting and commercial sourcing services. We identify verified suppliers, negotiate competitive pricing, coordinate sampling and quality confirmation, and manage the full commercial process from initial inquiry to final delivery.' 
  },
  { 
    icon: Box, 
    title: 'Bulk Industrial Supply', 
    desc: 'For clients with continuous and high-volume production requirements, we offer structured bulk supply solutions — including scheduled delivery planning, consistent quality assurance, and dedicated account management. Our bulk supply model is designed to ensure uninterrupted production operations for our industrial partners.' 
  }
];

export default function GlobalSourcing() {
  return (
    <div className="bg-white pt-24">
      <SEO title={seoData.globalSourcing.title} description={seoData.globalSourcing.description} />
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
        <FadeIn className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">Our Global Sourcing Network</h1>
          <p className="text-xl md:text-3xl text-blue-100 font-medium tracking-wide">Connecting Bangladesh's Industries with the World's Best Suppliers</p>
        </FadeIn>
      </section>

      {/* Intro & Map */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <span className="text-primary-blue font-bold tracking-wider uppercase text-sm mb-4 block">Strategic Network</span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-6 tracking-tight leading-tight">World-Class Quality,<br/><span className="text-primary-blue">Sourced Globally.</span></h2>
            <div className="w-20 h-1.5 bg-primary-blue mb-8 rounded-full"></div>
            <p className="text-lg md:text-xl text-body-text leading-relaxed text-justify mb-10">
              Zexora Corporation maintains an active and verified global sourcing network, connecting Bangladeshi industries with internationally recognized manufacturers and suppliers of industrial chemicals, specialty materials, printing consumables, equipment, and commercial products. We source from the world's leading industrial manufacturing nations, ensuring our clients receive products that meet international quality standards at competitive market prices.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="border-l-4 border-primary-blue pl-5">
                <h4 className="text-4xl font-bold text-primary-dark tracking-tighter">9+</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Sourcing<br/>Countries</p>
              </div>
              <div className="border-l-4 border-primary-blue pl-5">
                <h4 className="text-4xl font-bold text-primary-dark tracking-tighter">100%</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-2">Verified<br/>Suppliers</p>
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
                <h3 className="text-2xl md:text-3xl font-bold text-primary-dark tracking-tight">Global Reach</h3>
              </div>
              <p className="text-body-text text-lg leading-relaxed max-w-md">Seamless integration from international manufacturers directly to local industries.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Country Cards */}
      <section className="py-24 bg-light-gray px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4 tracking-tight">Countries We Source From</h2>
            <p className="text-lg text-body-text max-w-2xl mx-auto">A strategic footprint across key industrial manufacturing hubs globally.</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {countries.map((country, idx) => (
              <FadeIn key={idx} delay={idx * 0.05} direction="up">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-primary-blue hover:shadow-xl transition-all duration-300 flex items-start group hover:-translate-y-1 h-full">
                  <div className="text-4xl mr-5 transform group-hover:scale-110 transition-transform">{country.flag}</div>
                  <div>
                    <h3 className="text-xl font-bold text-primary-dark mb-2 group-hover:text-primary-blue transition-colors">{country.name}</h3>
                    <p className="text-body-text leading-relaxed">{country.items}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Business Models */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark tracking-tight">Our Business Models</h2>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-8">
            {models.map((model, idx) => {
              const Icon = model.icon;
              return (
                <FadeIn key={idx} delay={idx * 0.1}>
                  <div className="p-10 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 text-center h-full group bg-gray-50 hover:bg-white hover:-translate-y-1">
                    <div className="w-20 h-20 bg-white shadow-sm rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:bg-primary-blue transition-colors">
                      <Icon className="w-10 h-10 text-primary-blue group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary-dark mb-4 group-hover:text-primary-blue transition-colors">{model.title}</h3>
                    <p className="text-body-text leading-relaxed font-medium">{model.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Commitment & CTA */}
      <section className="py-24 bg-primary-dark text-white px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">Our Sourcing Commitment</h2>
            <ul className="space-y-4">
              {[
                "Verified and audited supplier relationships",
                "Consistent quality standards across all sourcing channels",
                "Transparent pricing and competitive commercial terms",
                "Dedicated sourcing support and technical consultation",
                "Reliable delivery timelines and shipment coordination"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                  <CheckCircle2 className="w-6 h-6 text-primary-blue mr-4 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-200 text-lg font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
          <FadeIn direction="left" className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">Need global sourcing support?</h2>
            <p className="text-gray-300 mb-10 text-xl leading-relaxed">
              Let our experts handle the complexities of international trade. Get in touch with us to discuss your specific industrial requirements.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center justify-center bg-primary-blue text-white hover:bg-white hover:text-primary-dark px-10 py-5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(43,43,155,0.3)] hover:shadow-lg hover:-translate-y-1 text-lg"
            >
              Contact Our Sourcing Team <ArrowRight className="ml-2 w-6 h-6" />
            </Link>
          </FadeIn>
        </div>
      </section>

    </div>
  );
}
