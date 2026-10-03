import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';

export default function CtaSection() {
  return (
    <section className="relative py-20 sm:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=2000&q=80")' }}
      />
      <div className="absolute inset-0 bg-primary-dark/92 backdrop-blur-sm" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />
      <div className="absolute top-0 right-0 w-105 h-105 bg-primary-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-90 h-90 bg-primary-blue/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">
            Ready to Work with Zexora Corporation?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed text-center">
            Whether you are looking for industrial chemicals, equipment, sourcing solutions, or logistics support —
            our team is ready to assist you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center bg-primary-blue text-white hover:bg-white hover:text-primary-dark px-10 py-5 rounded-full font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 text-lg"
            >
              Get in Touch
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/divisions"
              className="w-full sm:w-auto inline-flex items-center justify-center border-2 border-white/30 hover:border-white text-white px-10 py-5 rounded-full font-bold transition-all hover:bg-white hover:text-primary-dark text-lg"
            >
              Explore Our Divisions
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
