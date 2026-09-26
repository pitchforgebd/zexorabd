import { CheckCircle2 } from 'lucide-react';
import FadeIn from '../FadeIn';
import { useVisionMissionContent } from './useVisionMissionContent';

export default function VisionMissionTextSection() {
  const c = useVisionMissionContent();
  return (
    <section className="py-32 px-4 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-16">
        <FadeIn direction="right" className="bg-gray-50 p-12 md:p-16 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary-blue">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 flex items-center tracking-tight">
            {c.vision.heading}
          </h2>
          <p className="text-xl text-body-text leading-relaxed text-justify">{c.vision.text}</p>
        </FadeIn>

        <FadeIn direction="left" className="bg-gray-50 p-12 md:p-16 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow border-l-4 border-l-primary-blue">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark mb-8 flex items-center tracking-tight">
            {c.mission.heading}
          </h2>
          <p className="text-xl text-body-text leading-relaxed mb-8 text-justify">{c.mission.intro}</p>
          <p className="text-lg font-bold text-primary-dark mb-4">{c.mission.commitmentHeading}</p>
          <ul className="space-y-4">
            {c.mission.commitments.map((item, idx) => (
              <li key={idx} className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-primary-blue mr-4 mt-1 flex-shrink-0" />
                <span className="text-body-text text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
