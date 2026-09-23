import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck } from 'lucide-react';
import FadeIn from '../FadeIn';

export default function VisionMissionSnapshotSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn className="mb-12">
              <h3 className="text-sm font-bold text-primary-blue uppercase tracking-[2px] mb-2">Our Foundation</h3>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-4">Our Vision & Mission</h2>
            </FadeIn>
            <div className="flex flex-col gap-10 mb-10">
              <FadeIn delay={0.1} className="pl-6 border-l-4 border-primary-blue">
                <h3 className="text-xl font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm flex items-center">
                  <TrendingUp className="mr-3 w-5 h-5 text-primary-blue" /> Vision
                </h3>
                <p className="text-lg text-body-text italic leading-relaxed text-justify">
                  "To become a globally recognized, diversified corporate institution — built on industry expertise,
                  structured governance, and a relentless commitment to delivering long-term value across every
                  sector we operate in."
                </p>
              </FadeIn>
              <FadeIn delay={0.2} className="pl-6 border-l-4 border-primary-blue">
                <h3 className="text-xl font-bold text-primary-dark mb-4 uppercase tracking-wider text-sm flex items-center">
                  <ShieldCheck className="mr-3 w-5 h-5 text-primary-blue" /> Mission
                </h3>
                <p className="text-lg text-body-text italic leading-relaxed text-justify">
                  "To build and operate a performance-driven, multi-sector business group that delivers consistent
                  quality, reliable supply, and strategic commercial value to our partners, clients, and
                  stakeholders."
                </p>
              </FadeIn>
            </div>
            <FadeIn delay={0.3}>
              <Link to="/vision-mission" className="inline-flex items-center font-bold text-primary-blue hover:text-accent-hover transition-colors">
                Our Values & Principles <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </FadeIn>
          </div>

          <FadeIn direction="left" className="relative h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl">
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
  );
}
