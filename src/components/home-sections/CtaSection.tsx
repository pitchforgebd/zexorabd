import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';

export default function CtaSection() {
  return (
    <section className="py-24 relative text-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=2000&q=80")' }}
      />
      <div className="absolute inset-0 bg-primary-dark/90 backdrop-blur-sm"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <FadeIn>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">Ready to Work with Zexora Corporation?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto leading-relaxed">
            Whether you are looking for industrial chemicals, equipment, sourcing solutions, or logistics support —
            our team is ready to assist you.
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
  );
}
