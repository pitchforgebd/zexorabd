import FadeIn from '../FadeIn';
import { useOurStoryContent } from './useOurStoryContent';

export default function StorySection() {
  const c = useOurStoryContent();

  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="space-y-6 text-lg text-body-text leading-relaxed">
            {c.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </FadeIn>

        {c.pullQuote && (
          <FadeIn delay={0.1}>
            <blockquote className="my-14 text-2xl md:text-3xl font-bold text-primary-dark italic text-center leading-snug border-y border-gray-100 py-10">
              "{c.pullQuote}"
            </blockquote>
          </FadeIn>
        )}
      </div>

      {c.milestones.length > 0 && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {c.milestones.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative pl-6 border-l-2 border-primary-blue/20">
                  <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-primary-blue" />
                  <span className="text-xs font-bold uppercase tracking-[2px] text-primary-blue">{m.label}</span>
                  <h3 className="text-lg font-bold text-primary-dark mt-2 mb-2">{m.title}</h3>
                  <p className="text-sm text-body-text leading-relaxed">{m.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
