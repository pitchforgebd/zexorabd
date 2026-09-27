import FadeIn from '../FadeIn';
import { useOurStoryContent } from './useOurStoryContent';

export default function TimelineSection() {
  const c = useOurStoryContent();
  const milestones = c.timeline.milestones;

  if (milestones.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn className="mb-14">
          <span className="text-xs font-bold uppercase tracking-[2px] text-primary-blue">{c.timeline.eyebrow}</span>
          <h2 className="text-3xl md:text-4xl font-bold text-primary-dark tracking-tight mt-3">{c.timeline.heading}</h2>
        </FadeIn>

        <div className="relative pl-8 sm:pl-10">
          <div className="absolute left-1.25 sm:left-1.75 top-2 bottom-2 w-px bg-gray-200" />
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <FadeIn key={i} delay={i * 0.08} className="relative">
                <span className="absolute -left-8 sm:-left-10 top-1.5 w-3 h-3 rounded-full bg-primary-blue ring-4 ring-white" />
                <span className="block text-xs font-bold uppercase tracking-[2px] text-primary-blue mb-2">{m.label}</span>
                <h3 className="text-lg font-bold text-primary-dark mb-2">{m.title}</h3>
                <p className="text-body-text leading-relaxed">{m.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
