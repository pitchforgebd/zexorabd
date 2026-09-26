import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import FadeIn from '../FadeIn';

export default function CtaSection() {
  return (
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
  );
}
