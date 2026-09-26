import { CheckCircle2 } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useVisionMissionContent } from './useVisionMissionContent';

export default function WhyChooseUsSection() {
  const c = useVisionMissionContent();
  return (
    <section className="py-24 bg-light-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-dark">{c.whyChooseUs.heading}</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {c.whyChooseUs.items.map((reason, idx) => (
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
  );
}
