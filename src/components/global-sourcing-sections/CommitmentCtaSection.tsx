import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useGlobalSourcingContent } from './useGlobalSourcingContent';

export default function CommitmentCtaSection() {
  const c = useGlobalSourcingContent();
  return (
    <section className="py-24 bg-primary-dark text-white px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <FadeIn direction="right">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 tracking-tight">{c.commitment.heading}</h2>
          <ul className="space-y-4">
            {c.commitment.items.map((item, idx) => (
              <li key={idx} className="flex items-start bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-primary-blue mr-4 flex-shrink-0 mt-0.5" />
                <span className="text-gray-200 text-lg font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
        <FadeIn direction="left" className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 tracking-tight leading-tight">{c.cta.heading}</h2>
          <p className="text-gray-300 mb-10 text-xl leading-relaxed">{c.cta.text}</p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center bg-primary-blue text-white hover:bg-white hover:text-primary-dark px-10 py-5 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(43,43,155,0.3)] hover:shadow-lg hover:-translate-y-1 text-lg"
          >
            Contact Our Sourcing Team <ArrowRight className="ml-2 w-6 h-6" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
