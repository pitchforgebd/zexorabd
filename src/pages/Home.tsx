import { Link } from 'react-router-dom';
import { ArrowRight, Globe, ShieldCheck, TrendingUp, Cpu, Truck, Users, FileText, LayoutGrid, Package, CheckCircle2, Factory, Printer, Shirt, Pill, Layers, PaintRoller, Droplet, ShoppingBag } from 'lucide-react';
import FadeIn from '../components/FadeIn';
import SEO from '../components/SEO';
import { seoData } from '../data/seoData';
import { divisions } from '../data/divisions';
import { divisionImages } from '../data/divisionImages';
import WorldMap from '../components/WorldMap';
import HeroSlider from '../components/HeroSlider';
import StatBox from '../components/StatBox';
import DivisionCard from '../components/DivisionCard';
import WhyChooseGrid from '../components/WhyChooseGrid';
import IndustriesGrid from '../components/IndustriesGrid';
import CTABanner from '../components/CTABanner';
import SupplierLogos from '../components/SupplierLogos';

const statBoxes = [
  { value: '2024', label: 'Established' },
  { value: '15+', label: 'Years of Experience' },
  { value: '6', label: 'Business Divisions' },
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

export default function Home() {
  return (
    <div className="bg-white">
      <SEO title={seoData.home.title} description={seoData.home.description} />
      {/* Section 1: Hero Banner */}
      <HeroSlider />

      {/* Section 2: About Zexora Snapshot */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">
              Who We Are
            </h3>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-6">
              Built on Experience.
            </h2>
            <p className="text-body-text mb-8 text-lg leading-relaxed text-justify">
              Zexora Corporation is a diversified multi-sector business group
              established in 2024 — built on over 15 years of industry expertise
              across industrial chemicals, printing and packaging, global
              sourcing, logistics, garments, power solutions, and more. We
              operate through 6 specialized business divisions, each structured
              for operational excellence, quality assurance, and long-term value
              delivery.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center font-bold text-primary-blue hover:text-accent-hover transition-colors"
            >
              Learn More About Us <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </FadeIn>
          <FadeIn
            direction="left"
            className="relative h-full min-h-[400px] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-end p-6 sm:p-8"
          >
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
              alt="Corporate Excellence"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-primary-dark/40 to-transparent"></div>

            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mt-auto">
              {statBoxes.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-md text-white p-4 sm:p-6 rounded-xl text-center border border-white/20 transform transition-transform hover:-translate-y-1"
                >
                  <div className="text-3xl sm:text-4xl font-bold mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-blue-100 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Section 3: Our 6 Divisions Grid */}
      <section className="py-24 bg-light-gray relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">
              Our Business Divisions
            </h3>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark tracking-tight">
              Six specialized divisions.
              <br />
              One integrated platform.
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {divisions.map((div, idx) => {
              const Icon = div.icon || LayoutGrid;
              const bgImage =
                divisionImages[div.id] && divisionImages[div.id].length > 0
                  ? divisionImages[div.id][0].url
                  : "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80";
              return (
                <FadeIn key={div.id} delay={idx * 0.1}>
                  <Link
                    to={div.path}
                    className="group block h-[420px] rounded-2xl overflow-hidden relative shadow-lg hover:shadow-2xl transition-all duration-500"
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-transform duration-700"
                      style={{ backgroundImage: `url("${bgImage}")` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/95 via-primary-dark/60 to-transparent flex flex-col justify-end p-8">
                      <div className="w-14 h-14 bg-white/10 backdrop-blur-md text-white rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-blue group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-7 h-7" />
                      </div>
                      <h4 className="text-2xl font-bold mb-3 text-white tracking-tight">
                        {div.name}
                      </h4>
                      <p className="text-blue-100/90 mb-6 text-sm leading-relaxed max-w-xs">
                        {div.tagline}
                      </p>
                      <div className="flex items-center text-primary-light font-bold tracking-wide text-sm uppercase">
                        Explore Division{" "}
                        <ArrowRight className="ml-2 w-5 h-5 transform group-hover:translate-x-3 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 4: Why Choose Zexora */}
      <section className="py-24 bg-primary-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose Zexora Corporation?
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Built on experience. Driven by performance. Trusted by industry.
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {reasons.map((reason, idx) => (
              <FadeIn
                key={idx}
                delay={idx * 0.05}
                direction="up"
                className="flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-lg font-bold mb-2 text-white">
                  {reason.title}
                </h4>
                <p className="text-blue-100 text-sm leading-relaxed">
                  {reason.desc}
                </p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Industries We Serve */}
      <section className="py-24 bg-white relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-light-gray -skew-x-12 transform origin-top hidden lg:block opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">
              Our Reach
            </h3>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark mb-4 tracking-tight">
              Industries We Serve
            </h2>
            <p className="text-lg text-body-text max-w-3xl mx-auto leading-relaxed text-justify">
              Zexora provides premium raw materials, specialized equipment, and
              comprehensive supply chain solutions to the most dynamic,
              high-growth industries in Bangladesh.
            </p>
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 xl:gap-8 max-w-5xl mx-auto">
            {industries.map((ind, idx) => {
              const Icon = ind.icon;
              return (
                <FadeIn
                  key={idx}
                  delay={idx * 0.05}
                  className="group cursor-pointer"
                >
                  <div className="border border-gray-100 bg-white hover:bg-blue-50 hover:border-blue-100 shadow-sm hover:shadow-md rounded-2xl p-6 text-center transition-all duration-300 h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50/50 group-hover:bg-primary-blue/10 flex items-center justify-center transition-colors">
                      <Icon className="w-7 h-7 text-gray-400 group-hover:text-primary-blue transition-colors" />
                    </div>
                    <span className="font-semibold text-primary-dark text-sm lg:text-base">
                      {ind.name}
                    </span>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Section 6: Global Sourcing Snapshot */}
      <section className="py-24 bg-[#0A0D14] overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-blue/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn direction="right">
              <h3 className="text-sm font-bold text-primary-light uppercase tracking-[2px] mb-2 flex items-center">
                <Globe className="w-4 h-4 mr-2" /> Global Presence
              </h3>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
                Our Global Sourcing Network
              </h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed text-justify">
                We source premium industrial products, chemicals, and materials
                from internationally recognized manufacturers across 9+
                countries — ensuring world-class quality at competitive prices
                for Bangladesh's growing industries.
              </p>
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  "🇨🇳 China",
                  "🇮🇳 India",
                  "🇩🇪 Germany",
                  "🇰🇷 South Korea",
                  "🇸🇬 Singapore",
                  "🇲🇾 Malaysia",
                  "🇯🇵 Japan",
                  "🇹🇷 Turkey",
                  "🇹🇼 Taiwan",
                ].map((country) => (
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
                View Our Sourcing Network{" "}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </FadeIn>
            <FadeIn
              direction="left"
              className="relative h-[350px] md:h-[450px] w-full rounded-3xl overflow-hidden flex items-center justify-center p-4"
            >
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(43,43,155,0.15),transparent_70%)]"></div>
              <WorldMap />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Supplier Logos Carousel */}
      <SupplierLogos />

      {/* Section 8: Our Concerns */}
      <section className="py-24 bg-white border-t border-b border-gray-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <FadeIn className="text-center mb-16">
            <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">
              Subsidiaries & Ecosystem
            </h3>
            <h2 className="text-3xl md:text-5xl font-bold text-primary-dark tracking-tight">
              Our Sister Concerns
            </h2>
          </FadeIn>

          <div className="max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-100 rounded-3xl p-8 md:p-12 shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                  {/* Logo Side */}
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

                  {/* Content Side */}
                  <div className="w-full md:w-2/3">
                    <h4 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-3">
                      One-Stop Printing & Packaging Solutions
                    </h4>
                    <h3 className="text-2xl md:text-3xl font-bold text-primary-dark mb-4 transition-colors duration-300">
                      Proactive Trade International
                    </h3>
                    <div className="text-body-text space-y-4 text-[15px] md:text-base leading-relaxed text-justify">
                      <p>
                        Founded in 2024, Proactive Trade International is a
                        trusted printing and packaging solutions provider in
                        Bangladesh. Stands at the forefront of technical
                        excellence in the printing and packaging industry.
                      </p>
                      <p>
                        We specialize in high-performance advanced printing &
                        packaging industries machineries & consumables.
                        Headquartered in Dhaka, Bangladesh, We proudly serve
                        over 100+ top-tier printing and packaging companies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 9: Vision & Mission Snapshot */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <FadeIn className="mb-12">
                <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">
                  Our Foundation
                </h3>
                <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">
                  Our Vision & Mission
                </h2>
              </FadeIn>
              <div className="flex flex-col gap-10 mb-10">
                <FadeIn
                  delay={0.1}
                  className="pl-6 border-l-4 border-primary-blue"
                >
                  <h3 className="text-xl font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm flex items-center">
                    <TrendingUp className="mr-3 w-5 h-5 text-primary-blue" />{" "}
                    Vision
                  </h3>
                  <p className="text-lg text-body-text italic leading-relaxed text-justify">
                    "To become a globally recognized, diversified corporate
                    institution — built on industry expertise, structured
                    governance, and a relentless commitment to delivering
                    long-term value across every sector we operate in."
                  </p>
                </FadeIn>
                <FadeIn
                  delay={0.2}
                  className="pl-6 border-l-4 border-primary-blue"
                >
                  <h3 className="text-xl font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm flex items-center">
                    <ShieldCheck className="mr-3 w-5 h-5 text-primary-blue" />{" "}
                    Mission
                  </h3>
                  <p className="text-lg text-body-text italic leading-relaxed text-justify">
                    "To build and operate a performance-driven, multi-sector
                    business group that delivers consistent quality, reliable
                    supply, and strategic commercial value to our partners,
                    clients, and stakeholders."
                  </p>
                </FadeIn>
              </div>
              <FadeIn delay={0.3}>
                <Link
                  to="/vision-mission"
                  className="inline-flex items-center font-bold text-primary-blue hover:text-accent-hover transition-colors"
                >
                  Our Values & Principles{" "}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </FadeIn>
            </div>

            <FadeIn
              direction="left"
              className="relative h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80"
                alt="Corporate Vision and Mission"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary-blue/10 mix-blend-multiply"></div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Section 8: CTA Banner */}
      <section className="py-24 relative text-center px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=2000&q=80")',
          }}
        />
        <div className="absolute inset-0 bg-primary-dark/90 backdrop-blur-sm"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
              Ready to Work with Zexora Corporation?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Whether you are looking for industrial chemicals, equipment,
              sourcing solutions, or logistics support — our team is ready to
              assist you.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-primary-blue text-white hover:bg-white hover:text-primary-dark px-10 py-5 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              Get in Touch <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
