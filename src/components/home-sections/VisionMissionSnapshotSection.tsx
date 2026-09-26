import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck, Quote } from 'lucide-react';
import FadeIn from '../FadeIn';

export default function VisionMissionSnapshotSection() {
  return (
    <section className="relative py-20 sm:py-24 bg-white overflow-hidden">
      <div className="absolute -top-24 -left-24 w-90 h-90 rounded-full bg-primary-blue/5 blur-3xl pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <FadeIn className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-0.5 bg-primary-blue shrink-0" />
                <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px]">Our Foundation</h3>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Our Vision & Mission</h2>
            </FadeIn>

            <div className="flex flex-col gap-5 mb-10">
              <FadeIn
                delay={0.1}
                className="group relative bg-white rounded-2xl p-6 shadow-md ring-1 ring-black/5 hover:ring-primary-blue/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Quote className="absolute -top-3 -right-3 w-20 h-20 text-primary-blue/5 rotate-12 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-light-gray group-hover:bg-primary-blue flex items-center justify-center transition-colors duration-300">
                    <TrendingUp className="w-6 h-6 text-primary-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary-dark mb-2 uppercase tracking-wider">Vision</h3>
                    <p className="text-body-text leading-relaxed italic">
                      "To become a globally recognized, diversified corporate institution — built on industry
                      expertise, structured governance, and a relentless commitment to delivering long-term value
                      across every sector we operate in."
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn
                delay={0.2}
                className="group relative bg-white rounded-2xl p-6 shadow-md ring-1 ring-black/5 hover:ring-primary-blue/30 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <Quote className="absolute -top-3 -right-3 w-20 h-20 text-primary-blue/5 rotate-12 pointer-events-none" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 shrink-0 rounded-xl bg-light-gray group-hover:bg-primary-blue flex items-center justify-center transition-colors duration-300">
                    <ShieldCheck className="w-6 h-6 text-primary-blue group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary-dark mb-2 uppercase tracking-wider">Mission</h3>
                    <p className="text-body-text leading-relaxed italic">
                      "To build and operate a performance-driven, multi-sector business group that delivers
                      consistent quality, reliable supply, and strategic commercial value to our partners, clients,
                      and stakeholders."
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.3}>
              <Link
                to="/vision-mission"
                className="group inline-flex items-center gap-2 font-semibold text-primary-blue border-2 border-primary-blue/20 hover:border-primary-blue hover:bg-primary-blue hover:text-white transition-all px-6 py-3 rounded-full"
              >
                Our Values & Principles
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </FadeIn>
          </div>

          <FadeIn direction="left" className="relative h-100 sm:h-125 w-full rounded-3xl overflow-hidden shadow-2xl ring-1 ring-black/5">
            <img
              src="https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=1200&q=80"
              alt="Corporate Vision and Mission"
              className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/70 via-primary-dark/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-blue" />
                Guiding Every Decision We Make
              </span>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
