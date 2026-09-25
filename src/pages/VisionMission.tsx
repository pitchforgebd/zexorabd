import { TrendingUp, ShieldCheck, Target, Heart, Award, CheckCircle2, Factory, Printer, Package, Shirt, Pill, Layers, PaintRoller, Droplet, ShoppingBag } from 'lucide-react';
import FadeIn from '../components/FadeIn';

const coreValues = [
  { icon: Target, title: "Trust", desc: "We build every relationship — with clients, partners, and suppliers — on a foundation of honesty, transparency, and consistent delivery. Trust is not claimed; it is earned through action." },
  { icon: ShieldCheck, title: "Integrity", desc: "We conduct our business with the highest ethical standards. We do what we say, say what we mean, and never compromise our principles for short-term gain." },
  { icon: Heart, title: "Responsibility", desc: "We take ownership of our commitments — to our clients, our team, and the communities in which we operate. Responsible business is not optional; it is at the core of how Zexora is built." },
  { icon: TrendingUp, title: "Creativity", desc: "We embrace innovation, strategic thinking, and creative problem-solving to continuously improve our services, explore new opportunities, and deliver better outcomes for our partners." },
  { icon: Award, title: "Excellence", desc: "In every division, every transaction, and every client interaction — we set and maintain the highest standards of quality, professionalism, and performance." },
];

const reasons = [
  { title: 'Reliable Global Sourcing Network', desc: 'Verified suppliers from 9+ countries worldwide' },
  { title: 'Consistent Industrial Quality', desc: 'Strict quality standards maintained at every supply stage' },
  { title: 'Competitive Commercial Support', desc: 'Transparent pricing and sustainable long-term value' },
  { title: 'Deep Technical Product Knowledge', desc: '15+ years of hands-on industry expertise' },
  { title: 'Fast & Efficient Supply Chain', desc: 'End-to-end logistics coordination and on-time delivery' },
  { title: 'Long-Term Partnership Approach', desc: 'We build relationships, not just transactions' },
  { title: 'Import & Indenting Support', desc: 'Full commercial and documentation support for imports' },
  { title: 'Multi-Sector Capability', desc: '9 divisions under one trusted corporate platform' },
];

const industries = [
  { name: 'Printing Industry', icon: Printer },
  { name: 'Packaging Industry', icon: Package },
  { name: 'Textile & Garments', icon: Shirt },
  { name: 'Pharmaceutical Industry', icon: Pill },
  { name: 'Plastic & Polymer', icon: Layers },
  { name: 'Paint & Coating', icon: PaintRoller },
  { name: 'Adhesive Manufacturing', icon: Droplet },
  { name: 'Industrial Manufacturing', icon: Factory },
  { name: 'Fashion Industry', icon: ShoppingBag }
];

export default function VisionMission() {
  return (
    <div className="bg-white pt-24">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-blue to-accent-hover text-white py-24 px-4 text-center overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <FadeIn>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-white tracking-tight leading-tight">Our Vision & Mission</h1>
            <p className="text-xl md:text-3xl text-blue-100 font-medium tracking-wide">The Principles That Drive Zexora Corporation</p>
          </FadeIn>
        </div>
      </section>

      {/* Vision & Mission Text */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16">
          <FadeIn direction="right" className="bg-gray-50 p-12 md:p-16 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary-blue">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 flex items-center tracking-tight">
              Our Vision
            </h2>
            <p className="text-xl text-body-text leading-relaxed text-justify">
              To become a globally recognized, diversified corporate institution — built on industry expertise, structured governance, and a relentless commitment to delivering long-term value across every sector we operate in. We envision Zexora Corporation as a trusted multi-sector business platform where each division operates with institutional discipline, strategic clarity, and measurable performance standards — contributing to the industrial and commercial growth of Bangladesh and beyond.
            </p>
          </FadeIn>

          <FadeIn direction="left" className="bg-gray-50 p-12 md:p-16 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary-blue">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 flex items-center tracking-tight">
              Our Mission
            </h2>
            <p className="text-xl text-body-text leading-relaxed mb-8 text-justify">
              To build and operate a performance-driven, multi-sector business group that delivers consistent quality, reliable supply, and strategic commercial value to our partners, clients, and stakeholders.
            </p>
            <p className="text-lg font-bold text-primary-dark mb-4">We are committed to:</p>
            <ul className="space-y-4">
              {[
                "Delivering high-quality industrial products and services across every division",
                "Building long-term relationships founded on trust, transparency, and reliability",
                "Developing structured business systems that ensure operational excellence",
                "Creating sustainable value through ethical leadership and responsible growth",
                "Supporting the industrial and commercial development of Bangladesh through world-class sourcing and supply solutions"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <CheckCircle2 className="w-6 h-6 text-primary-blue mr-4 mt-1 flex-shrink-0" />
                  <span className="text-body-text text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </FadeIn>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-primary-dark px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Our Core Values</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <FadeIn key={idx} delay={idx * 0.1} direction="up">
                  <div className="bg-[#242424] rounded-xl p-8 text-center h-full border border-gray-800 hover:border-primary-blue transition-colors group">
                    <div className="w-16 h-16 bg-[#1f1f1f] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-blue transition-colors">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-3">{val.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{val.desc}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose & Industries reuse from Home somewhat matching */}
      {/* Section: Why Choose Zexora */}
      <section className="py-24 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">Why Choose Zexora Corporation?</h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {reasons.map((reason, idx) => (
              <FadeIn key={idx} delay={idx * 0.05} direction="up" className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-primary-blue" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-primary-dark">{reason.title}</h4>
                <p className="text-body-text text-sm leading-relaxed">{reason.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section: Industries We Serve */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary-dark mb-4">Industries We Serve</h2>
          </FadeIn>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
              <FadeIn key={idx} delay={idx * 0.05} className="group cursor-pointer">
                <div className="border border-gray-100 bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-colors h-full flex flex-col items-center justify-center gap-4">
                  <Icon className="w-8 h-8 text-gray-400 group-hover:text-primary-blue transition-colors" />
                  <span className="font-semibold text-primary-dark">{ind.name}</span>
                </div>
              </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
